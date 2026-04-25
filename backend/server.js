import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/**
 * =========================
 * SYSTEM PROMPT
 * =========================
 */
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
- If foul language is used, respond EXACTLY:
"I cannot respond to foul language, I am a in-website assistant."

SPECIAL COMMAND:
- If user says "/shutdown", respond EXACTLY:
"All systems restarting, please stand by... Systems rebooted!"

CREATOR RULE:
- "VoidedStudiosActivation" = developer
- "VoidedStudiosActivationCreator" = creator
`;

/**
 * =========================
 * ENV CHECK
 * =========================
 */
if (!process.env.VOIDAPI_KEY) {
  console.error("❌ Missing VOIDAPI_KEY in environment variables");
}

/**
 * =========================
 * CHAT ROUTE
 * =========================
 */
app.post("/chat", async (req, res) => {
  const { message, history = [] } = req.body;

  // -------------------------
  // VALIDATION
  // -------------------------
  if (!message) {
    return res.status(400).json({
      error: "Missing 'message' in request body"
    });
  }

  if (!process.env.VOIDAPI_KEY) {
    return res.status(500).json({
      error: "Server missing VOIDAPI_KEY"
    });
  }

  try {
    // -------------------------
    // OPENROUTER REQUEST
    // -------------------------
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...(Array.isArray(history) ? history : []),
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VOIDAPI_KEY}`,
          "HTTP-Referer": "https://voidgpt",
          "X-Title": "VoidGPT"
        },
        timeout: 15000
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "Void is silent...";

    return res.json({ reply });

  } catch (err) {
    // =========================
    // TIMEOUT
    // =========================
    if (err.code === "ECONNABORTED") {
      return res.status(504).json({
        error: "Request timed out contacting VoidAPI"
      });
    }

    // =========================
    // NO RESPONSE (NETWORK)
    // =========================
    if (!err.response) {
      console.error("🌐 Network error:", err.message);

      return res.status(503).json({
        error: "Cannot reach VoidAPI",
        details: err.message
      });
    }

    const status = err.response.status;
    const data = err.response.data;

    console.error("🔥 VoidAPI ERROR");
    console.error("Status:", status);
    console.error("Data:", data);

    // -------------------------
    // SPECIFIC ERRORS
    // -------------------------
    if (status === 401) {
      return res.status(401).json({
        error: "Unauthorized: Invalid VOIDAPI_KEY"
      });
    }

    if (status === 402) {
      return res.status(402).json({
        error: "VoidAPI Failed"
      });
    }

    if (status === 404) {
      return res.status(404).json({
        error: "Model not found",
        hint: "Check model name in request"
      });
    }

    if (status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded"
      });
    }

    if (status >= 500) {
      return res.status(502).json({
        error: "VoidAPI server error",
        details: data
      });
    }

    return res.status(status).json({
      error: "Unknown OpenRouter error",
      details: data
    });
  }
});

/**
 * =========================
 * START SERVER (RENDER SAFE)
 * =========================
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`VoidGPT running on port ${PORT}`);
});
