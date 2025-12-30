const { admin, initFirebase } = require("../firebase");

initFirebase();
const db = admin.firestore();

/* =====================
   STANDINGS (OK)
===================== */
async function getStandingsPre() {
  const snap = await db
    .collection("standings")
    .orderBy("PTS", "desc")
    .get();

  return snap.docs.map(d => d.data());
}

/* =====================
   FIXTURES (FIX 500)
===================== */
async function getFixturesById(id) {
  const snap = await db
    .collection("fixtures")
    .where("categoryId", "==", id)
    .get(); // 👈 SIN orderBy

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

module.exports = {
  getStandingsPre,
  getFixturesById
};
