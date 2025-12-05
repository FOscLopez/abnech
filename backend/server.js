const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();

// Render (u otro hosting) pone el puerto en process.env.PORT
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Directorios
const DATA_DIR = path.join(__dirname, "data");
const FIXTURE_FILE = path.join(DATA_DIR, "fixture.json");
const PLAYERS_FILE = path.join(DATA_DIR, "players.json");
const CLUBS_FILE = path.join(DATA_DIR, "clubs.json");

// Uploads
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}
const upload = multer({ dest: UPLOADS_DIR });
app.use("/uploads", express.static(UPLOADS_DIR));

// Helpers
function readJson(file) {
  try {
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error leyendo", file, err);
    return [];
  }
}

function writeJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error escribiendo", file, err);
  }
}

/* ================== FIXTURE ================== */

// GET /api/fixture?categoria=Primera
app.get("/api/fixture", (req, res) => {
  const categoria = req.query.categoria;
  const data = readJson(FIXTURE_FILE);

  if (categoria) {
    return res.json(data.filter(p => p.categoria === categoria));
  }
  res.json(data);
});

// GET /api/fixture/:id
app.get("/api/fixture/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = readJson(FIXTURE_FILE);
  const partido = data.find(p => p.id === id);
  if (!partido) return res.status(404).json({ error: "Partido no encontrado" });
  res.json(partido);
});

// POST /api/fixture
app.post("/api/fixture", (req, res) => {
  const data = readJson(FIXTURE_FILE);
  const nuevo = req.body;
  const maxId = data.reduce((max, p) => Math.max(max, p.id || 0), 0);
  nuevo.id = maxId + 1;
  data.push(nuevo);
  writeJson(FIXTURE_FILE, data);
  res.status(201).json(nuevo);
});

// PUT /api/fixture/:id
app.put("/api/fixture/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = readJson(FIXTURE_FILE);
  const index = data.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Partido no encontrado" });

  data[index] = { ...data[index], ...req.body, id };
  writeJson(FIXTURE_FILE, data);
  res.json(data[index]);
});

// DELETE /api/fixture/:id
app.delete("/api/fixture/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = readJson(FIXTURE_FILE);
  const nuevo = data.filter(p => p.id !== id);
  if (nuevo.length === data.length) {
    return res.status(404).json({ error: "Partido no encontrado" });
  }
  writeJson(FIXTURE_FILE, nuevo);
  res.json({ ok: true });
});

/* ================== PLANILLAS ================== */

// POST /api/upload?id=1  (field: planilla)
app.post("/api/upload", upload.single("planilla"), (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (!id) return res.status(400).json({ error: "Falta id" });

  const data = readJson(FIXTURE_FILE);
  const partido = data.find(p => p.id === id);
  if (!partido) return res.status(404).json({ error: "Partido no encontrado" });

  partido.planillaUrl = `/uploads/${req.file.filename}`;
  writeJson(FIXTURE_FILE, data);

  res.json({ ok: true, file: partido.planillaUrl });
});

/* ================== PLAYERS ================== */

app.get("/api/players", (req, res) => {
  const data = readJson(PLAYERS_FILE);
  res.json(data);
});

app.post("/api/players", (req, res) => {
  const data = readJson(PLAYERS_FILE);
  const nuevo = req.body;
  const maxId = data.reduce((max, p) => Math.max(max, p.id || 0), 0);
  nuevo.id = maxId + 1;
  data.push(nuevo);
  writeJson(PLAYERS_FILE, data);
  res.status(201).json(nuevo);
});

app.put("/api/players/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = readJson(PLAYERS_FILE);
  const index = data.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Jugador no encontrado" });

  data[index] = { ...data[index], ...req.body, id };
  writeJson(PLAYERS_FILE, data);
  res.json(data[index]);
});

app.delete("/api/players/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = readJson(PLAYERS_FILE);
  const nuevo = data.filter(p => p.id !== id);
  if (nuevo.length === data.length) {
    return res.status(404).json({ error: "Jugador no encontrado" });
  }
  writeJson(PLAYERS_FILE, nuevo);
  res.json({ ok: true });
});

/* ================== CLUBES ================== */

app.get("/api/clubs", (req, res) => {
  const data = readJson(CLUBS_FILE);
  res.json(data);
});

app.post("/api/clubs", (req, res) => {
  const data = readJson(CLUBS_FILE);
  const nuevo = req.body;
  const maxId = data.reduce((max, c) => Math.max(max, c.id || 0), 0);
  nuevo.id = maxId + 1;
  data.push(nuevo);
  writeJson(CLUBS_FILE, data);
  res.status(201).json(nuevo);
});

app.put("/api/clubs/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = readJson(CLUBS_FILE);
  const index = data.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: "Club no encontrado" });

  data[index] = { ...data[index], ...req.body, id };
  writeJson(CLUBS_FILE, data);
  res.json(data[index]);
});

app.delete("/api/clubs/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = readJson(CLUBS_FILE);
  const nuevo = data.filter(c => c.id !== id);
  if (nuevo.length === data.length) {
    return res.status(404).json({ error: "Club no encontrado" });
  }
  writeJson(CLUBS_FILE, nuevo);
  res.json({ ok: true });
});

// POST /api/upload-club-logo?id=1 (field: logo)
app.post("/api/upload-club-logo", upload.single("logo"), (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (!id) return res.status(400).json({ error: "Falta id" });

  const data = readJson(CLUBS_FILE);
  const club = data.find(c => c.id === id);
  if (!club) return res.status(404).json({ error: "Club no encontrado" });

  club.logo = `/uploads/${req.file.filename}`;
  writeJson(CLUBS_FILE, data);
  res.json({ ok: true, logo: club.logo });
});

/* ================== INICIO SERVIDOR ================== */

app.get("/", (req, res) => {
  res.send("API ABNECH Basket funcionando");
});

app.listen(PORT, () => {
  console.log(`✅ Backend ABNECH escuchando en puerto ${PORT}`);
});
