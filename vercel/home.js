

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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
const db = getDatabase(app);
const auth = getAuth(app);

const chatCard = document.getElementById("chatCard");
const openBtn = document.getElementById("openChat");
const closeBtn = document.getElementById("closeChat");
const input = document.getElementById("message");
const submitBtn = document.getElementById("submit");
const chatMessages = document.querySelector(".chat-messages");
const logoutBtn = document.getElementById("logout"); 

let currentUserEmail = null;
let currentUserName = null;

function extractFirstName(email) {
  let part = email.split("@")[0];
  part = part.replace(/[0-9]/g, ""); 
  let firstName = part.split(/[._]/)[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1);
}

function saveUserProfile(email) {
  const safeKey = email.replace(/\./g, "_");
  set(ref(db, "users/" + safeKey), {
    email,
    firstName: currentUserName
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserEmail = user.email;
    currentUserName = extractFirstName(currentUserEmail);

    saveUserProfile(currentUserEmail);
    listenForMessages();

    logoutBtn.style.display = "inline-block";
  } else {
    currentUserEmail = null;
    currentUserName = null;

    logoutBtn.style.display = "none";
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("✅ Logged out successfully!");
      window.location.href = "login.html"; 
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
});

openBtn.addEventListener("click", () => {
  chatCard.style.display = "flex";
});
closeBtn.addEventListener("click", () => {
  chatCard.style.display = "none";
});

function sendMessage() {
  if (!currentUserEmail) return;

  const msg = input.value.trim();
  if (msg !== "") {
    push(ref(db, "messages"), {
      sender: "user",
      text: msg,
      email: currentUserEmail,
      firstName: currentUserName, 
      timestamp: Date.now()
    });
    input.value = "";
  }
}
submitBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function listenForMessages() {
  onChildAdded(ref(db, "messages"), (snapshot) => {
    const data = snapshot.val();

    if (data.email !== currentUserEmail) return;

    const messageElement = document.createElement("div");
    messageElement.textContent = data.text;
    messageElement.style.padding = "8px 12px";
    messageElement.style.margin = "5px 0";
    messageElement.style.borderRadius = "10px";
    messageElement.style.maxWidth = "75%";
    messageElement.style.display = "inline-block";
    messageElement.style.wordWrap = "break-word";
    messageElement.style.overflowWrap = "break-word";

    const wrapper = document.createElement("div");

    if (data.sender === "admin") {
      messageElement.style.background = "#222";
      messageElement.style.color = "lightgreen";
      wrapper.style.textAlign = "left";
    } else {
      messageElement.style.background = "#444";
      messageElement.style.color = "white";
      wrapper.style.textAlign = "right";
    }

    wrapper.appendChild(messageElement);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}
