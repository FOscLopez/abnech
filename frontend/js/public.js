import { getFixtures } from "./services/fixtures.service.js";

/* ================== FIREBASE / ADMIN LINK ================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const adminLink = document.getElementById("adminLink");

onAuthStateChanged(auth, user => {
  if (!adminLink) return;

  if (
    user &&
    (user.email === "admin@abnech.com" || user.email === "editor@abnech.com")
  ) {
    adminLink.style.display = "inline-block";
  } else {
    adminLink.style.display = "none";
  }
});

/* ================== RESTO DE TU CÓDIGO ================== */
/* TODO lo que sigue queda EXACTAMENTE igual a lo que enviaste */

const STORAGE_KEY = "abnech_ui_state";

/* … (el resto de tu archivo sigue igual, sin cambios) … */
