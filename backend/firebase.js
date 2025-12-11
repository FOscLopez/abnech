const admin = require("firebase-admin");
const path = require("path");
const serviceAccount = require("./serviceAccountKey.json");

// IMPORTANTE: projectId debe coincidir con el de Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "abnech-basket.appspot.com", // bucket por defecto del proyecto
});

const bucket = admin.storage().bucket();

module.exports = {
  admin,
  bucket,
};
