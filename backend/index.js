const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const adminOnly = require("./middleware/adminOnly");
const { buildStandings } = require("./services/standings.service");

// =======================
// FIREBASE ADMIN
// =======================
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// =======================
// APP
// =======================
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
  try {
    const clubsSnap = await db.collection("clubs").get();
    const fixturesSnap = await db.collection("fixtures").get();

    const clubs = clubsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const fixtures = fixturesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const standings = buildStandings(clubs, fixtures);
    res.json(standings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error building standings" });
  }
});

// =======================
// ADMIN ROUTES
// =======================
app.post("/api/fixtures", adminOnly, async (req, res) => {
  const doc = await db.collection("fixtures").add(req.body);
  res.json({ id: doc.id });
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
