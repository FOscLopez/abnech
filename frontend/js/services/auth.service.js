import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { app } from "./firebase.js"; // 🔥 IMPORTANTE

const auth = getAuth(app);

// =========================
// LOGIN
// =========================
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// =========================
// LOGOUT
// =========================
export function logout() {
  return signOut(auth);
}

// =========================
// OBSERVADOR (CLAVE)
// =========================
export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// =========================
// USUARIO ACTUAL
// =========================
export function getCurrentUser() {
  return auth.currentUser;
}