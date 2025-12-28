const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let initialized = false;

function initFirebase() {
  if (initialized) return admin;

  const firebaseTxtPath = path.join(__dirname, "firebase.txt");

  if (!fs.existsSync(firebaseTxtPath)) {
    throw new Error("firebase.txt no existe");
  }

  // leer base64
  const base64 = fs.readFileSync(firebaseTxtPath, "utf8").trim();

  // decodificar
  const jsonString = Buffer.from(base64, "base64").toString("utf8");

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(jsonString);
  } catch (err) {
    throw new Error("firebase.txt no contiene JSON válido");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  initialized = true;
  console.log("🔥 Firebase Admin inicializado correctamente");

  return admin;
}

module.exports = {
  admin,
  initFirebase,
};
