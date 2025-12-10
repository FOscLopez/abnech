// frontend/js/admin.js
// Panel de administración ABNECH – Clubes + subida de logos

// ⚠️ PONÉ ACÁ LA URL DE TU API EN RENDER
// Ejemplo: "https://abnech.onrender.com"
const API_BASE = "https://abnech.onrender.com";

// Helper para mostrar errores en consola y alert
function showError(msg, err) {
  console.error(msg, err || "");
  alert(msg);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("[ADMIN] Panel cargado");

  // ----------- CREAR CLUB ----------- //
  const clubNameInput = document.getElementById("club-name");
  const clubCityInput = document.getElementById("club-city");
  const clubLogoUrlInput = document.getElementById("club-logo-url");
  const createClubBtn = document.getElementById("create-club-btn");

  if (clubNameInput && clubCityInput && createClubBtn) {
    createClubBtn.addEventListener("click", async () => {
      const name = (clubNameInput.value || "").trim();
      const city = (clubCityInput.value || "").trim();
      const logoUrl = (clubLogoUrlInput?.value || "").trim();

      if (!name) {
        alert("Ingresá el nombre del club");
        return;
      }
      if (!city) {
        alert("Ingresá la ciudad del club");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/clubs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, city, logoUrl })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.ok) {
          showError(data.error || "Error creando club");
          return;
        }

        alert(`Club creado con ID: ${data.club.id}`);
        console.log("[ADMIN] Club creado:", data.club);

        // limpiamos campos
        clubNameInput.value = "";
        clubCityInput.value = "";
        if (clubLogoUrlInput) clubLogoUrlInput.value = "";
      } catch (err) {
        showError("Error de conexión al crear club", err);
      }
    });
  } else {
    console.warn(
      "[ADMIN] No se encontraron elementos para CREAR CLUB. Revisar IDs en el HTML."
    );
  }

  // ----------- ELIMINAR CLUB ----------- //
  const deleteClubIdInput = document.getElementById("delete-club-id");
  const deleteClubBtn = document.getElementById("delete-club-btn");

  if (deleteClubIdInput && deleteClubBtn) {
    deleteClubBtn.addEventListener("click", async () => {
      const id = (deleteClubIdInput.value || "").trim();
      if (!id) {
        alert("Ingresá el ID del club a eliminar");
        return;
      }

      if (!confirm(`¿Seguro que querés eliminar el club ID ${id}?`)) return;

      try {
        const res = await fetch(`${API_BASE}/api/clubs/${encodeURIComponent(id)}`, {
          method: "DELETE"
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.ok) {
          showError(data.error || "Error eliminando club");
          return;
        }

        alert("Club eliminado correctamente");
        console.log("[ADMIN] Club eliminado:", id);
        deleteClubIdInput.value = "";
      } catch (err) {
        showError("Error de conexión al eliminar club", err);
      }
    });
  } else {
    console.warn(
      "[ADMIN] No se encontraron elementos para ELIMINAR CLUB. Revisar IDs en el HTML."
    );
  }

  // ----------- SUBIR LOGO (ARCHIVO) ----------- //
  const logoClubIdInput = document.getElementById("logo-club-id");
  const logoFileInput = document.getElementById("logo-file");
  const uploadLogoBtn = document.getElementById("upload-logo-btn");

  if (logoClubIdInput && logoFileInput && uploadLogoBtn) {
    uploadLogoBtn.addEventListener("click", async () => {
      const clubId = (logoClubIdInput.value || "").trim();
      const file = logoFileInput.files && logoFileInput.files[0];

      if (!clubId) {
        alert("Ingresá el ID del club para el logo");
        return;
      }
      if (!file) {
        alert("Seleccioná un archivo de imagen para el logo");
        return;
      }

      const formData = new FormData();
      formData.append("clubId", clubId);
      formData.append("logo", file);

      try {
        const res = await fetch(`${API_BASE}/api/upload-club-logo`, {
          method: "POST",
          body: formData
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.ok || !data.url) {
          showError(data.error || "Error al subir logo de club");
          return;
        }

        console.log("[ADMIN] Logo subido. URL pública:", data.url);
        alert("Logo subido correctamente");

        // Si existe el campo de URL de logo, lo completamos automáticamente
        if (clubLogoUrlInput) {
          clubLogoUrlInput.value = data.url;
        }

        // limpiamos input de archivo
        logoFileInput.value = "";
      } catch (err) {
        showError("Error de conexión al subir logo", err);
      }
    });
  } else {
    console.warn(
      "[ADMIN] No se encontraron elementos para SUBIR LOGO. Revisar IDs en el HTML."
    );
  }
});
