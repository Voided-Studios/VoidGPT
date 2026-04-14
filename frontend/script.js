const chat = document.getElementById("chat");
const input = document.getElementById("input");

/* 🌐 YOUR RENDER BACKEND */
const API_URL = "https://voidgpt-6fcj.onrender.com/chat";

/* 💬 Add message to chat */
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* ⏳ Typing indicator */
function showTyping() {
  const div = document.createElement("div");
  div.className = "msg ai";
  div.id = "typing";
  div.innerText = "VoidGPT is thinking...";
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById("typing");
  if (t) t.remove();
}

/* 🚀 Send message to backend */
async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  // show user message
  addMessage("You: " + msg, "user");
  input.value = "";

  // show loading
  showTyping();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();

    hideTyping();

    addMessage("VoidGPT: " + (data.reply || "Void is silent..."), "ai");

  } catch (err) {
    hideTyping();
    addMessage("VoidGPT: Error connecting to void.", "ai");
  }
}

/* ⌨️ Press Enter to send */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
