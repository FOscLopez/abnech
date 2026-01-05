const { admin, initFirebase } = require("../firebase");

initFirebase();
const db = admin.firestore();

async function getFixturesByCategory(categoryId) {
  const snap = await db
    .collection("fixtures")
    .where("categoryId", "==", categoryId)
    .orderBy("order", "asc")
    .get();

  return snap.docs.map(d => d.data());
}

module.exports = { getFixturesByCategory };
