// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'; // Import the specific function you need
import { getStorage } from 'firebase/storage'; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEicXOXeg769kuqrSJStnn43rkwEibIrA",
  authDomain: "peluqueria-8a666.firebaseapp.com",
  databaseURL: "https://peluqueria-8a666-default-rtdb.firebaseio.com",
  projectId: "peluqueria-8a666",
  storageBucket: "peluqueria-8a666.appspot.com",
  messagingSenderId: "868550465491",
  appId: "1:868550465491:web:482ecec44b52cda2974126"
};

const firebaseApp = initializeApp(firebaseConfig);
console.log(firebaseApp,"firebaseApp");
const storage = getStorage(firebaseApp);
console.log(storage,"storage");

export { storage, firebaseApp }; // Export what you need