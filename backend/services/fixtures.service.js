const db = require("../firebase");

async function getFixturesByCategory(categoryId) {

  const snapshot = await db
    .collection("fixtures")
    .where("categoryId", "==", categoryId)
    // ❌ SACAMOS orderBy("order")
    .orderBy("date", "asc") // ordenamos por fecha mejor
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

module.exports = {
  getFixturesByCategory,
};
