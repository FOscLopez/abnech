async function loadData() {
    const res = await fetch("http://localhost:3000/api/fixture");
    const data = await res.json();
  
    renderNextMatch(data.nextMatch);
    renderResults(data.results);
  }
  
  /* ========================= */
  function renderNextMatch(match) {
    const el = document.getElementById("nextMatch");
  
    el.innerHTML = `
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
  
  /* ========================= */
  function renderResults(results) {
    const el = document.getElementById("results");
  
    el.innerHTML = results.map(r => `
      <div class="result-card">
        <span>${r.date}</span>
        <h4>${r.home} ${r.score} ${r.away}</h4>
      </div>
    `).join("");
  }
  
  loadData();