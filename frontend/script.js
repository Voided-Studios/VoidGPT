const chat = document.getElementById("chat");
const input = document.getElementById("input");

const API_URL = "https://voidgpt-6fcj.onrender.com/chat";

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  addMessage("You: " + msg, "user");
  input.value = "";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();
    addMessage("VoidGPT: " + data.reply, "ai");

  } catch (err) {
    addMessage("VoidGPT: Error connecting to void.", "ai");
  }
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
