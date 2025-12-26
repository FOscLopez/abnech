// frontend/js/admin.js
'use strict';

// Ajustá esto si tu backend está en otro dominio:
const API_BASE =
  (typeof window !== 'undefined' && window.location.hostname.includes('web.app'))
    ? 'https://abnech.onrender.com'
    : 'http://localhost:3000';

function $(id) {
  return document.getElementById(id);
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return { ok: true, data: JSON.parse(text), rawText: text };
  } catch {
    return { ok: false, data: null, rawText: text };
  }
}

function log(...args) {
  console.log('[ADMIN]', ...args);
}

document.addEventListener('DOMContentLoaded', () => {
  log('admin.js cargado');

  // Crear club
  const clubNameInput = $('club-name');
  const clubCityInput = $('club-city');
  const clubLogoUrlInput = $('club-logo-url');
  const createClubBtn = $('create-club-btn');

  // Eliminar club
  const deleteClubIdInput = $('delete-club-id');
  const deleteClubBtn = $('delete-club-btn');

  // Subir logo
  const logoClubIdInput = $('logo-club-id');
  const logoFileInput = $('logo-file');
  const uploadLogoBtn = $('upload-logo-btn');

  // Validación mínima (si faltan IDs en HTML, al menos lo sabés)
  if (!clubNameInput || !clubCityInput || !createClubBtn) {
    log('No se encontraron elementos para CREAR CLUB. Revisar IDs en el HTML.');
  }
  if (!deleteClubIdInput || !deleteClubBtn) {
    log('No se encontraron elementos para ELIMINAR CLUB. Revisar IDs en el HTML.');
  }
  if (!logoClubIdInput || !logoFileInput || !uploadLogoBtn) {
    log('No se encontraron elementos para SUBIR LOGO. Revisar IDs en el HTML.');
  }

  async function createClub() {
    const name = (clubNameInput?.value || '').trim();
    const city = (clubCityInput?.value || '').trim();
    const logoUrl = (clubLogoUrlInput?.value || '').trim();

    if (!name) return alert('Falta nombre');
    if (!city) return alert('Falta ciudad');

    try {
      const res = await fetch(`${API_BASE}/api/clubs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, city, logoUrl }),
      });

      const parsed = await safeJson(res);
      log('Respuesta /api/clubs:', { status: res.status, rawText: parsed.rawText, data: parsed.data });

      if (!res.ok) {
        alert((parsed.data && parsed.data.error) || 'Error creando club');
        return;
      }

      alert(`Club creado. ID: ${parsed.data.id}`);
      // Limpio inputs (sin romper nada más)
      clubNameInput.value = '';
      clubCityInput.value = '';
      if (clubLogoUrlInput) clubLogoUrlInput.value = '';
    } catch (err) {
      console.error(err);
      alert('Error creando club');
    }
  }

  async function deleteClub() {
    const id = Number((deleteClubIdInput?.value || '').trim());
    if (!id) return alert('Falta ID del club');

    try {
      const res = await fetch(`${API_BASE}/api/clubs/${id}`, { method: 'DELETE' });
      const parsed = await safeJson(res);
      log('Respuesta DELETE /api/clubs/:id:', { status: res.status, rawText: parsed.rawText, data: parsed.data });

      if (!res.ok) {
        alert((parsed.data && parsed.data.error) || 'Error eliminando club');
        return;
      }

      alert('Club eliminado');
      deleteClubIdInput.value = '';
    } catch (err) {
      console.error(err);
      alert('Error eliminando club');
    }
  }

  async function uploadClubLogo() {
    const clubId = Number((logoClubIdInput?.value || '').trim());
    const file = logoFileInput?.files?.[0];

    if (!clubId) return alert('Falta id');
    if (!file) return alert('Seleccioná un archivo');

    try {
      const formData = new FormData();
      formData.append('clubId', String(clubId));
      formData.append('logo', file); // <- IMPORTANTE: 'logo'

      const res = await fetch(`${API_BASE}/api/upload-club-logo`, {
        method: 'POST',
        body: formData,
      });

      const parsed = await safeJson(res);
      log('Respuesta /api/upload-club-logo:', { status: res.status, rawText: parsed.rawText, data: parsed.data });

      if (!res.ok || !parsed.data?.ok) {
        alert(parsed.data?.error || 'Error subiendo logo');
        // Si backend manda "detail", lo dejamos visible en consola
        if (parsed.data?.detail) console.error('[ADMIN] DETAIL:', parsed.data.detail);
        if (parsed.data?.stack) console.error('[ADMIN] STACK:', parsed.data.stack);
        return;
      }

      alert('Logo subido correctamente');
      logoFileInput.value = '';
    } catch (err) {
      console.error(err);
      alert('Error subiendo logo');
    }
  }

  createClubBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    createClub();
  });

  deleteClubBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    deleteClub();
  });

  uploadLogoBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    uploadClubLogo();
  });
});
