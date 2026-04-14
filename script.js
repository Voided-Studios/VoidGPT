const chat = document.getElementById("chat");
const input = document.getElementById("input");

const API_URL = "/api/chat";

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
  const div = document.createElement("div");
  div.className = "message ai";
  div.id = "typing";
  div.innerText = "VoidGPT is thinking...";
  chat.appendChild(div);
}

function hideTyping() {
  const t = document.getElementById("typing");
  if (t) t.remove();
}

async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  addMessage("You: " + msg, "user");
  input.value = "";

  showTyping();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();

    hideTyping();

    addMessage("VoidGPT: " + data.reply, "ai");
  } catch (err) {
    hideTyping();
    addMessage("VoidGPT: Error connecting to the void.", "ai");
  }
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
