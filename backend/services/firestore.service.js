const { admin, initFirebase } = require("../firebase");

initFirebase();
const db = admin.firestore();

// standings (ya funcionando)
async function getStandingsPre() {
  const snap = await db
    .collection("standings")
    .orderBy("PTS", "desc")
    .get();

  return snap.docs.map(d => d.data());
}

// fixtures por id
async function getFixturesById(id) {
  const snap = await db
    .collection("fixtures")
    .where("categoryId", "==", id)
    .orderBy("order", "asc")
    .get();

  return snap.docs.map(d => d.data());
}

module.exports = {
  getStandingsPre,
  getFixturesById
};
