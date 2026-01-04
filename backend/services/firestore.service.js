const { admin, initFirebase } = require("../firebase");

initFirebase();
const db = admin.firestore();

async function getStandingsPre() {
  const snap = await db
    .collection("standings")
    .orderBy("PTS", "desc")
    .orderBy("DG", "desc")
    .orderBy("PF", "desc")
    .get();

  return snap.docs.map(d => d.data());
}

module.exports = { getStandingsPre };
