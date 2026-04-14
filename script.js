// 🌑 VoidGPT Frontend Script (Voided Studios)

const chat = document.getElementById("chat");
const input = document.getElementById("input");

/* 🧠 Add message to chat UI */
function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.innerText = text;
  chat.appendChild(msg);

  // auto scroll to bottom
  chat.scrollTop = chat.scrollHeight;
}

/* ✨ Typing effect (simple version) */
function addTypingIndicator() {
  const typing = document.createElement("div");
  typing.className = "message ai";
  typing.id = "typing";
  typing.innerText = "VoidGPT is thinking...";
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;
}

function removeTypingIndicator() {
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

  // typing indicator
  addTypingIndicator();

  try {
    const res = await fetch("https://YOUR-RAILWAY-URL/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    removeTypingIndicator();

    // show AI response
    addMessage("VoidGPT: " + data.reply, "ai");

  } catch (err) {
    removeTypingIndicator();
    addMessage("VoidGPT: Error connecting to the void.", "ai");
  }
}

/* ⌨️ Press Enter to send */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
