const API_URL = "https://voidgpt-6fcj.onrender.com/chat";

/* 🖥 / 📱 UI ELEMENTS */
const chat = document.getElementById("chat");
const input = document.getElementById("input");

const chatMobile = document.getElementById("chatMobile");
const inputMobile = document.getElementById("inputMobile");

/* 🧠 MEMORY */
let messages = [];

/* 🎤 VC STATE */
let vcMode = false;
let recognition;

/* 🔊 TTS */
function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

/* 💬 MESSAGE */
function addMessage(role, text, target) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerText = text;
  target.appendChild(div);
  target.scrollTop = target.scrollHeight;

  messages.push({ role, content: text });
}

/* 🚀 SEND (DESKTOP) */
async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  addMessage("user", msg, chat);
  input.value = "";

  const typing = document.createElement("div");
  typing.className = "msg ai";
  typing.innerText = "VoidGPT is typing...";
  chat.appendChild(typing);

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
}

/* 🚀 SEND (MOBILE) */
async function sendMessageMobile() {
  const msg = inputMobile.value.trim();
  if (!msg) return;

  addMessage("user", msg, chatMobile);
  inputMobile.value = "";

  const typing = document.createElement("div");
  typing.className = "msg ai";
  typing.innerText = "VoidGPT is typing...";
  chatMobile.appendChild(typing);

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
}

/* 🎤 SETUP VOICE */
function setupVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) return alert("Voice not supported");

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

/* 🎤 HOLD TO TALK (THIS IS THE KEY) */
function startHoldVC() {
  vcMode = true;
  recognition.start();
}

/* 🛑 STOP TALK */
function stopHoldVC() {
  recognition.stop();
}
