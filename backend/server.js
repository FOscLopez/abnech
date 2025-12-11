const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { bucket } = require("./firebase");

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------- CORS -------------------
app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:3000",
      "https://abnech-basket.web.app",
    ],
    methods: "GET,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type",
  })
);

// Para JSON normales (no file upload)
app.use(express.json());

// ------------------- Helpers JSON -------------------
const dataDir = path.join(__dirname, "data");

function readJson(fileName) {
  const fullPath = path.join(dataDir, fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(raw);
}

function writeJson(fileName, data) {
  const fullPath = path.join(dataDir, fileName);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf8");
}

// ------------------- Rutas básicas -------------------
app.get("/", (req, res) => {
  res.send("API ABNECH Basket funcionando");
});

// Fixture
app.get("/api/fixture", (req, res) => {
  try {
    const data = readJson("fixture.json");
    res.json(data);
  } catch (err) {
    console.error("Error leyendo fixture:", err);
    res.status(500).json({ error: "Error leyendo fixture" });
  }
});

// Resultados
app.get("/api/results", (req, res) => {
  try {
    const data = readJson("results.json");
    res.json(data);
  } catch (err) {
    console.error("Error leyendo resultados:", err);
    res.status(500).json({ error: "Error leyendo resultados" });
  }
});

// ------------------- CLUBES -------------------

// GET clubs
app.get("/api/clubs", (req, res) => {
  try {
    const clubs = readJson("clubs.json");
    res.json(clubs);
  } catch (err) {
    console.error("Error leyendo clubs:", err);
    res.status(500).json({ error: "Error leyendo clubs" });
  }
});

// POST club
app.post("/api/clubs", (req, res) => {
  try {
    const { name, city, logoUrl } = req.body;

    if (!name || !city) {
      return res.status(400).json({ error: "Faltan nombre o ciudad" });
    }

    const clubs = readJson("clubs.json");
    const newId =
      clubs.length > 0
        ? Math.max(...clubs.map((c) => Number(c.id) || 0)) + 1
        : 1;

    const newClub = {
      id: newId,
      name: name,
      city: city,
      // Logo: puede venir URL o se llenará luego al subir archivo
      logo: logoUrl || "",
      clubName: name,
      ciudad: city,
    };

    clubs.push(newClub);
    writeJson("clubs.json", clubs);

    res.json(newClub);
  } catch (err) {
    console.error("Error creando club:", err);
    res.status(500).json({ error: "Error creando club" });
  }
});

// DELETE club
app.delete("/api/clubs/:id", (req, res) => {
  try {
    const id = String(req.params.id);
    let clubs = readJson("clubs.json");

    const before = clubs.length;
    clubs = clubs.filter((c) => String(c.id) !== id);

    if (clubs.length === before) {
      return res.status(404).json({ error: "Club no encontrado" });
    }

    writeJson("clubs.json", clubs);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando club:", err);
    res.status(500).json({ error: "Error eliminando club" });
  }
});

// ------------------- JUGADORES -------------------

// GET players
app.get("/api/players", (req, res) => {
  try {
    const players = readJson("players.json");
    res.json(players);
  } catch (err) {
    console.error("Error leyendo players:", err);
    res.status(500).json({ error: "Error leyendo players" });
  }
});

// POST player
app.post("/api/players", (req, res) => {
  try {
    const { name, number, clubId } = req.body;

    if (!name || !number || !clubId) {
      return res
        .status(400)
        .json({ error: "Faltan nombre, número o clubId del jugador" });
    }

    const players = readJson("players.json");
    const newId =
      players.length > 0
        ? Math.max(...players.map((p) => Number(p.id) || 0)) + 1
        : 1;

    const newPlayer = {
      id: newId,
      name,
      number,
      clubId,
    };

    players.push(newPlayer);
    writeJson("players.json", players);

    res.json(newPlayer);
  } catch (err) {
    console.error("Error creando jugador:", err);
    res.status(500).json({ error: "Error creando jugador" });
  }
});

// DELETE player
app.delete("/api/players/:id", (req, res) => {
  try {
    const id = String(req.params.id);
    let players = readJson("players.json");

    const before = players.length;
    players = players.filter((p) => String(p.id) !== id);

    if (players.length === before) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }

    writeJson("players.json", players);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando jugador:", err);
    res.status(500).json({ error: "Error eliminando jugador" });
  }
});

// ------------------- SUBIR LOGO DE CLUB -------------------

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload-club-logo", upload.single("logo"), async (req, res) => {
  try {
    const id =
      req.body.id || req.body.clubId || req.body.club_id || req.query.id;

    if (!id) {
      console.error("upload-club-logo: falta id en body", req.body);
      return res.status(400).json({ error: "Falta id" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Falta archivo de logo" });
    }

    // Nombre de archivo en Firebase Storage
    const fileName = `club-logos/${id}_${Date.now()}_${req.file.originalname}`;

    const file = bucket.file(fileName);
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error("Error subiendo a Storage:", err);
      res.status(500).json({ error: "Error subiendo a Storage" });
    });

    stream.on("finish", async () => {
      try {
        // URL pública firmada (larga duración)
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: "2100-01-01",
        });

        // Actualizar clubs.json con la URL del logo
        const clubs = readJson("clubs.json");
        const idx = clubs.findIndex((c) => String(c.id) === String(id));

        if (idx === -1) {
          return res.status(404).json({ error: "Club no encontrado" });
        }

        clubs[idx].logo = url;
        writeJson("clubs.json", clubs);

        res.json({ ok: true, url });
      } catch (err) {
        console.error("Error finalizando upload:", err);
        res.status(500).json({ error: "Error generando URL de logo" });
      }
    });

    // Subimos el buffer del archivo
    stream.end(req.file.buffer);
  } catch (err) {
    console.error("Error en /api/upload-club-logo:", err);
    res.status(500).json({ error: "Error interno subiendo logo" });
  }
});

// ------------------- START SERVER -------------------

app.listen(PORT, () => {
  console.log(`Backend ABNECH escuchando en puerto ${PORT}`);
});
