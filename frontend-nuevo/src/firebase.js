import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update, set, get } from "firebase/database"; // Agregá get aquí

const firebaseConfig = {
  apiKey: "AIzaSyCTpzG_521-o7Jy0L5Iu-G_j44OazJgEbk",
  authDomain: "pptonline-ed145.firebaseapp.com",
  databaseURL: "https://pptonline-ed145-default-rtdb.firebaseio.com",
  projectId: "pptonline-ed145",
  storageBucket: "pptonline-ed145.firebasestorage.app",
  messagingSenderId: "194713755184",
  appId: "1:194713755184:web:7886c4a0cd1c87e2dfd7f5",
  measurementId: "G-5D0MRCW95N",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, update, set, get }; // Asegúrate de exportar get aquí
