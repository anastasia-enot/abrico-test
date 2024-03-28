// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


interface Secrets {
  FIREBASE_API_KEY: string;
  FIREBASE_APP_ID: string;
}

async function readSecrets(): Promise<Secrets> {
  const files = import.meta.glob('./secrets.json');
  const fileKey = Object.keys(files)[0];
  const response = await fetch(files[fileKey]());
  const data: Secrets = await response.json();
  return data;
}

const secrets: Secrets = readSecrets();



const firebaseConfig = {
  apiKey: secrets.FIREBASE_API_KEY,
  authDomain: "abrico-test.firebaseapp.com",
  projectId: "abrico-test",
  storageBucket: "abrico-test.appspot.com",
  messagingSenderId: "456823227665",
  appId: secrets.FIREBASE_APP_ID, 
  measurementId: "G-Y95R5T88LP"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export default db;
