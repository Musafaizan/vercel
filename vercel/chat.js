

import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";


import { 
  getDatabase, ref, push, onChildAdded, onValue, query, orderByChild, equalTo 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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

const leftDiv = document.querySelector(".left");   
const rightDiv = document.querySelector(".right"); 
const inputField = document.querySelector("#adminMessage");
const sendBtn = document.querySelector("#adminSend");

let currentUserEmail = null;
let currentUserName = null;

const messagesRef = ref(db, "messages");
const usersRef = ref(db, "users"); 

onValue(usersRef, (snapshot) => {
  leftDiv.innerHTML = "";
  snapshot.forEach((child) => {
    const user = child.val();
    if (!user.email || !user.firstName) return;

    const userDiv = document.createElement("div");
    userDiv.classList.add("user");
    userDiv.textContent = user.firstName; 

    userDiv.addEventListener("click", () => {
      currentUserEmail = user.email;
      currentUserName = user.firstName;
      loadMessagesForUser(user.email);
    });

    leftDiv.appendChild(userDiv);
  });
});

function loadMessagesForUser(email) {
  rightDiv.innerHTML = "";

  const q = query(messagesRef, orderByChild("email"), equalTo(email));

  rightDiv.innerHTML = "";
  
  onChildAdded(q, (snapshot) => {
    const msg = snapshot.val();
    const msgDiv = document.createElement("div");
    msgDiv.textContent = msg.text;

    msgDiv.style.padding = "8px 12px";
    msgDiv.style.margin = "5px 0";
    msgDiv.style.borderRadius = "10px";
    msgDiv.style.maxWidth = "75%";
    msgDiv.style.display = "inline-block";
    msgDiv.style.wordWrap = "break-word";
    msgDiv.style.overflowWrap = "break-word";
    msgDiv.style.whiteSpace = "pre-wrap";

    const wrapper = document.createElement("div");

    if (msg.sender === "user") {
      msgDiv.style.background = "#444";
      msgDiv.style.color = "orange";
      wrapper.style.textAlign = "left";
    } else {
      msgDiv.style.background = "#222";
      msgDiv.style.color = "lightgreen";
      wrapper.style.textAlign = "right";
    }

    wrapper.appendChild(msgDiv);
    rightDiv.appendChild(wrapper);

   
    rightDiv.scrollTop = rightDiv.scrollHeight;
  });
}

sendBtn.addEventListener("click", () => {
  if (!currentUserEmail) {
    alert("⚠️ Please select a user first!");
    return;
  }

  const text = inputField.value.trim();
  if (!text) return;

  push(messagesRef, {
    sender: "admin",
    email: currentUserEmail,
    firstName: currentUserName,
    text,
    timestamp: Date.now()
  });

  inputField.value = "";
});

inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
