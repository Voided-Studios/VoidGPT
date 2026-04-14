const API_URL = "https://YOUR-RENDER-URL.onrender.com/chat";

async function sendMessage(message) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  return data.reply;
}
