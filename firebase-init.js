// ============================================
//   LARRY B — FIREBASE INIT (firebase-init.js)
// ============================================
// Sets up the Larry B Casuals Firebase project
// (separate from the RCCG church app's Firebase project).
// Exposes `window.db` so tracking.js can use Firestore.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDyAZVdkw4RbgTpZih4nx4_HbV8ynIfkQ4",
  authDomain: "larryb-click-tracker.firebaseapp.com",
  projectId: "larryb-click-tracker",
  storageBucket: "larryb-click-tracker.firebasestorage.app",
  messagingSenderId: "899047738783",
  appId: "1:899047738783:web:5b6d50028c0cf64848c1aa"
};

const app = initializeApp(firebaseConfig);
window.db = getFirestore(app);