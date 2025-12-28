const { db } = require("../firebase");

// standings pretemporada
async function getStandingsPre() {
  const snapshot = await db.collection("standings_pre").get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

module.exports = {
  getStandingsPre
};
