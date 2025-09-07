import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyDpFi392vw5inmp655V9Q2QYTFxUnXdzHs",

  authDomain: "mechanicalburger-7cda8.firebaseapp.com",

  projectId: "mechanicalburger-7cda8",

  storageBucket: "mechanicalburger-7cda8.firebasestorage.app",

  messagingSenderId: "318105174365",

  appId: "1:318105174365:web:a29f194f2930351d7068b4",

  measurementId: "G-HYJYYLDMRT"

};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);