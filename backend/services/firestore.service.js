const { admin, initFirebase } = require("../firebase");

initFirebase();

const db = admin.firestore();

async function getStandingsPre() {
  const snapshot = await db
    .collection("standings")
    .orderBy("PTS", "desc")
    .get();

  return snapshot.docs.map(doc => doc.data());
}

module.exports = {
  getStandingsPre,
};
