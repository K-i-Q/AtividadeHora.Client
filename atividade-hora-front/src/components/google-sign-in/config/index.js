import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDKm95PP05bFoYVkmyrusH19RAnw1j1bAQ",
    authDomain: "atividadehora-4f6d6.firebaseapp.com",
    projectId: "atividadehora-4f6d6",
    storageBucket: "atividadehora-4f6d6.appspot.com",
    messagingSenderId: "537899073911",
    appId: "1:537899073911:web:7c8b6c9bdccd79d881a172",
    measurementId: "G-SEL280K2ES"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore();

export { auth, provider, db };