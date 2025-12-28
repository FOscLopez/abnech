const express = require("express");
const cors = require("cors");

const { initFirebase } = require("./firebase");
const { getFixtures, getClubs } = require("./services/firestore.service");

initFirebase(); // 🔥 SIEMPRE PRIMERO

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/fixtures", async (req, res) => {
  try {
    const data = await getFixtures();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/clubs", async (req, res) => {
  try {
    const data = await getClubs();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/standings", async (req, res) => {
  try {
    res.json({ ok: true, message: "Standings endpoint OK" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Backend corriendo en puerto ${PORT}`)
);
