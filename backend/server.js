// backend/server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { bucket } = require("./firebase");

const app = express();
const PORT = process.env.PORT || 10000;

// ===== CORS =====
const ALLOWED_ORIGINS = [
  "https://abnech-basket.web.app",
  "https://abnech-basket.firebaseapp.com",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
];

app.use(
  cors({
    origin: function (origin, cb) {
      // Permitir herramientas y llamadas sin origin (curl/postman)
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error("CORS: Origin no permitido: " + origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ===== Helpers JSON =====
const DATA_DIR = path.join(__dirname, "data");

function readJsonSafe(fileName, fallback) {
  try {
    const p = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(p)) return fallback;
    const raw = fs.readFileSync(p, "utf-8");
    if (!raw.trim()) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`[BACKEND] Error leyendo ${fileName}:`, e);
    return fallback;
  }
}

function writeJsonSafe(fileName, data) {
  const p = path.join(DATA_DIR, fileName);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf-8");
}

function normalizeCategoria(s) {
  return String(s || "").trim().toLowerCase();
}

// ===== Multer (upload en memoria) =====
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ===== Health =====
app.get("/", (_req, res) => res.send("ABNECH backend OK"));

// =========================
// CLUBES
// =========================
app.get("/api/clubs", (_req, res) => {
  const clubs = readJsonSafe("clubs.json", []);
  return res.json(clubs);
});

app.post("/api/clubs", (req, res) => {
  try {
    const clubs = readJsonSafe("clubs.json", []);

    const name =
      (req.body.name || req.body.nombre || req.body.clubName || "").trim();
    const city = (req.body.city || req.body.ciudad || "").trim();
    const logoUrl = (req.body.logoUrl || req.body.logo || "").trim();

    if (!name) return res.status(400).json({ error: "Falta nombre" });
    if (!city) return res.status(400).json({ error: "Falta ciudad" });

    const nextId =
      clubs.length > 0
        ? Math.max(...clubs.map((c) => Number(c.id) || 0)) + 1
        : 1;

    const club = {
      id: nextId,
      name,
      city,
      logoUrl: logoUrl || "",
    };

    clubs.push(club);
    writeJsonSafe("clubs.json", clubs);

    return res.status(201).json(club);
  } catch (e) {
    console.error("[BACKEND] Error creando club:", e);
    return res.status(500).json({ error: "Error creando club" });
  }
});

app.delete("/api/clubs/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const clubs = readJsonSafe("clubs.json", []);
    const before = clubs.length;
    const afterList = clubs.filter((c) => Number(c.id) !== id);

    if (afterList.length === before) {
      return res.status(404).json({ error: "Club no encontrado" });
    }

    writeJsonSafe("clubs.json", afterList);
    return res.json({ ok: true });
  } catch (e) {
    console.error("[BACKEND] Error eliminando club:", e);
    return res.status(500).json({ error: "Error eliminando club" });
  }
});

// =========================
// PLAYERS
// =========================
app.get("/api/players", (_req, res) => {
  const players = readJsonSafe("players.json", []);
  return res.json(players);
});

// =========================
// FIXTURE / RESULTADOS / TABLAS
// (para que NO dé 404 en tu main.js)
// =========================
app.get("/api/fixture", (req, res) => {
  const categoria = normalizeCategoria(req.query.categoria);
  const data = readJsonSafe("fixture.json", []);

  // Si el JSON es { "primera": [...], "u19": [...] }
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const key = categoria || "primera";
    const found =
      data[key] || data[key.toUpperCase()] || data[key.toLowerCase()];
    return res.json(found || []);
  }

  // Si el JSON es array con campo "categoria"
  if (Array.isArray(data) && categoria) {
    return res.json(
      data.filter((x) => normalizeCategoria(x.categoria) === categoria)
    );
  }

  return res.json(data);
});

app.get("/api/results", (req, res) => {
  const categoria = normalizeCategoria(req.query.categoria);
  const data = readJsonSafe("results.json", []);

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const key = categoria || "primera";
    const found =
      data[key] || data[key.toUpperCase()] || data[key.toLowerCase()];
    return res.json(found || []);
  }

  if (Array.isArray(data) && categoria) {
    return res.json(
      data.filter((x) => normalizeCategoria(x.categoria) === categoria)
    );
  }

  return res.json(data);
});

app.get("/api/standings", (req, res) => {
  const categoria = normalizeCategoria(req.query.categoria);
  const data = readJsonSafe("standings.json", []);

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const key = categoria || "primera";
    const found =
      data[key] || data[key.toUpperCase()] || data[key.toLowerCase()];
    return res.json(found || []);
  }

  if (Array.isArray(data) && categoria) {
    return res.json(
      data.filter((x) => normalizeCategoria(x.categoria) === categoria)
    );
  }

  return res.json(data);
});

// =========================
// UPLOAD LOGO CLUB (Firebase Storage)
// =========================
app.post("/api/upload-club-logo", upload.single("logo"), async (req, res) => {
  try {
    const clubIdRaw = (req.body.clubId || req.body.id || "").trim();
    const clubId = Number(clubIdRaw);

    if (!clubIdRaw || Number.isNaN(clubId)) {
      return res.status(400).json({ error: "Falta id" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Falta archivo logo" });
    }

    const ext = path.extname(req.file.originalname || "").toLowerCase() || ".png";
    const safeName = `logo-${clubId}-${Date.now()}${ext}`;
    const storagePath = `club-logos/${safeName}`;

    const file = bucket.file(storagePath);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype || "image/png",
        cacheControl: "public, max-age=31536000",
      },
      resumable: false,
    });

    // URL firmada (evita problemas si el bucket no está público)
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 365, // 1 año
    });

    // Actualizar clubs.json con logoUrl
    const clubs = readJsonSafe("clubs.json", []);
    const idx = clubs.findIndex((c) => Number(c.id) === clubId);
    if (idx === -1) {
      return res.status(404).json({ error: "Club no encontrado" });
    }

    clubs[idx].logoUrl = signedUrl;
    writeJsonSafe("clubs.json", clubs);

    return res.json({ ok: true, url: signedUrl, path: storagePath });
  } catch (e) {
    console.error("[BACKEND] Error subiendo logo:", e);
    return res.status(500).json({ error: "Error subiendo logo" });
  }
});

app.listen(PORT, () => {
  console.log(`[BACKEND] Running on port ${PORT}`);
});
