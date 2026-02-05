/* ================= CLUB DATA ================= */

const CLUBS = {

    funebrero: {
      name: "Club Funebrero",
      colors: "Blanco • Rojo • Negro",
      logo: "/img/clubs/funebrero.png",
  
      news: [
        {
          title: "Victoria ante Unión",
          text: "Funebrero logró una gran victoria en la última jornada."
        },
        {
          title: "Inicio de temporada",
          text: "El club se prepara para una nueva temporada."
        }
      ],
  
      history: `
        Fundado en la ciudad del Chaco, el Club Funebrero
        es una institución histórica del básquet regional.
      `
    },
  
  
    union: {
      name: "Club Unión",
      colors: "Azul • Blanco",
      logo: "/img/clubs/union.png",
  
      news: [],
      history: "Historia en construcción."
    },
  
  
    cfa: {
      name: "CFA",
      colors: "Verde • Blanco",
      logo: "/img/clubs/cfa.png",
  
      news: [],
      history: "Historia en construcción."
    },
  
  
    zapallar: {
      name: "Zapallar",
      colors: "Amarillo • Negro",
      logo: "/img/clubs/zapallar.png",
  
      news: [],
      history: "Historia en construcción."
    }
  
  };
  
  
  /* ================= GET ID ================= */
  
  const params = new URLSearchParams(window.location.search);
  const clubId = params.get("id");
  
  const club = CLUBS[clubId];
  
  if (!club) {
    alert("Club no encontrado");
  }
  
  
  /* ================= HEADER ================= */
  
  document.getElementById("club-name").textContent = club.name;
  document.getElementById("club-colors").textContent = club.colors;
  document.getElementById("club-logo").src = club.logo;
  
  
  /* ================= NEWS ================= */
  
  const newsBox = document.getElementById("news");
  
  if (club.news.length === 0) {
  
    newsBox.innerHTML = "<p>Sin noticias por ahora.</p>";
  
  } else {
  
    newsBox.innerHTML = club.news.map(n => `
      <div class="news-card">
        <h3>${n.title}</h3>
        <p>${n.text}</p>
      </div>
    `).join("");
  
  }
  
  
  /* ================= PLANTEL ================= */
  
  import squad from "./squad.funebrero.js";
  
  const squadBox = document.getElementById("squad");
  
  if (clubId === "funebrero") {
  
    squadBox.innerHTML = `
      <table class="squad-table">
  
        <thead>
          <tr>
            <th>#</th>
            <th>Jugador</th>
            <th>DNI</th>
            <th>Nacimiento</th>
            <th>Categoría</th>
          </tr>
        </thead>
  
        <tbody>
  
          ${squad.map((p, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${p.name}</td>
              <td>${p.dni}</td>
              <td>${p.birth}</td>
              <td>${p.category}</td>
            </tr>
          `).join("")}
  
        </tbody>
  
      </table>
    `;
  
  } else {
  
    squadBox.innerHTML = "<p>Plantel en carga.</p>";
  
  }
  
  
  /* ================= HISTORY ================= */
  
  document.getElementById("history").innerHTML = `
    <div class="history-box">
      ${club.history}
    </div>
  `;
  
  
  /* ================= TABS ================= */
  
  document.querySelectorAll(".club-nav button").forEach(btn => {
  
    btn.onclick = () => {
  
      document.querySelectorAll(".club-nav button")
        .forEach(b => b.classList.remove("active"));
  
      document.querySelectorAll(".tab")
        .forEach(t => t.classList.remove("active"));
  
      btn.classList.add("active");
  
      document.getElementById(btn.dataset.tab)
        .classList.add("active");
  
    };
  
  });