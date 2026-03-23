async function loadData() {
    const res = await fetch('./data/fixture.json');
    const data = await res.json();
  
    renderNextMatch(data.nextMatch);
    renderResults(data.results);
  }
  
  /* =========================
     PRÓXIMA FECHA
  ========================= */
  function renderNextMatch(match) {
    const container = document.getElementById("nextMatch");
  
    container.innerHTML = `
      <div class="match-highlight">
  
        <div class="team">
          <img src="${match.homeLogo}">
          <p>${match.home}</p>
        </div>
  
        <div class="vs">VS</div>
  
        <div class="team">
          <img src="${match.awayLogo}">
          <p>${match.away}</p>
        </div>
  
      </div>
  
      <div class="match-info">
        ${match.date} - ${match.time}
      </div>
    `;
  }
  
  /* =========================
     RESULTADOS
  ========================= */
  function renderResults(results) {
    const container = document.getElementById("results");
  
    container.innerHTML = results.map(r => `
      <div class="result-card">
        <span>${r.date}</span>
        <h4>${r.home} ${r.score} ${r.away}</h4>
      </div>
    `).join('');
  }
  
  /* INIT */
  loadData();