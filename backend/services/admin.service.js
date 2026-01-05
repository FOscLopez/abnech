const { admin, initFirebase } = require("../firebase");

initFirebase();
const db = admin.firestore();

async function getFixturesByCategory(categoryId) {
  const snap = await db
    .collection("fixtures")
    .where("categoryId", "==", categoryId)
    .orderBy("order", "asc")
    .get();

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

async function updateFixture(fixtureId, data) {
  await db.collection("fixtures").doc(fixtureId).update(data);
}

module.exports = {
  getFixturesByCategory,
  updateFixture
};
