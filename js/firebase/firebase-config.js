// js/firebase-config.js - Inicialização do Firebase modular v10+

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { 
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBaKTM5jQJFY3fC4jAQyaE_p08lbyY68A8",
  authDomain: "agendaigrejas.firebaseapp.com",
  projectId: "agendaigrejas",
  storageBucket: "agendaigrejas.firebasestorage.app",
  messagingSenderId: "881520232726",
  appId: "1:881520232726:web:04e06e502c2c7f3ba16837"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Expõe para uso global nos outros scripts
window.db = db;
window.firebaseFirestore = {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs
};
