import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { TaskList } from './tasklist.js';
export const taskList = new TaskList();

const email = document.getElementById("email");
const password = document.getElementById("password");
const login_btn = document.getElementById("login_btn");
const register_btn = document.getElementById("register_btn");
const logout_btn = document.getElementById("logout_btn");
const forgot_btn = document.getElementById("forgot_btn");
const auth_error = document.getElementById("auth_error");

login_btn.addEventListener("click", async () => {
    try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        showApp();
    } catch (error) {
        auth_error.textContent = error.message;
    }
});

register_btn.addEventListener("click", async () => {
    try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        showApp();
    } catch (error) {
        auth_error.textContent = error.message;
    }
});

logout_btn.addEventListener("click", () => {
    auth.signOut();
    document.getElementById("login_screen").style.display = "block";
    document.getElementById("app_screen").style.display = "none";
});

forgot_btn.addEventListener("click", async () => {
    try {
        await sendPasswordResetEmail(auth, email.value);
        auth_error.textContent = "Password reset email sent!";
    } catch (error) {
        auth_error.textContent = error.message;
    }
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        showApp();
    }
});


function showApp() {
    document.getElementById("login_screen").style.display = "none";
    document.getElementById("app_screen").style.display = "block";
    taskList.loadTasks();
}
