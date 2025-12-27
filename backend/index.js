const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const adminOnly = require("./middleware/adminOnly");
<<<<<<< HEAD
=======
const { buildStandings } = require("./services/standings.service");
>>>>>>> bf458b99c9343b0f1b6f7cd70346f03ea2048e27

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// PUBLICO
app.get("/api/clubs", async (req, res) => {
  const snap = await db.collection("clubs").get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

app.get("/api/fixtures", async (req, res) => {
  const snap = await db.collection("fixtures").get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

<<<<<<< HEAD
// 🔐 ADMIN
app.post("/api/clubs", adminOnly, async (req, res) => {
  const doc = await db.collection("clubs").add(req.body);
  res.json({ id: doc.id });
});

app.delete("/api/clubs/:id", adminOnly, async (req, res) => {
  await db.collection("clubs").doc(req.params.id).delete();
  res.json({ ok: true });
=======
app.get("/api/standings", async (req, res) => {
  const clubsSnap = await db.collection("clubs").get();
  const fixturesSnap = await db.collection("fixtures").get();

  const clubs = clubsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const fixtures = fixturesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const standings = buildStandings(clubs, fixtures);
  res.json(standings);
});

// ADMIN
app.post("/api/fixtures", adminOnly, async (req, res) => {
  const doc = await db.collection("fixtures").add(req.body);
  res.json({ id: doc.id });
>>>>>>> bf458b99c9343b0f1b6f7cd70346f03ea2048e27
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend OK"));
