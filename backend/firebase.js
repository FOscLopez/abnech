const admin = require("firebase-admin");

let initialized = false;

function initFirebase() {
  if (initialized) {
    return admin;
  }

  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!base64) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT no está definido en Render");
  }

  let serviceAccount;
  try {
    const json = Buffer.from(base64, "base64").toString("utf8");
    serviceAccount = JSON.parse(json);
  } catch (err) {
    throw new Error("Error decodificando FIREBASE_SERVICE_ACCOUNT");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  initialized = true;
  return admin;
}

module.exports = initFirebase();
