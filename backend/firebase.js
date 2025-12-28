const admin = require("firebase-admin");

function initFirebase() {
  if (admin.apps.length) return admin.app();

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT no definida");
  }

  let serviceAccount;

  try {
    // 🔒 Decode base64 → JSON
    const json = Buffer.from(raw, "base64").toString("utf8");
    serviceAccount = JSON.parse(json);
  } catch (err) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT inválida (base64 → JSON falló)");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return admin.app();
}

module.exports = {
  admin,
  initFirebase,
};
