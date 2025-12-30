const { admin, initFirebase } = require("../firebase");

initFirebase();
const db = admin.firestore();

/* =====================
   STANDINGS (YA OK)
===================== */
async function getStandingsPre() {
  const snap = await db
    .collection("standings")
    .orderBy("PTS", "desc")
    .get();

  return snap.docs.map(d => d.data());
}

/* =====================
   FIXTURES (NUEVO)
===================== */
async function getFixtures() {
  const snap = await db
    .collection("fixtures")
    .orderBy("date", "asc")
    .get();

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

module.exports = {
  getStandingsPre,
  getFixtures
};
