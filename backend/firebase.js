const admin = require("firebase-admin");

if (!process.env.FIREBASE_BASE64) {
  throw new Error("FIREBASE_BASE64 no definida");
}

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_BASE64, "base64").toString("utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db };
