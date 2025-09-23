
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5w3k9ktMVYvwsUf9BqOL2c5UxwIxqWd0",
  authDomain: "project1-88f81.firebaseapp.com",
  databaseURL: "https://project1-88f81-default-rtdb.firebaseio.com",
  projectId: "project1-88f81",
  storageBucket: "project1-88f81.firebasestorage.app",
  messagingSenderId: "704911379731",
  appId: "1:704911379731:web:372a899cbf0a315d4a1ee6",
  measurementId: "G-VHHVKPT5MY"
};

const app = initializeApp(firebaseConfig);
getDatabase(app); 
const auth = getAuth(app);

const adminLink = document.getElementById("chatLink");

const ALLOWED_EMAIL = "iammusa181@gmail.com";

onAuthStateChanged(auth, (user) => {
  if (!user) {
   
    adminLink.classList.add("hidden");
    return;
  }

  const email = (user.email || "").toLowerCase();
  if (email === ALLOWED_EMAIL.toLowerCase()) {
   
    adminLink.classList.remove("hidden");
  } else {
    
    adminLink.classList.add("hidden");
  }
});
