const db = require("../firebase");

// ===== STANDINGS =====
async function getStandingsByCategory(categoryId) {
  const snapshot = await db
    .collection("standings")
    .where("categoryId", "==", categoryId)
    .orderBy("PTS", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// ===== FIXTURES =====
async function getFixturesById(categoryId) {
  const snapshot = await db
    .collection("fixtures")
    .where("categoryId", "==", categoryId)
    .orderBy("order")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

module.exports = {
  getStandingsByCategory,
  getFixturesById,
};
