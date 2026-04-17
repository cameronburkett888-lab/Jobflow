import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVqHCI_4hmmZKVSojCRNnjhM7ynnDDnJU",
  authDomain: "tracket-f8e72.firebaseapp.com",
  projectId: "tracket-f8e72",
  storageBucket: "tracket-f8e72.firebasestorage.app",
  messagingSenderId: "336061126522",
  appId: "1:336061126522:web:78f0b7adf89486c941a8c3",
  measurementId: "G-J3VK6YWZQK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);