import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD3Hbl2Yu0-FZDSPzWh-BaRDPAEmSDsLUI",
    authDomain: "newloan-291ef.firebaseapp.com",
    projectId: "newloan-291ef",
    storageBucket: "newloan-291ef.firebasestorage.app",
    messagingSenderId: "234714082805",
    appId: "1:234714082805:web:8e75215c6aa3864d8084bc",
    measurementId: "G-NJY2YVNLCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)