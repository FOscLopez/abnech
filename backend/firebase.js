// backend/firebase.js
const path = require("path");
const admin = require("firebase-admin");

// En Render / Linux, este file existe porque lo commiteaste.
// En local también.
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
const serviceAccount = require(serviceAccountPath);

// IMPORTANTE: el bucket debe ser el de tu proyecto.
// En tu config web se ve: abnech-basket.firebasestorage.app
// En admin SDK normalmente se usa: "<project-id>.appspot.com"
// pero también funciona el nuevo dominio. Si tenés problemas,
// cambiá a "abnech-basket.appspot.com"
const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET || "abnech-basket.firebasestorage.app";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket,
  });
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };
