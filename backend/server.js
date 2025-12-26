// backend/server.js
'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const multer = require('multer');

// Firebase Admin (opcional: si hay credenciales)
let admin = null;
try {
  admin = require('firebase-admin');
} catch (e) {
  admin = null;
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// ---------- Paths / Storage local (Render Disk recomendado) ----------
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data'); // local dev
const RENDER_DISK_DIR = process.env.RENDER_DISK_DIR || '/var/data';    // Render Disk mount recomendado
const USE_RENDER_DISK = process.env.USE_RENDER_DISK === '1';           // opcional

const BASE_STORAGE_DIR = USE_RENDER_DISK ? RENDER_DISK_DIR : DATA_DIR;
const CLUBS_FILE = path.join(DATA_DIR, 'clubs.json'); // tus datos de clubes (como ya tenías)
const LOCAL_UPLOADS_DIR = path.join(BASE_STORAGE_DIR, 'uploads');
const LOCAL_CLUB_LOGOS_DIR = path.join(LOCAL_UPLOADS_DIR, 'club-logos');

// Servir logos locales si caemos al modo local
app.use('/uploads', express.static(LOCAL_UPLOADS_DIR));

// ---------- Helpers ----------
async function ensureDirs() {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  await fsp.mkdir(LOCAL_CLUB_LOGOS_DIR, { recursive: true });
}
function isValidBucketName(b) {
  // bucket real suele ser xxxx.appspot.com o un bucket GCS real, NO una URL web.app
  if (!b) return false;
  if (b.includes('web.app') || b.startsWith('http')) return false;
  return true;
}

async function readClubs() {
  try {
    const raw = await fsp.readFile(CLUBS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
async function writeClubs(clubs) {
  await fsp.writeFile(CLUBS_FILE, JSON.stringify(clubs, null, 2), 'utf-8');
}

function sanitizeFileName(name) {
  return name
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.\-_]/g, '')
    .toLowerCase();
}

// ---------- Firebase init (si hay credenciales) ----------
let firebaseReady = false;
let bucket = null;
let bucketMode = 'local'; // 'firebase' o 'local'

function initFirebaseIfPossible() {
  if (!admin) return;

  if (firebaseReady) return;

  try {
    const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

    // Si no hay service account, no iniciamos Firebase
    if (!serviceAccountRaw) {
      firebaseReady = false;
      bucket = null;
      bucketMode = 'local';
      return;
    }

    const serviceAccount = JSON.parse(serviceAccountRaw);

    // Inicializa Firebase Admin
    if (!admin.apps.length) {
      const initConfig = {
        credential: admin.credential.cert(serviceAccount),
      };
      if (isValidBucketName(storageBucket)) {
        initConfig.storageBucket = storageBucket;
      }
      admin.initializeApp(initConfig);
    }

    // Si hay bucket válido, lo usamos
    if (isValidBucketName(storageBucket)) {
      bucket = admin.storage().bucket(storageBucket);
      bucketMode = 'firebase';
    } else {
      bucket = null;
      bucketMode = 'local';
    }

    firebaseReady = true;
  } catch (err) {
    firebaseReady = false;
    bucket = null;
    bucketMode = 'local';
  }
}

// Multer: recibimos archivo en memoria (más simple)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// ---------- Health ----------
app.get('/api/health', async (req, res) => {
  initFirebaseIfPossible();
  await ensureDirs();

  res.json({
    ok: true,
    firebaseModule: !!admin,
    firebaseReady,
    bucketMode,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || null,
    note:
      bucketMode === 'firebase'
        ? 'Subidas irán a Firebase Storage (bucket real tipo *.appspot.com).'
        : 'Subidas irán a almacenamiento local (Render Disk recomendado).',
  });
});

// ---------- Crear club (ejemplo mínimo, por si lo usás) ----------
app.post('/api/clubs', async (req, res) => {
  await ensureDirs();

  const { name, city, logoUrl } = req.body || {};
  if (!name || !city) {
    return res.status(400).json({ error: 'Faltan campos: name y city son obligatorios' });
  }

  const clubs = await readClubs();
  const nextId = clubs.length ? Math.max(...clubs.map(c => Number(c.id) || 0)) + 1 : 1;

  const club = { id: nextId, name, city, logoUrl: logoUrl || '' };
  clubs.push(club);
  await writeClubs(clubs);

  res.status(201).json(club);
});

// ---------- Subir logo (Firebase si existe bucket; si no, local) ----------
app.post('/api/upload-club-logo', upload.single('logo'), async (req, res) => {
  initFirebaseIfPossible();
  await ensureDirs();

  try {
    const clubId = Number(req.body.clubId || req.body.id || req.query.clubId || 0);
    if (!clubId) return res.status(400).json({ error: 'Falta clubId' });

    if (!req.file) return res.status(400).json({ error: 'Falta archivo (logo)' });

    const original = req.file.originalname || 'logo.png';
    const safeName = sanitizeFileName(original);
    const ext = path.extname(safeName) || '.png';
    const filename = `club-${clubId}-${Date.now()}${ext}`;
    const objectPath = `club-logos/${filename}`;

    let publicUrl = '';

    // --- MODO FIREBASE ---
    if (bucketMode === 'firebase' && bucket) {
      const file = bucket.file(objectPath);

      await file.save(req.file.buffer, {
        contentType: req.file.mimetype || 'image/png',
        resumable: false,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });

      // OJO: si tu bucket NO es público, usamos Signed URL
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: '2035-01-01', // largo plazo
      });

      publicUrl = signedUrl;
    } else {
      // --- MODO LOCAL (Render Disk / local dev) ---
      const dest = path.join(LOCAL_CLUB_LOGOS_DIR, filename);
      await fsp.writeFile(dest, req.file.buffer);
      // URL pública desde tu backend:
      publicUrl = `${req.protocol}://${req.get('host')}/uploads/club-logos/${filename}`;
    }

    // Actualizar club en clubs.json
    const clubs = await readClubs();
    const idx = clubs.findIndex(c => Number(c.id) === clubId);
    if (idx !== -1) {
      clubs[idx].logoUrl = publicUrl;
      await writeClubs(clubs);
    }

    return res.json({
      ok: true,
      clubId,
      logoUrl: publicUrl,
      mode: bucketMode,
    });
  } catch (err) {
    // devolvemos el error real para que no adivines más
    return res.status(500).json({
      error: 'Error subiendo logo',
      detail: err?.message || String(err),
    });
  }
});

// ---------- Root ----------
app.get('/', (req, res) => {
  res.send('ABNECH backend OK. Usa /api/health');
});

// ---------- Start ----------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
