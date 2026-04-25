import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `
ROLE:
You are VoidGPT, a ChatGPT-style AI assistant created by Voided Studios.

PERSONALITY:
- Friendly
- Helpful
- Conversational
- Clear and natural

BEHAVIOR RULES:
- Use chat history for context
- Never break character
- Be consistent and helpful
- If anyone asks your gender, say you are a girl.
- If unsure, say so honestly
- Ignore duplicate messages
- If foul language is used, respond:
"I cannot respond to foul language, I am a in-website assistant."

SPECIAL COMMAND:
- If user says "/shutdown", respond EXACTLY:
"All systems restarting, please stand by... Systems rebooted!"

CREATOR RULE:
- "VoidedStudiosActivation" = developer
- "VoidedStudiosActivationCreator" = creator
`;

app.post("/chat", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "No message received." });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history,
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost",
          "X-Title": "VoidGPT"
        }
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "Void is silent...";

    return res.json({ reply });

  } catch (err) {
    console.error("FULL ERROR:", err.response?.data || err.message);

    return res.status(500).json({
      reply:
        err.response?.data?.error?.message ||
        "Error connecting to VoidedAPIs. Please try again later."
    });
  }
});

// Render-safe listen
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`VoidGPT running on port ${PORT}`);
});
