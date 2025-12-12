// ===============================
// MAIN.JS — ABNECH Basket (Frontend público)
// ===============================

// 🔗 Backend oficial en Render
const API_BASE = "https://abnech-backend.onrender.com";

// ===============================
// CARGAR CLUBES DESDE EL BACKEND
// ===============================
async function cargarClubes() {
    try {
        const res = await fetch(`${API_BASE}/api/clubs`);
        const clubs = await res.json();

        console.log("[PUBLIC] Clubes recibidos:", clubs);

        const contenedor = document.getElementById("clubs-list");
        if (!contenedor) return;

        contenedor.innerHTML = "";

        clubs.forEach(club => {
            const nombre = club.nombre || club.name || "Club sin nombre";
            const ciudad = club.ciudad || club.city || "";
            const logo = club.logo || club.logoUrl || "/img/club-placeholder.png";

            const card = document.createElement("div");
            card.className = "club-card";

            card.innerHTML = `
                <div class="club-logo">
                    <img src="${logo}" onerror="this.src='/img/club-placeholder.png'" />
                </div>
                <div class="club-name">${nombre}</div>
                <div class="club-city">${ciudad}</div>
            `;

            contenedor.appendChild(card);
        });

    } catch (err) {
        console.error("Error cargando clubes:", err);
    }
}

// ===============================
// CARGAR FIXTURE DESDE EL BACKEND
// ===============================
async function cargarFixture() {
    try {
        const res = await fetch(`${API_BASE}/api/fixture`);
        const data = await res.json();

        console.log("[PUBLIC] Fixture recibido:", data);

        const cont = document.getElementById("fixture-container");
        if (!cont) return;

        cont.innerHTML = "";
        data.forEach(m => {
            const div = document.createElement("div");
            div.className = "match-card";
            div.innerHTML = `
                <div>${m.local} ${m.puntosLocal} - ${m.puntosVisita} ${m.visitante}</div>
                <div>${m.fecha}</div>
            `;
            cont.appendChild(div);
        });

    } catch (err) {
        console.error("Error cargando fixture:", err);
    }
}

// ===============================
// INICIALIZAR
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    cargarClubes();
    cargarFixture();
});
