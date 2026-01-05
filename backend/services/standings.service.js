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
      clubId: clubId,
      name: data.name,
      logo: `${clubId}.png`, // 🔴 FUERZA logo SIEMPRE
      PJ: Number(data.PJ) || 0,
      PG: Number(data.PG) || 0,
      PP: Number(data.PP) || 0,
      PF: Number(data.PF) || 0,
      PC: Number(data.PC) || 0,
      DG: Number(data.DG) || 0,
      PTS: Number(data.PTS) || 0,
    };
  });
}

module.exports = { getStandings };
