import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBexdKbFg7mjPZybYHDstZEQraebvKBm6k",
  authDomain: "mdt-fan-v1.firebaseapp.com",
  projectId: "mdt-fan-v1",
  storageBucket: "mdt-fan-v1.firebasestorage.app",
  messagingSenderId: "162786992446",
  appId: "1:162786992446:web:f4a2bbc548b5c62b190c6f",
  measurementId: "G-V700HQN6M3"
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
