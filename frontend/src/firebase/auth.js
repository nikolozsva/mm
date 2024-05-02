import { initializeApp } from "@firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
} from "firebase/auth";

import firebaseConfig from "./config";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const createUserEmailPassword = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const loginEmailPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password)
    return true;
  } catch (err) {
    console.error("FIREBASE ERROR: " + err);
    return false;
  }
};

// Sign in via google account
const loginGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// Send password reset link to an email address
const sendPassResetEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  try { 
    auth.signOut();
  } catch (err) {
    console.error(err);
  }
};


export {
  auth,
  createUserEmailPassword,
  loginEmailPassword,
  loginGoogle,
  sendPassResetEmail,
  logout,
}