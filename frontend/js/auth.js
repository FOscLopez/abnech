// js/auth.js
import { auth } from "./services/firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getIdTokenResult
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* LOGIN */
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("loginError");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "admin.html";
    } catch {
      errorBox.textContent = "Credenciales incorrectas";
    }
  });
}

/* PROTECCIÓN + ROL */
onAuthStateChanged(auth, async user => {
  if (!user) {
    if (window.location.pathname.includes("admin.html")) {
      window.location.href = "login.html";
    }
    return;
  }

  const token = await getIdTokenResult(user);
  window.USER_ROLE = token.claims.role || "none";

  console.log("Rol:", window.USER_ROLE);
});

/* LOGOUT */
window.logout = async () => {
  await signOut(auth);
  window.location.href = "index.html";
};
