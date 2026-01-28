const db = require("../firebase");

/* ================== ACTUALIZAR FIXTURE ================== */
async function updateFixture(fixtureId, body) {

  const fixtureRef = db.collection("fixtures").doc(fixtureId);

  await db.runTransaction(async (tx) => {

    /* ================== READS PRIMERO ================== */

    const snap = await tx.get(fixtureRef);

    if (!snap.exists) throw new Error("Fixture no existe");

    const fixture = snap.data();

    if (fixture.deleted) {
      throw new Error("Fixture eliminado");
    }

    let homeSnap = null;
    let awaySnap = null;

    // Si va a finalizar → leemos standings ANTES
    if (fixture.status !== "finished" && body.status === "finished") {

      const homeRef = db.collection("standings").doc(fixture.homeClubId);
      const awayRef = db.collection("standings").doc(fixture.awayClubId);

      homeSnap = await tx.get(homeRef);
      awaySnap = await tx.get(awayRef);

      if (!homeSnap.exists || !awaySnap.exists) {
        throw new Error("Club no encontrado en standings");
      }
    }

    /* ================== WRITES DESPUÉS ================== */

    // Actualizar fixture
    tx.update(fixtureRef, {
      scoreLocal: Number(body.scoreLocal),
      scoreAway: Number(body.scoreAway),
      status: body.status,
    });

    // Si no finaliza → listo
    if (fixture.status === "finished") return;
    if (body.status !== "finished") return;

    const home = homeSnap.data();
    const away = awaySnap.data();

    const local = Number(body.scoreLocal);
    const awayScore = Number(body.scoreAway);

    const homeWin = local > awayScore;
    const awayWin = awayScore > local;

    const homeRef = db.collection("standings").doc(fixture.homeClubId);
    const awayRef = db.collection("standings").doc(fixture.awayClubId);

    // Update local
    tx.update(homeRef, {
      PJ: home.PJ + 1,
      PG: home.PG + (homeWin ? 1 : 0),
      PP: home.PP + (homeWin ? 0 : 1),
      PF: home.PF + local,
      PC: home.PC + awayScore,
      DG: home.DG + (local - awayScore),
      PTS: home.PTS + (homeWin ? 2 : 1),
    });

    // Update visitante
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

/* ================== CREAR FIXTURE ================== */
async function createFixture(data) {

  const {
    categoryId,
    date,
    time,
    homeClubId,
    awayClubId,
    venue,
  } = data;

  if (!date || !homeClubId || !awayClubId) {
    throw new Error("Datos incompletos");
  }

  const finalCategory = categoryId || "B1";

  const fixture = {
    categoryId: finalCategory,
    date,
    time: time || "",

    homeClubId,
    awayClubId,
    venue: venue || "",

    // Arranca programado
    status: "scheduled",

    active: true,

    deleted: false, // 👈 IMPORTANTE

    scoreLocal: null,
    scoreAway: null,

    createdAt: new Date(),
  };

  const ref = await db.collection("fixtures").add(fixture);

  return {
    id: ref.id,
    ...fixture,
  };
}

/* ================== BORRADO SEGURO (SOFT DELETE) ================== */
async function deleteFixture(id) {

  const ref = db.collection("fixtures").doc(id);

  await ref.update({
    deleted: true,
    deletedAt: new Date(),
  });
}

module.exports = {
  updateFixture,
  createFixture,
  deleteFixture
};
