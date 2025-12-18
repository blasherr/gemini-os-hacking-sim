import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDvZT8ePOvJRmTlYYE88qu_gKhTAlZSzqw",
  authDomain: "mdt-fan.firebaseapp.com",
  projectId: "mdt-fan",
  storageBucket: "mdt-fan.firebasestorage.app",
  messagingSenderId: "1081027923568",
  appId: "1:1081027923568:web:7c0b5a99a2c2e80202eeb5",
  measurementId: "G-YME2FFS79P"
};

let app: FirebaseApp;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

export { app, db };
