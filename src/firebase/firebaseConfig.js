import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkG0AxKNbr6n-ifUlxJPQu_HaGHLgEVu",
  authDomain: "edugen-ai-b50e5.firebaseapp.com",
  projectId: "edugen-ai-b50e5",
  storageBucket: "edugen-ai-b50e5.appspot.com",
  messagingSenderId: "859057318503",
  appId: "1:859057318503:web:1a2b0d28673bc96ecc302",
  measurementId: "G-1BPV4ZXN5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };