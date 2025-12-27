function buildStandings(clubs, fixtures) {
    const table = {};
  
    clubs.forEach(c => {
      table[c.id] = {
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
  
    fixtures
      .filter(f => f.played === true)
      .forEach(f => {
        const home = table[f.homeClubId];
        const away = table[f.awayClubId];
  
        if (!home || !away) return;
  
        home.PJ++;
        away.PJ++;
  
        home.PF += f.homeScore;
        home.PC += f.awayScore;
        away.PF += f.awayScore;
        away.PC += f.homeScore;
  
        if (f.homeScore > f.awayScore) {
          home.PG++;
          away.PP++;
          home.PTS += 2;
        } else {
          away.PG++;
          home.PP++;
          away.PTS += 2;
        }
      });
  
    Object.values(table).forEach(t => {
      t.DG = t.PF - t.PC;
    });
  
    return Object.values(table).sort((a, b) => b.PTS - a.PTS || b.DG - a.DG);
  }
  
  module.exports = { buildStandings };
  