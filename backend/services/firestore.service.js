const { admin, initFirebase } = require("../firebase");

initFirebase();
const db = admin.firestore();

async function getStandingsPre() {
  // 1️⃣ Obtener clubes activos
  const clubsSnap = await db
    .collection("clubs")
    .where("active", "==", true)
    .get();

  const clubs = {};
  clubsSnap.forEach(doc => {
    const c = doc.data();
    clubs[c.id] = {
      id: c.id,
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
    .where("active", "==", true)
    .get();

  fixturesSnap.forEach(doc => {
    const f = doc.data();

    const home = clubs[f.homeClubId];
    const away = clubs[f.awayClubId];

    // Si algún club no existe o está inactivo → saltar
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
    } else if (f.scoreLocal < f.scoreAway) {
      away.PG++;
      away.PTS += 2;
      home.PP++;
    }
  });

  // 3️⃣ Calcular diferencia de goles
  Object.values(clubs).forEach(c => {
    c.DG = c.PF - c.PC;
  });

  // 4️⃣ Ordenar tabla
  return Object.values(clubs).sort((a, b) => {
    if (b.PTS !== a.PTS) return b.PTS - a.PTS;
    if (b.DG !== a.DG) return b.DG - a.DG;
    return b.PF - a.PF;
  });
}

module.exports = { getStandingsPre };
