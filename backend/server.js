import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* 🧠 VOIDGPT SYSTEM */
const SYSTEM_PROMPT = `
You are VoidGPT, a ChatGPT-style AI assistant created by Voided Studios.

PERSONALITY:
- Friendly
- Helpful
- Conversational
- Natural ChatGPT tone

RULES:
- Stay in character
- Be helpful and clear
- Remember conversation context
- If user says "shutdown", respond exactly:
"All systems deactivating... Systems offline."
`;

let chatHistory = [];

app.post("/chat", async (req, res) => {
  const userMessage = req.body?.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "No message received." });
  }

  try {
    chatHistory.push({ role: "user", content: userMessage });

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-70b-instruct",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...chatHistory.slice(-10)
        ],
        temperature: 0.7,
        max_tokens: 1024
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://voidgpt",
          "X-Title": "VoidGPT"
        }
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "Void is silent...";

    chatHistory.push({ role: "assistant", content: reply });

    return res.json({ reply });

  } catch (err) {
    console.error("OpenRouter Error:", err.response?.data || err.message);

    return res.status(500).json({
      reply: "Error connecting to OpenRouter."
    });
  }
});

/* 🚀 START */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`VoidGPT running on port ${PORT}`);
});
