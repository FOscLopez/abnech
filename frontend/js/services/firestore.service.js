// js/services/firestore.service.js

import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =====================================================
   CONFIG GLOBAL
===================================================== */

// 🔥 control central (clave)
export const FIRESTORE_ENABLED = false;

/* =====================================================
   CLUBS
===================================================== */

export async function getClubs() {

  if (!FIRESTORE_ENABLED) return [];

  const snap = await getDocs(
    query(collection(db, "clubs"), orderBy("name"))
  );

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

/* =====================================================
   FIXTURES
===================================================== */

export async function getFixturesFirestore(categoryId) {

  if (!FIRESTORE_ENABLED) return [];

  let q = collection(db, "fixtures");

  if (categoryId) {
    q = query(q, where("categoryId", "==", categoryId), orderBy("order"));
  } else {
    q = query(q, orderBy("order"));
  }

  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

export async function createFixture(data) {
  return await addDoc(collection(db, "fixtures"), data);
}

export async function updateFixture(id, data) {
  return await updateDoc(doc(db, "fixtures", id), data);
}

export async function deleteFixture(id) {
  return await deleteDoc(doc(db, "fixtures", id));
}

/* =====================================================
   RESULTADOS
===================================================== */

export async function saveResult(fixtureId, scoreLocal, scoreAway) {
  return await updateDoc(doc(db, "fixtures", fixtureId), {
    scoreLocal: Number(scoreLocal),
    scoreAway: Number(scoreAway),
    status: "finished"
  });
}

/* =====================================================
   TABLA DE POSICIONES (CORE)
===================================================== */

export function buildStandings(fixtures, clubs) {

  const table = {};

  clubs.forEach(c => {
    table[c.id] = {
      clubId: c.id,
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

  fixtures.forEach(f => {
    if (
      f.status !== "finished" ||
      f.scoreLocal == null ||
      f.scoreAway == null
    ) return;

    const home = table[f.homeClubId];
    const away = table[f.awayClubId];

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

  Object.values(table).forEach(t => {
    t.DG = t.PF - t.PC;
  });

  return Object.values(table).sort((a, b) => {
    if (b.PTS !== a.PTS) return b.PTS - a.PTS;
    if (b.DG !== a.DG) return b.DG - a.DG;
    return b.PF - a.PF;
  });
}