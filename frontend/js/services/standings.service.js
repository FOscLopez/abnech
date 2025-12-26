// js/services/standings.service.js

import { fixtureData } from "../data/fixture.data.js";

export function calculateStandings(category) {
  const table = {};

  const partidos = fixtureData.filter(
    p => p.categoria === category && p.estado === "Finalizado"
  );

  partidos.forEach(p => {
    if (!table[p.local]) {
      table[p.local] = {
        equipo: p.local,
        pj: 0,
        pg: 0,
        pp: 0,
        pf: 0,
        pc: 0
      };
    }

    if (!table[p.visitante]) {
      table[p.visitante] = {
        equipo: p.visitante,
        pj: 0,
        pg: 0,
        pp: 0,
        pf: 0,
        pc: 0
      };
    }

    table[p.local].pj++;
    table[p.visitante].pj++;

    table[p.local].pf += p.scoreLocal;
    table[p.local].pc += p.scoreVisitante;

    table[p.visitante].pf += p.scoreVisitante;
    table[p.visitante].pc += p.scoreLocal;

    if (p.scoreLocal > p.scoreVisitante) {
      table[p.local].pg++;
      table[p.visitante].pp++;
    } else {
      table[p.visitante].pg++;
      table[p.local].pp++;
    }
  });

  return Object.values(table)
    .map(t => ({
      ...t,
      dif: t.pf - t.pc
    }))
    .sort((a, b) => b.pg - a.pg || b.dif - a.dif);
}
