const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
    storageBucket: "abnech-basket.appspot.com", // ✅ ESTE ES EL BUCKET REAL
  });
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };