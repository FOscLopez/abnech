// setRole.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setRoles() {
  // 👑 ADMIN
  await admin.auth().setCustomUserClaims(
    "IDjMY04fHSUG9dFuK2rcErv6OSb2",
    { role: "admin" }
  );

  // ✏️ EDITOR
  await admin.auth().setCustomUserClaims(
    "ax3kmXKHGSNHjoxmfbCsjZBXDUS2",
    { role: "editor" }
  );

  console.log("Roles asignados correctamente");
}

setRoles();
