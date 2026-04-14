// 🌑 VoidGPT Frontend (Voided Studios)

const chat = document.getElementById("chat");
const input = document.getElementById("input");

/* 🧠 CONFIG — PUT YOUR RAILWAY URL HERE */
const API_URL = "https://YOUR-RAILWAY-URL/chat";

/* 💬 Add message to chat */
function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.innerText = text;

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

/* ⏳ Typing indicator */
function showTyping() {
  const typing = document.createElement("div");
  typing.className = "message ai";
  typing.id = "typing";
  typing.innerText = "VoidGPT is thinking...";
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

/* 🚀 Send message to backend */
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  // show user message
  addMessage("You: " + message, "user");
  input.value = "";

  // show loading
  showTyping();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    // if server error
    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    hideTyping();

    addMessage("VoidGPT: " + (data.reply || "Void is silent..."), "ai");

  } catch (err) {
    hideTyping();

    console.error(err);
    addMessage("VoidGPT: Error connecting to the void.", "ai");
  }
}

/* ⌨️ Press Enter to send */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
