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

    // 1️⃣ Actualizamos el fixture
    tx.update(fixtureRef, data);

    // 2️⃣ Solo si pasa a FINALIZADO y antes NO lo estaba
    if (
      data.status !== "finished" ||
      fixture.status === "finished"
    ) {
      return;
    }

    const {
      homeClubId,
      awayClubId,
      scoreLocal,
      scoreAway
    } = {
      ...fixture,
      ...data
    };

    const homeRef = db.collection("standings").doc(homeClubId);
    const awayRef = db.collection("standings").doc(awayClubId);

    const homeSnap = await tx.get(homeRef);
    const awaySnap = await tx.get(awayRef);

    if (!homeSnap.exists || !awaySnap.exists) {
      throw new Error("Club no encontrado en standings");
    }

    const home = homeSnap.data();
    const away = awaySnap.data();

    const homeWin = scoreLocal > scoreAway;
    const awayWin = scoreAway > scoreLocal;

    tx.update(homeRef, {
      PJ: home.PJ + 1,
      PG: home.PG + (homeWin ? 1 : 0),
      PP: home.PP + (homeWin ? 0 : 1),
      PF: home.PF + scoreLocal,
      PC: home.PC + scoreAway,
      DG: (home.PF + scoreLocal) - (home.PC + scoreAway),
      PTS: home.PTS + (homeWin ? 2 : 1)
    });

    tx.update(awayRef, {
      PJ: away.PJ + 1,
      PG: away.PG + (awayWin ? 1 : 0),
      PP: away.PP + (awayWin ? 0 : 1),
      PF: away.PF + scoreAway,
      PC: away.PC + scoreLocal,
      DG: (away.PF + scoreAway) - (away.PC + scoreLocal),
      PTS: away.PTS + (awayWin ? 2 : 1)
    });
  });
}


module.exports = {
  getFixturesByCategory,
  updateFixture
};
