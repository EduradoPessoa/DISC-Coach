
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração oficial do projeto disccoach-2055d
const firebaseConfig = {
  apiKey: "AIzaSyAiqsI80bZv8-DEi9JqHizsebhfqk6YBQ0",
  authDomain: "disccoach-2055d.firebaseapp.com",
  projectId: "disccoach-2055d",
  storageBucket: "disccoach-2055d.firebasestorage.app",
  messagingSenderId: "374796567231",
  appId: "1:374796567231:web:b08fe221fb5baca1757c0a",
  measurementId: "G-ZJS4PB4P40"
};

// Initialize Firebase singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
