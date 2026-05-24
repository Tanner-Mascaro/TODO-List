import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAldmAXHtcWGk7DDdmp0XoC3VR4dQ9bXjM",
    authDomain: "task-list-c79f2.firebaseapp.com",
    projectId: "task-list-c79f2",
    storageBucket: "task-list-c79f2.firebasestorage.app",
    messagingSenderId: "986436176297",
    appId: "1:986436176297:web:c2c3259bd7807784fa1cb8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);