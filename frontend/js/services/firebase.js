// js/services/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {

  apiKey: "AIzaSyC0ypWFEhPWu2jiyTZoW3fd9SPes3wcBdc",
  authDomain: "abnech-basket.firebaseapp.com",
  projectId: "abnech-basket",
  storageBucket: "abnech-basket.firebasestorage.app",
  messagingSenderId: "1020692623846",
  appId: "1:1020692623846:web:a1b37421b2e891b52b6627",
  measurementId: "G-S3KXDNB58S"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("Firebase inicializado correctamente");