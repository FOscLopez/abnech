// backend/server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Firebase Admin
const admin = require("firebase-admin");

// =====================
// CONFIG
// =====================
const app = express();
app.use(express.json({ limit: "10mb" }));

// ✅ CORS (agregá acá tus dominios)
const ALLOWED_ORIGINS = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://abnech-basket.web.app",
  "https://abnech-basket.firebaseapp.com",
  "https://abnech-basket.web.app/",
  "https://abnech-basket.firebaseapp.com/",
];

app.use(
  cors({
    origin: function (origin, cb) {
      // permitir llamadas server-to-server o tools sin origin
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error("CORS: Origin no permitido -> " + origin));
    },
    credentials: true,
  })
);

// =====================
// FIREBASE ADMIN INIT
// =====================
// ✅ Recomendado: usar variable de entorno FIREBASE_SERVICE_ACCOUNT (JSON completo)
// Alternativa: archivo local backend/serviceAccountKey.json (solo local / Render secret file)
function initFirebaseAdmin() {
  if (admin.apps.length) return;

  let serviceAccount = null;

  // 1) desde ENV (preferido)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
      console.error("❌ FIREBASE_SERVICE_ACCOUNT no es JSON válido:", e);
    }
  }

  // 2) desde archivo (fallback)
  if (!serviceAccount) {
    const keyPath = path.join(__dirname, "serviceAccountKey.json");
    if (fs.existsSync(keyPath)) {
      serviceAccount = require(keyPath);
    }
  }

  if (!serviceAccount) {
    console.error(
      "❌ No se encontró service account. Definí FIREBASE_SERVICE_ACCOUNT o colocá backend/serviceAccountKey.json"
    );
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "abnech-basket.firebasestorage.app",
  });

  console.log("✅ Firebase Admin inicializado");
}

initFirebaseAdmin();

const bucket = admin.apps.length ? admin.storage().bucket() : null;

// =====================
// FILES / DATA
// =====================
const DATA_DIR = path.join(__dirname, "data");
const CLUBS_PATH = path.join(DATA_DIR, "clubs.json");

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(CLUBS_PATH)) fs.writeFileSync(CLUBS_PATH, "[]", "utf-8");
}
ensureDataFiles();

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function getNextId(items) {
  const maxId = items.reduce((m, it) => Math.max(m, Number(it.id) || 0), 0);
  return maxId + 1;
}

// =====================
// MULTER
// =====================
const upload = multer({ storage: multer.memoryStorage() });

// =====================
// ROUTES
// =====================

// Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// GET clubs
app.get("/api/clubs", (req, res) => {
  const clubs = readJson(CLUBS_PATH);
  res.json(clubs);
});

// CREATE club
app.post("/api/clubs", (req, res) => {
  try {
    const clubs = readJson(CLUBS_PATH);

    // ✅ aceptar múltiples nombres de campos para compatibilidad
    const name =
      (req.body.name || req.body.nombre || req.body.clubName || req.body.club || "").toString().trim();
    const city =
      (req.body.city || req.body.ciudad || req.body.cityName || "").toString().trim();
    const logoUrl =
      (req.body.logoUrl || req.body.logo || req.body.logoURL || "").toString().trim();

    if (!name) {
      return res.status(400).json({ error: "Falta nombre" });
    }

    const newClub = {
      id: getNextId(clubs),
      name,
      city,
      logoUrl,
    };

    clubs.push(newClub);
    writeJson(CLUBS_PATH, clubs);

    return res.status(201).json(newClub);
  } catch (err) {
    console.error("❌ Error creando club:", err);
    return res.status(500).json({ error: "Error creando club" });
  }
});

// UPLOAD club logo (Firebase Storage)
app.post("/api/upload-club-logo", upload.single("logo"), async (req, res) => {
  try {
    if (!bucket) {
      return res.status(500).json({ error: "Firebase Admin no inicializado" });
    }

    const clubs = readJson(CLUBS_PATH);

    // ✅ aceptar "id" o "clubId"
    let id = (req.body.id || req.body.clubId || "").toString().trim();

    // ✅ FIX DEFINITIVO: si NO llega id, usamos el último club creado (id más alto)
    if (!id) {
      const maxId = clubs.reduce((m, it) => Math.max(m, Number(it.id) || 0), 0);
      if (maxId > 0) id = String(maxId);
    }

    if (!id) {
      return res.status(400).json({ error: "Falta id" });
    }

    const clubIndex = clubs.findIndex((c) => String(c.id) === String(id));
    if (clubIndex === -1) {
      return res.status(404).json({ error: "Club no encontrado para id " + id });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Falta archivo logo" });
    }

    const ext = path.extname(req.file.originalname || "").toLowerCase() || ".png";
    const filenameSafe = `logo-club-${id}${ext}`;
    const filePath = `club-logos/${Date.now()}_${filenameSafe}`;

    const file = bucket.file(filePath);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype || "image/png",
      },
      resumable: false,
    });

    // Hacer público con URL firmada (mejor que público abierto)
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2035",
    });

    clubs[clubIndex].logoUrl = signedUrl;
    writeJson(CLUBS_PATH, clubs);

    return res.json({ ok: true, id: clubs[clubIndex].id, url: signedUrl });
  } catch (err) {
    console.error("❌ Error subiendo logo:", err);
    return res.status(500).json({ error: "Error subiendo logo" });
  }
});

// =====================
// START
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Backend escuchando en puerto", PORT);
});
