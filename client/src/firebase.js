// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
//   apiKey: process.env.VITE_FIREBASE_API_KEY,
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-9da0a.firebaseapp.com",
    projectId: "mern-blog-9da0a",
    storageBucket: "mern-blog-9da0a.appspot.com",
    messagingSenderId: "700569483959",
    appId: "1:700569483959:web:f720448b978ee3053a2b32"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

