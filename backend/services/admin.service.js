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
  const fixtureRef = db.collection("fixtures").doc(fixtureId);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(fixtureRef);
    if (!snap.exists) throw new Error("Fixture no existe");

    const fixture = snap.data();

    // 1️⃣ Actualizar fixture SIEMPRE
    tx.update(fixtureRef, data);

    // 2️⃣ Si ya estaba finalizado → NO tocar standings
    if (fixture.status === "finished") return;

    // 3️⃣ Solo calcular cuando PASA a finalizado
    if (data.status !== "finished") return;

    const homeRef = db.collection("standings").doc(fixture.homeClubId);
    const awayRef = db.collection("standings").doc(fixture.awayClubId);

    const homeSnap = await tx.get(homeRef);
    const awaySnap = await tx.get(awayRef);

    if (!homeSnap.exists || !awaySnap.exists) {
      throw new Error("Club no encontrado en standings");
    }

    const home = homeSnap.data();
    const away = awaySnap.data();

    const local = Number(data.scoreLocal);
    const awayScore = Number(data.scoreAway);

    const homeWin = local > awayScore;
    const awayWin = awayScore > local;

    tx.update(homeRef, {
      PJ: home.PJ + 1,
      PG: home.PG + (homeWin ? 1 : 0),
      PP: home.PP + (homeWin ? 0 : 1),
      PF: home.PF + local,
      PC: home.PC + awayScore,
      DG: home.DG + (local - awayScore),
      PTS: home.PTS + (homeWin ? 2 : 1),
    });

    tx.update(awayRef, {
      PJ: away.PJ + 1,
      PG: away.PG + (awayWin ? 1 : 0),
      PP: away.PP + (awayWin ? 0 : 1),
      PF: away.PF + awayScore,
      PC: away.PC + local,
      DG: away.DG + (awayScore - local),
      PTS: away.PTS + (awayWin ? 2 : 1),
    });
  });
}

module.exports = {
  getFixturesByCategory,
  updateFixture
};
