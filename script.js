const API_URL = "https://voidgpt-6fcj.onrender.com/chat";

/* 🖥 DESKTOP */
const chat = document.getElementById("chat");
const input = document.getElementById("input");

/* 📱 MOBILE */
const chatMobile = document.getElementById("chatMobile");
const inputMobile = document.getElementById("inputMobile");

let messages = [];

/* 🔊 SPEAK */
function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

/* 💬 ADD MESSAGE */
function addMessage(role, text, target) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerText = text;
  target.appendChild(div);
  target.scrollTop = target.scrollHeight;

  messages.push({ role, content: text });
}

/* 🚀 DESKTOP SEND */
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
  speak(data.reply);
}

/* 🚀 MOBILE SEND */
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
  speak(data.reply);
}

/* 🎤 VOICE INPUT */
function startVC() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) return alert("Voice not supported");

  const rec = new SpeechRecognition();
  rec.lang = "en-US";

  rec.start();

  rec.onresult = (e) => {
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
