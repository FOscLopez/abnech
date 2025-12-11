// backend/server.js
// Backend ABNECH – fixture + clubes + subida de logos a Firebase Storage

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const admin = require("./firebase"); // inicialización de firebase-admin

const app = express();
const PORT = process.env.PORT || 3000;

// ==== CORS ====
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "https://abnech-basket.web.app",
    ],
  })
);

app.use(express.json());

// ==== RUTAS DATA ====
const DATA_DIR = path.join(__dirname, "data");
const FIXTURE_FILE = path.join(DATA_DIR, "fixture.json");
const CLUBS_FILE = path.join(DATA_DIR, "clubs.json");

// Helpers para leer / escribir JSON
async function readJson(filePath, defaultValue) {
  try {
    const txt = await fs.readFile(filePath, "utf8");
    return JSON.parse(txt);
  } catch (err) {
    if (err.code === "ENOENT") return defaultValue;
    throw err;
  }
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

// =======================
//   API FIXTURE (FRONT)
// =======================
app.get("/api/fixture", async (req, res) => {
  try {
    const fixture = await readJson(FIXTURE_FILE, []);
    res.json(fixture);
  } catch (err) {
    console.error("Error leyendo fixture:", err);
    res.status(500).json({ error: "Error leyendo fixture" });
  }
});

// =======================
//   API CLUBES (FRONT+ADMIN)
// =======================

// Obtener lista de clubes
app.get("/api/clubs", async (req, res) => {
  try {
    const clubs = await readJson(CLUBS_FILE, []);
    res.json(clubs);
  } catch (err) {
    console.error("Error leyendo clubes:", err);
    res.status(500).json({ error: "Error leyendo clubes" });
  }
});

// Crear club (ADMIN)
app.post("/api/clubs", async (req, res) => {
  try {
    // Admitimos tanto "name"/"city" como "nombre"/"ciudad" para no romper el frontend viejo
    const name = req.body.name || req.body.nombre;
    const city = req.body.city || req.body.ciudad || "";

    if (!name) {
      return res.status(400).json({ error: "Falta nombre de club" });
    }

    const clubs = await readJson(CLUBS_FILE, []);

    // ID incremental
    const newId =
      clubs.length > 0
        ? Math.max(
            ...clubs.map((c) => {
              const n = Number(c.id);
              return Number.isNaN(n) ? 0 : n;
            })
          ) + 1
        : 1;

    const logoUrl = req.body.logoUrl || req.body.logo || "";

    const newClub = {
      id: String(newId),

      // nombres en inglés
      name,
      city,
      logoUrl,

      // nombres “viejos” en español, para que el frontend que usa "nombre" y "logo" siga funcionando
      nombre: name,
      ciudad: city,
      logo: logoUrl,
    };

    clubs.push(newClub);
    await writeJson(CLUBS_FILE, clubs);

    console.log("Club creado:", newClub);

    res.status(201).json(newClub);
  } catch (err) {
    console.error("Error creando club:", err);
    res.status(500).json({ error: "Error creando club" });
  }
});

// Eliminar club (ADMIN)
app.delete("/api/clubs/:id", async (req, res) => {
  try {
    const id = String(req.params.id);
    let clubs = await readJson(CLUBS_FILE, []);
    const originalLen = clubs.length;
    clubs = clubs.filter((c) => String(c.id) !== id);

    if (clubs.length === originalLen) {
      return res.status(404).json({ error: "Club no encontrado" });
    }

    await writeJson(CLUBS_FILE, clubs);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando club:", err);
    res.status(500).json({ error: "Error eliminando club" });
  }
});

// =======================
//   SUBIR LOGO DE CLUB
// =======================

// Multer en memoria -> subimos directo a Firebase Storage
const upload = multer({ storage: multer.memoryStorage() });

app.post(
  "/api/upload-club-logo",
  upload.single("logo"),
  async (req, res) => {
    try {
      // Aceptamos tanto "clubId" como "id" por compatibilidad
      const clubId = req.body.clubId || req.body.id;

      if (!clubId) {
        console.warn(
          "upload-club-logo llamado sin id. req.body=",
          req.body
        );
        return res.status(400).json({ error: "Falta id" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Falta archivo de logo" });
      }

      const bucket = admin.storage().bucket();

      const ext =
        path.extname(req.file.originalname || "").toLowerCase() || ".png";
      const destination = `club-logos/club-${clubId}${ext}`;

      const file = bucket.file(destination);

      await file.save(req.file.buffer, {
        contentType: req.file.mimetype || "image/png",
        public: true,
        resumable: false,
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(
        destination
      )}`;

      // Actualizar JSON de clubes con el logo
      const clubs = await readJson(CLUBS_FILE, []);
      const idx = clubs.findIndex((c) => String(c.id) === String(clubId));

      if (idx === -1) {
        console.warn("Club no encontrado para logo. id=", clubId);
        return res.status(404).json({ error: "Club no encontrado" });
      }

      clubs[idx].logoUrl = publicUrl;
      clubs[idx].logo = publicUrl; // campo “viejo” usado por el frontend
      await writeJson(CLUBS_FILE, clubs);

      console.log("Logo actualizado para club", clubId, "=>", publicUrl);

      res.json({ ok: true, url: publicUrl });
    } catch (err) {
      console.error("Error subiendo logo de club:", err);
      res.status(500).json({ error: "Error subiendo logo de club" });
    }
  }
);

// =======================
//   ARRANQUE SERVIDOR
// =======================

app.get("/", (req, res) => {
  res.send("API ABNECH Basket funcionando");
});

app.listen(PORT, () => {
  console.log(`Backend ABNECH escuchando en puerto ${PORT}`);
});
