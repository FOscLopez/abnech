const db = require("../firebase");

async function getFixturesByCategory(categoryId) {

  const snapshot = await db
    .collection("fixtures")
    .where("categoryId", "==", categoryId)

    // Primero por fecha
    .orderBy("date", "asc")

    // Luego por hora
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
