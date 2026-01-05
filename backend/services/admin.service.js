const db = require("../firebase");

async function updateFixture(fixtureId, body) {
  const fixtureRef = db.collection("fixtures").doc(fixtureId);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(fixtureRef);
    if (!snap.exists) throw new Error("Fixture no existe");

    const fixture = snap.data();

    // 🔒 1️⃣ OBJETO LIMPIO (SOLO CAMPOS PERMITIDOS)
    const updateData = {
      scoreLocal: Number(body.scoreLocal),
      scoreAway: Number(body.scoreAway),
      status: body.status,
    };

    tx.update(fixtureRef, updateData);

    // 🔒 2️⃣ SI YA ESTABA FINALIZADO → NO RECALCULAR
    if (fixture.status === "finished") return;
    if (body.status !== "finished") return;

    const homeRef = db.collection("standings").doc(fixture.homeClubId);
    const awayRef = db.collection("standings").doc(fixture.awayClubId);

    const homeSnap = await tx.get(homeRef);
    const awaySnap = await tx.get(awayRef);

    if (!homeSnap.exists || !awaySnap.exists) {
      throw new Error("Club no encontrado en standings");
    }

    const home = homeSnap.data();
    const away = awaySnap.data();

    const local = Number(body.scoreLocal);
    const awayScore = Number(body.scoreAway);

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
  updateFixture,
};
