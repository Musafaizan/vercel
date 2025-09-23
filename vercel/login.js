


import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5w3k9ktMVYvwsUf9BqOL2c5UxwIxqWd0",
  authDomain: "project1-88f81.firebaseapp.com",
  projectId: "project1-88f81",
  storageBucket: "project1-88f81.firebasestorage.app",
  messagingSenderId: "704911379731",
  appId: "1:704911379731:web:372a899cbf0a315d4a1ee6",
  measurementId: "G-VHHVKPT5MY"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginButton = document.getElementById("register"); 
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

function clearErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach(el => el.textContent = "");
}

loginButton.addEventListener("click", async function(event) {
  event.preventDefault();
  clearErrors();

  let isValid = true;
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (email === "") {
    emailError.textContent = "Email is required.";
    isValid = false;
  } else if (!emailRegex.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (password === "") {
    passwordError.textContent = "Password is required.";
    isValid = false;
  }

  if (isValid) {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful! Welcome to homepage!");
      window.location.href = "home.html"; 

    } catch (error) {
      const errorCode = error.code;
      if (errorCode === "auth/wrong-password") {
        passwordError.textContent = "Incorrect password.";
      } else if (errorCode === "auth/user-not-found") {
        emailError.textContent = "No user found with this email.";
      } else if (errorCode === "auth/invalid-email") {
        emailError.textContent = "The email address is not valid.";
      } else {
        alert(`Login failed: ${error.message}`);
        console.error("Firebase login error:", error);
      }
    }
  }
});