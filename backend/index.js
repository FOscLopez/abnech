require("./firebase"); // ← esto inicializa Firebase una sola vez

const express = require("express");
const cors = require("cors");
const admin = require("./firebase");
const adminOnly = require("./middleware/adminOnly");
const { buildStandings } = require("./services/standings.service");

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// PUBLIC ROUTES
// =======================
app.get("/api/clubs", async (req, res) => {
  const snap = await db.collection("clubs").get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

app.get("/api/fixtures", async (req, res) => {
  const snap = await db.collection("fixtures").get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

app.get("/api/standings", async (req, res) => {
  const clubsSnap = await db.collection("clubs").get();
  const fixturesSnap = await db.collection("fixtures").get();

  const clubs = clubsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const fixtures = fixturesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const standings = buildStandings(clubs, fixtures);
  res.json(standings);
});

// =======================
// ADMIN
// =======================
app.post("/api/fixtures", adminOnly, async (req, res) => {
  const doc = await db.collection("fixtures").add(req.body);
  res.json({ id: doc.id });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
