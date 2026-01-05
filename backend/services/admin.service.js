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
  const fixtureSnap = await fixtureRef.get();

  if (!fixtureSnap.exists) {
    throw new Error("Fixture no existe");
  }

  const fixture = fixtureSnap.data();

  // 1. Actualizar fixture
  await fixtureRef.update(data);

  // 2. Si no está finalizado, no hacemos nada más
  if (data.status !== "finished") return;

  const {
    homeClubId,
    awayClubId,
    scoreLocal,
    scoreAway
  } = data;

  // 3. Referencias a standings
  const homeRef = db.collection("standings").doc(homeClubId);
  const awayRef = db.collection("standings").doc(awayClubId);

  const [homeSnap, awaySnap] = await Promise.all([
    homeRef.get(),
    awayRef.get()
  ]);

  if (!homeSnap.exists || !awaySnap.exists) {
    throw new Error("Club no encontrado en standings");
  }

  const home = homeSnap.data();
  const away = awaySnap.data();

  // 4. Determinar ganador
  const homeWin = scoreLocal > scoreAway;
  const awayWin = scoreAway > scoreLocal;

  // 5. Calcular nuevos valores
  const homeUpdate = {
    PJ: home.PJ + 1,
    PG: home.PG + (homeWin ? 1 : 0),
    PP: home.PP + (homeWin ? 0 : 1),
    PF: home.PF + scoreLocal,
    PC: home.PC + scoreAway,
    DG: (home.PF + scoreLocal) - (home.PC + scoreAway),
    PTS: home.PTS + (homeWin ? 2 : 1)
  };

  const awayUpdate = {
    PJ: away.PJ + 1,
    PG: away.PG + (awayWin ? 1 : 0),
    PP: away.PP + (awayWin ? 0 : 1),
    PF: away.PF + scoreAway,
    PC: away.PC + scoreLocal,
    DG: (away.PF + scoreAway) - (away.PC + scoreLocal),
    PTS: away.PTS + (awayWin ? 2 : 1)
  };

  // 6. Guardar standings
  await Promise.all([
    homeRef.update(homeUpdate),
    awayRef.update(awayUpdate)
  ]);
}

module.exports = {
  getFixturesByCategory,
  updateFixture
};
