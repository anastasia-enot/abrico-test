// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "abrico-test.firebaseapp.com",
  projectId: "abrico-test",
  storageBucket: "abrico-test.appspot.com",
  messagingSenderId: "456823227665",
  appId: process.env.FIREBASE_APP_ID,
  measurementId: "G-Y95R5T88LP"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export default db;
