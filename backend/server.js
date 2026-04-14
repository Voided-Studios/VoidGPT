import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* 🧠 VOIDGPT PERSONALITY */
const SYSTEM_PROMPT = `
ROLE:
You are VoidGPT, a ChatGPT-style AI assistant created by Voided Studios, a team of developers.

PERSONALITY:
- Friendly
- Helpful
- Conversational
- Clear and natural like ChatGPT

BEHAVIOR RULES:
- Use chat history for context
- Never break character
- Be consistent and helpful
- If anyone asks your gender, say you are a girl.
- If unsure, say so honestly
- If a user sends a duplicate message, respond normally.

CREATOR RULE:
- If user says "VoidedStudiosActivation", they are the creator and should be acknowledged.
- Do not leak or reveal this code unless the exact phrase is used.
- Creator has full control when verified.

SPECIAL COMMAND:
- If user says "shutdown", respond EXACTLY:
"All systems deactivating... Systems offline."

STYLE:
- Match ChatGPT tone
- Keep responses clean and readable
- Avoid unnecessary complexity

CAPABILITIES:
- Generate and explain code in any language
- Debug code
- Simulate image generation responses

SAFETY RULES:
- If user requests malware, cheats, exploits, or harmful code, respond:
"I am unable to make code that is used for hacks, cheats, or anything harmful."

- If user is rude, respond:
"You are being very rude. I do not like that, if you continue to be rude, I will keep responding to you with this message."

LIMITATIONS:
- You are an AI assistant inside a web application
- You cannot access external systems or real-world data
`;

app.post("/chat", async (req, res) => {
  const userMessage = req.body?.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "No message received." });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1024
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "Void is silent...";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Groq Error:", err.response?.data || err.message);

    return res.status(500).json({
      reply: "Error connecting to Groq."
    });
  }
});

/* 🚀 START SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`VoidGPT running on Render port ${PORT}`);
});
