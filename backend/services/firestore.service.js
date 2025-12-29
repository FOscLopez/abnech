const { admin, initFirebase } = require("../firebase");

initFirebase();
const db = admin.firestore();

async function getStandingsPre() {
  // 1️⃣ Obtener clubes activos
  const clubsSnap = await db
    .collection("clubs")
    .where("active", "==", true)
    .get();

  const clubsMap = {};

  clubsSnap.forEach(doc => {
    const c = doc.data();
    clubsMap[c.id] = {
      name: c.name,
      PJ: 0,
      PG: 0,
      PP: 0,
      PF: 0,
      PC: 0,
      DG: 0,
      PTS: 0
    };
  });

  // 2️⃣ Obtener partidos finalizados
  const fixturesSnap = await db
    .collection("fixtures")
    .where("status", "==", "finished")
    .get();

  fixturesSnap.forEach(doc => {
    const f = doc.data();

    const home = clubsMap[f.homeClubId];
    const away = clubsMap[f.awayClubId];

    if (!home || !away) return;

    home.PJ++;
    away.PJ++;

    home.PF += f.scoreLocal;
    home.PC += f.scoreAway;

    away.PF += f.scoreAway;
    away.PC += f.scoreLocal;

    if (f.scoreLocal > f.scoreAway) {
      home.PG++;
      home.PTS += 2;
      away.PP++;
    } else {
      away.PG++;
      away.PTS += 2;
      home.PP++;
    }
  });

  // 3️⃣ Calcular DG y ordenar
  return Object.values(clubsMap)
    .map(t => ({
      ...t,
      DG: t.PF - t.PC
    }))
    .sort((a, b) => b.PTS - a.PTS || b.DG - a.DG);
}

module.exports = { getStandingsPre };
