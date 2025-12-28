const admin = require("firebase-admin");

function initFirebase() {
  if (admin.apps.length) return admin.app();

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT no definida");
  }

  let serviceAccount;

  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT no es un JSON válido");
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
