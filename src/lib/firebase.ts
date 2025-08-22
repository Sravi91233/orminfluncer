import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBYsbHTJsAir4Wd6pGIIc2cPit6s0jYsxk",
  authDomain: "influncer-2968e.firebaseapp.com",
  projectId: "influncer-2968e",
  storageBucket: "influncer-2968e.appspot.com",
  messagingSenderId: "392907356868",
  appId: "1:392907356868:web:1f322945bb3fb271f42791",
  measurementId: "G-YVVJL2X0HL"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
