// backend/server.js

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { bucket } = require("./firebase");

const app = express();
const PORT = process.env.PORT || 3000;

// === MIDDLEWARES ===
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5500",          // para pruebas locales
      "http://127.0.0.1:5500",
      "https://abnech-basket.web.app",  // tu hosting Firebase
    ],
  })
);

// Carpeta data
const DATA_DIR = path.join(__dirname, "data");
const CLUBS_FILE = path.join(DATA_DIR, "clubs.json");

// Aseguramos que el archivo de clubes exista
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(CLUBS_FILE)) {
  fs.writeFileSync(CLUBS_FILE, JSON.stringify([] , null, 2), "utf8");
}

// Funciones helper para leer / escribir JSON
function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error("Error leyendo JSON:", filePath, err);
    return [];
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// ========= EJEMPLOS DE APIS EXISTENTES (podés ampliarlas) =========

// Ejemplo fixture
app.get("/api/fixture", (req, res) => {
  const filePath = path.join(DATA_DIR, "fixture.json");
  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }
  return res.json(readJson(filePath));
});

// APIS de clubes
app.get("/api/clubs", (req, res) => {
  const clubs = readJson(CLUBS_FILE);
  res.json(clubs);
});

app.post("/api/clubs", (req, res) => {
  const { id, name, city, logoUrl } = req.body;
  if (!id || !name) {
    return res.status(400).json({ error: "Faltan campos obligatorios (id, name)" });
  }

  const clubs = readJson(CLUBS_FILE);

  if (clubs.find((c) => c.id === id)) {
    return res.status(400).json({ error: "Ya existe un club con ese ID" });
  }

  clubs.push({
    id,
    name,
    city: city || "",
    logoUrl: logoUrl || "",
  });

  writeJson(CLUBS_FILE, clubs);
  res.json({ ok: true, clubs });
});

app.delete("/api/clubs/:id", (req, res) => {
  const id = req.params.id;
  let clubs = readJson(CLUBS_FILE);
  const before = clubs.length;
  clubs = clubs.filter((c) => c.id !== id);

  if (clubs.length === before) {
    return res.status(404).json({ error: "Club no encontrado" });
  }

  writeJson(CLUBS_FILE, clubs);
  res.json({ ok: true, clubs });
});

// ========= SUBIDA DE LOGOS A FIREBASE STORAGE =========

// Usamos multer en memoria (no guardamos archivos en disco local)
const upload = multer({ storage: multer.memoryStorage() });

// SUBIR LOGO DE CLUB
app.post("/api/upload-club-logo", upload.single("logo"), async (req, res) => {
  try {
    // ✅ ACEPTAR clubId O id, PARA SER FLEXIBLES
    const clubId = req.body.clubId || req.body.id;

    if (!clubId) {
      console.error("[API] Falta id en /api/upload-club-logo. body=", req.body);
      return res.status(400).json({ ok: false, error: "Falta id" });
    }

    if (!req.file) {
      console.error("[API] Falta archivo en /api/upload-club-logo");
      return res.status(400).json({ ok: false, error: "Falta archivo" });
    }

    // Nombre de archivo en Storage
    const ext = path.extname(req.file.originalname) || ".png";
    const fileName = `club-logos/club-${clubId}-${Date.now()}${ext}`;

    const bucket = storage.bucket();
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
      public: true,
    });

    // URL pública (si el bucket está configurado como público)
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Actualizar clubs.json
    const clubsPath = path.join(__dirname, "data", "clubs.json");
    const clubsRaw = await fs.readFile(clubsPath, "utf8");
    const clubs = JSON.parse(clubsRaw || "[]");

    const idx = clubs.findIndex(
      (c) => String(c.id) === String(clubId)
    );

    if (idx === -1) {
      console.error("[API] Club no encontrado para id", clubId);
      return res.status(404).json({ ok: false, error: "Club no encontrado" });
    }

    clubs[idx].logo = publicUrl;

    await fs.writeFile(clubsPath, JSON.stringify(clubs, null, 2), "utf8");

    console.log("[API] Logo subido y club actualizado:", {
      id: clubId,
      url: publicUrl,
    });

    return res.json({ ok: true, url: publicUrl });
  } catch (err) {
    console.error("[API] Error en /api/upload-club-logo:", err);
    return res.status(500).json({ ok: false, error: "Error interno" });
  }
});


// ========= SERVIDOR =========
app.get("/", (req, res) => {
  res.send("API ABNECH Basket funcionando");
});

app.listen(PORT, () => {
  console.log(`Backend ABNECH escuchando en puerto ${PORT}`);
});
