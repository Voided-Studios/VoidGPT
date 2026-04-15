const chat = document.getElementById("chat");
const input = document.getElementById("input");
const chatList = document.getElementById("chatList");

const API_URL = "https://voidgpt-6fcj.onrender.com/chat";

let chats = JSON.parse(localStorage.getItem("void_chats")) || [];
let currentChat = null;

/* 💬 SAVE SYSTEM */
function save() {
  localStorage.setItem("void_chats", JSON.stringify(chats));
}

/* ➕ NEW CHAT */
function newChat() {
  const id = Date.now();

  const chatObj = {
    id,
    title: "New Chat",
    messages: []
  };

  chats.push(chatObj);
  currentChat = chatObj;
  save();
  renderChats();
  renderMessages();
}

/* 📜 LOAD CHAT LIST */
function renderChats() {
  chatList.innerHTML = "";

  chats.forEach(c => {
    const div = document.createElement("div");
    div.className = "chatItem";
    div.innerText = c.title;

    div.onclick = () => {
      currentChat = c;
      renderMessages();
    };

    chatList.appendChild(div);
  });
}

/* 💬 LOAD MESSAGES */
function renderMessages() {
  chat.innerHTML = "";

  if (!currentChat) return;

  currentChat.messages.forEach(m => {
    const div = document.createElement("div");
    div.className = "msg " + m.role;
    div.innerText = m.content;
    chat.appendChild(div);
  });
}

/* 💬 ADD MESSAGE */
function addMessage(role, content) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerText = content;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  currentChat.messages.push({ role, content });

  if (currentChat.messages.length === 1) {
    currentChat.title = content.slice(0, 20);
  }

  save();
}

/* 🚀 SEND MESSAGE */
async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  if (!currentChat) newChat();

  addMessage("user", msg);
  input.value = "";

  const typing = document.createElement("div");
  typing.className = "msg ai";
  typing.innerText = "VoidGPT is typing...";
  chat.appendChild(typing);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msg,
        history: currentChat.messages
      })
    });

    const data = await res.json();

    typing.remove();
    addMessage("ai", data.reply);

  } catch (err) {
    typing.remove();
    addMessage("ai", "Error connecting to server.");
  }
}

/* 🎤 VOICE MODE */
function startVC() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported.");
    return;
  }

  const rec = new SpeechRecognition();
  rec.lang = "en-US";

  rec.start();

  rec.onresult = (e) => {
    input.value = e.results[0][0].transcript;
    sendMessage();
  };
}

/* INIT */
newChat();
renderChats();
