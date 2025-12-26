const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// RUTA RAÍZ (TEST)
// ===============================
app.get("/", (req, res) => {
  res.send("ABNECH BACKEND NUEVO - DEPLOY TEST OK");
});

// ===============================
// CLUBS
// ===============================
app.get("/api/clubs", (req, res) => {
  res.json([
    { id: "1", name: "Funebrero" },
    { id: "2", name: "Unión" },
    { id: "3", name: "CAP" }
  ]);
});

// ===============================
// FIXTURES  👈 ESTA ES LA CLAVE
// ===============================
app.get("/api/fixtures", (req, res) => {
  res.json([
    {
      id: "m1",
      homeClubId: "1",
      awayClubId: "2",
      homeScore: 80,
      awayScore: 72
    },
    {
      id: "m2",
      homeClubId: "3",
      awayClubId: "1",
      homeScore: 65,
      awayScore: 70
    }
  ]);
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`ABNECH backend running on port ${PORT}`);
});
