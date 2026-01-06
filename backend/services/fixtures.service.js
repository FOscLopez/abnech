const admin = require("../firebase");
const db = admin.firestore();

async function getFixturesByCategory(categoryId) {
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
  getFixturesByCategory,
};
