import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA4S7lKK6BuPj0O40_qDZAmMONW9CimsNM",
  authDomain: "learnlingo-8bbbd.firebaseapp.com",
  databaseURL:
    "https://learnlingo-8bbbd-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "learnlingo-8bbbd",
  storageBucket: "learnlingo-8bbbd.firebasestorage.app",
  messagingSenderId: "795711421393",
  appId: "1:795711421393:web:9c188dcdaa492179e07ef0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
