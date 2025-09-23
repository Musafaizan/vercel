
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyB5w3k9ktMVYvwsUf9BqOL2c5UxwIxqWd0",
  authDomain: "project1-88f81.firebaseapp.com",
  projectId: "project1-88f81",
  storageBucket: "project1-88f81.appspot.com", 
  messagingSenderId: "704911379731",
  appId: "1:704911379731:web:372a899cbf0a315d4a1ee6",
  measurementId: "G-VHHVKPT5MY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const registerButton = document.getElementById("register");
const firstNameInput = document.getElementById("firstname");
const secondNameInput = document.getElementById("secondname");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmpassword");

const firstNameError = document.getElementById("firstname-error");
const secondNameError = document.getElementById("secondname-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirmpassword-error");

// Clear error messages
function clearErrors() {
  document.querySelectorAll(".error-message").forEach(el => (el.textContent = ""));
}

// Register button click
registerButton.addEventListener("click", async (event) => {
  event.preventDefault();
  clearErrors();

  let isValid = true;
  const firstName = firstNameInput.value.trim();
  const secondName = secondNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (firstName === "") {
    firstNameError.textContent = "First name is required.";
    isValid = false;
  }
  if (secondName === "") {
    secondNameError.textContent = "Second name is required.";
    isValid = false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "") {
    emailError.textContent = "Email is required.";
    isValid = false;
  } else if (!emailRegex.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
  if (password === "") {
    passwordError.textContent = "Password is required.";
    isValid = false;
  } else if (password.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters long.";
    isValid = false;
  } else if (!specialCharRegex.test(password)) {
    passwordError.textContent = "Password must contain at least one special character.";
    isValid = false;
  }

  if (confirmPassword === "") {
    confirmPasswordError.textContent = "Please confirm your password.";
    isValid = false;
  } else if (password !== confirmPassword) {
    confirmPasswordError.textContent = "Passwords do not match.";
    isValid = false;
  }

  if (isValid) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        secondName,
        email,
      });

      alert("Registration successful! Welcome, " + firstName + "!");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        emailError.textContent = "This email is already in use.";
      } else if (error.code === "auth/invalid-email") {
        emailError.textContent = "The email address is not valid.";
      } else {
        alert("Error: " + error.message);
        console.error("Firebase error:", error);
      }
    }
  }
  if(isValid == true){
    alert("Registration Successful,go to Log-in")
  }
});