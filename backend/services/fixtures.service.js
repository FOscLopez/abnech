const db = require("../firebase");

async function getFixturesByCategory(categoryId) {

  const snapshot = await db
    .collection("fixtures")
    .where("categoryId", "==", categoryId)
    .where("deleted", "==", false) // 👈 IMPORTANTE
    .orderBy("date", "asc")
    .orderBy("time", "asc")
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

module.exports = {
  getFixturesByCategory,
};
