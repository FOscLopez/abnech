const db = require("./firebase");

async function getStandings(categoryId) {
  const snapshot = await db
    .collection("standings")
    .where("categoryId", "==", categoryId)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const clubId = doc.id;

    return {
      id: clubId,
      clubId,
      name: data.name || clubId,
      logo: data.logo || `${clubId}.png`, // 🔥 FIX CLAVE
      PJ: data.PJ ?? 0,
      PG: data.PG ?? 0,
      PP: data.PP ?? 0,
      PF: data.PF ?? 0,
      PC: data.PC ?? 0,
      DG: data.DG ?? 0,
      PTS: data.PTS ?? 0,
    };
  });
}

module.exports = { getStandings };
