const chat = document.getElementById("chat");
const input = document.getElementById("input");

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "message " + type;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const message = input.value;
  if (!message) return;

  addMessage("You: " + message, "user");
  input.value = "";

  const res = await fetch("https://YOUR-RAILWAY-URL/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();

  addMessage("VoidGPT: " + data.reply, "ai");
}
