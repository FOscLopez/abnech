const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const adminOnly = require("./middleware/adminOnly");

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

// 🔐 ADMIN
app.post("/api/clubs", adminOnly, async (req, res) => {
  const doc = await db.collection("clubs").add(req.body);
  res.json({ id: doc.id });
});

app.delete("/api/clubs/:id", adminOnly, async (req, res) => {
  await db.collection("clubs").doc(req.params.id).delete();
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend OK"));
