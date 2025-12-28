const { admin, initFirebase } = require("../firebase");

initFirebase();

const db = admin.firestore();

async function getFixtures() {
  const snap = await db.collection("fixtures").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getClubs() {
  const snap = await db.collection("clubs").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

module.exports = {
  getFixtures,
  getClubs,
};
