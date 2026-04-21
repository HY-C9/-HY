import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBq9ecmKEuBPOgnfWKDFlo3h4QnAEohmmw",
  authDomain: "pimthai-e16c3.firebaseapp.com",
  projectId: "pimthai-e16c3",
  storageBucket: "pimthai-e16c3.firebasestorage.app",
  messagingSenderId: "955936818307",
  appId: "1:955936818307:web:273fa00d07f36894d207b6",
  measurementId: "G-WTE2GWT6SN"
};

const app = initializeApp(firebaseConfig);

window.db = getFirestore(app);
window.auth = getAuth(app);
window.storage = getStorage(app);

console.log("🔥พร้อมลุยแล้ว!");