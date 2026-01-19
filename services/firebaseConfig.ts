
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiqsI80bZv8-DEi9JqHizsebhfqk6YBQ0",
  authDomain: "disccoach-2055d.firebaseapp.com",
  projectId: "disccoach-2055d",
  storageBucket: "disccoach-2055d.firebasestorage.app",
  messagingSenderId: "374796567231",
  appId: "1:374796567231:web:b08fe221fb5baca1757c0a",
  measurementId: "G-ZJS4PB4P40"
};

// Singleton pattern para evitar inicialização múltipla
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
