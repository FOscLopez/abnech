import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

export async function loginAdmin(email, password) {
  const auth = getAuth();
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return await userCred.user.getIdToken();
}
