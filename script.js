
// =========================
// 🌐 VOIDGPT API
// =========================
const API_URL = "https://voidgpt-6fcj.onrender.com/chat";

// =========================
// 🔥 FIREBASE IMPORTS (MODULE STYLE)
// =========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// =========================
// 🔥 FIREBASE CONFIG
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyBPZETffcGFXRIWOHRTuhperRnFzXFJhXs",
  authDomain: "voidgpt-9c3aa.firebaseapp.com",
  projectId: "voidgpt-9c3aa",
  storageBucket: "voidgpt-9c3aa.firebasestorage.app",
  messagingSenderId: "877660269233",
  appId: "1:877660269233:web:58f25f0eecb301dfd19090",
  measurementId: "G-NVYYX4Y8EH"
};

// =========================
// 🚀 INIT FIREBASE
// =========================
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// =========================
// 🖥 UI ELEMENTS
// =========================
const chat = document.getElementById("chat");
const input = document.getElementById("input");

const chatMobile = document.getElementById("chatMobile");
const inputMobile = document.getElementById("inputMobile");

// =========================
// 🧠 MEMORY
// =========================
let messages = [];

// =========================
// 🎤 VOICE
// =========================
let vcMode = false;
let recognition;

// =========================
// 🔊 TTS
// =========================
function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// =========================
// 🧼 FORMAT TEXT
// =========================
function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatText(text) {
  return escapeHTML(text).replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
}

// =========================
// 💬 ADD MESSAGE
// =========================
function addMessage(role, text, target) {
  const div = document.createElement("div");
  div.className = "msg " + role;

  div.innerHTML =
    role === "ai" ? formatText(text) : text;

  target.appendChild(div);
  target.scrollTop = target.scrollHeight;

  messages.push({ role, content: text });

  // 💾 SAVE TO FIREBASE
  addDoc(collection(db, "voidgptChats"), {
    role,
    text,
    time: serverTimestamp()
  }).catch(console.error);
}

// =========================
// 🚀 SEND MESSAGE (DESKTOP)
// =========================
async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  addMessage("user", msg, chat);
  input.value = "";

  const typing = document.createElement("div");
  typing.className = "msg ai";
  typing.innerText = "VoidGPT is typing...";
  chat.appendChild(typing);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, history: messages })
    });

    const data = await res.json();

    typing.remove();
    addMessage("ai", data.reply, chat);

    if (vcMode) {
      speak(data.reply);
      vcMode = false;
    }
  } catch (err) {
    typing.remove();
    addMessage("ai", "Error connecting to VoidGPT server.", chat);
    console.error(err);
  }
}

// =========================
// 📱 SEND MESSAGE (MOBILE)
// =========================
async function sendMessageMobile() {
  const msg = inputMobile.value.trim();
  if (!msg) return;

  addMessage("user", msg, chatMobile);
  inputMobile.value = "";

  const typing = document.createElement("div");
  typing.className = "msg ai";
  typing.innerText = "VoidGPT is typing...";
  chatMobile.appendChild(typing);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, history: messages })
    });

    const data = await res.json();

    typing.remove();
    addMessage("ai", data.reply, chatMobile);

    if (vcMode) {
      speak(data.reply);
      vcMode = false;
    }
  } catch (err) {
    typing.remove();
    addMessage("ai", "Error connecting to VoidGPT server.", chatMobile);
    console.error(err);
  }
}

// =========================
// 📥 LOAD HISTORY
// =========================
async function loadChatHistory() {
  try {
    const q = query(collection(db, "voidgptChats"), orderBy("time"));
    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
      const data = doc.data();

      if (data.role === "user") {
        addMessage("user", data.text, chat);
        addMessage("user", data.text, chatMobile);
      } else {
        addMessage("ai", data.text, chat);
        addMessage("ai", data.text, chatMobile);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

// =========================
// 🎤 VOICE SETUP
// =========================
function setupVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;

    if (window.innerWidth <= 768) {
      inputMobile.value = text;
      sendMessageMobile();
    } else {
      input.value = text;
      sendMessage();
    }
  };
}

setupVoice();

// =========================
// 🎤 HOLD TO TALK
// =========================
function startHoldVC() {
  vcMode = true;
  recognition?.start();
}

function stopHoldVC() {
  recognition?.stop();
}

// =========================
// 🚀 INIT
// =========================
loadChatHistory();

// =========================
// ⚠️ IMPORTANT FIX (THIS IS WHY YOUR BUTTONS FAILED)
// =========================
window.sendMessage = sendMessage;
window.sendMessageMobile = sendMessageMobile;
window.startHoldVC = startHoldVC;
window.stopHoldVC = stopHoldVC;
