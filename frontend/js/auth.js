// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC0ypWFEhPWu2jiyTZoW3fd9SPes3wcBdc",
    authDomain: "abnech-basket.firebaseapp.com",
    projectId: "abnech-basket",
    storageBucket: "abnech-basket.firebasestorage.app",
    messagingSenderId: "1020692623846",
    appId: "1:1020692623846:web:a1b37421b2e891b52b6627",
    measurementId: "G-S3KXDNB58S"
  };

  // Email del admin autorizado (el que creaste en Firebase)
const ADMIN_EMAILS = ["admin@abnech.com"];

let auth = null;
let isAdmin = false;

(function initFirebase() {
  if (!firebaseConfig.apiKey) {
    console.warn("Firebase no está configurado. El login no funcionará.");
    return;
  }
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();

  auth.onAuthStateChanged(user => {
    if (user && ADMIN_EMAILS.includes(user.email)) {
      isAdmin = true;
      showAdminUI(user.email);
    } else {
      isAdmin = false;
      hideAdminUI();
    }
  });
})();

function showAdminUI(email) {
  const adminSection = document.getElementById("admin");
  const adminLink = document.getElementById("admin-link");
  const loginBtn = document.getElementById("login-button");
  const logoutBtn = document.getElementById("logout-button");

  adminSection?.classList.remove("hidden");
  adminLink?.classList.remove("hidden");
  loginBtn?.classList.add("hidden");
  logoutBtn?.classList.remove("hidden");
}

function hideAdminUI() {
  const adminSection = document.getElementById("admin");
  const adminLink = document.getElementById("admin-link");
  const loginBtn = document.getElementById("login-button");
  const logoutBtn = document.getElementById("logout-button");

  adminSection?.classList.add("hidden");
  adminLink?.classList.add("hidden");
  loginBtn?.classList.remove("hidden");
  logoutBtn?.classList.add("hidden");
}

// ====== MANEJO DEL MODAL ======
const loginModal = document.getElementById("login-modal");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const loginSubmit = document.getElementById("login-submit");
const loginCancel = document.getElementById("login-cancel");
const loginError = document.getElementById("login-error");

loginButton?.addEventListener("click", () => {
  loginError.textContent = "";
  loginModal.classList.remove("hidden");
});

loginCancel?.addEventListener("click", () => {
  loginModal.classList.add("hidden");
});

logoutButton?.addEventListener("click", async () => {
  try {
    await auth?.signOut();
  } catch (e) {
    console.error(e);
  }
});

// ====== LOGIN SUBMIT ======
loginSubmit?.addEventListener("click", async () => {
  if (!auth) {
    loginError.textContent = "Login deshabilitado (Firebase no configurado).";
    return;
  }

  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-password").value;

  try {
    loginError.textContent = "";
    await auth.signInWithEmailAndPassword(email, pass);
    loginModal.classList.add("hidden");
  } catch (e) {
    console.error(e);
    loginError.textContent = "Credenciales inválidas o error de conexión.";
  }
});