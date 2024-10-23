// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb5Nfr3rWdv4s26UBMpLBhXWdlKq-2Ts4",
  authDomain: "gta-garage-manager.firebaseapp.com",
  projectId: "gta-garage-manager",
  storageBucket: "gta-garage-manager.appspot.com",
  messagingSenderId: "133018862217",
  appId: "1:133018862217:web:49ca5504a1ad3797e93c58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };