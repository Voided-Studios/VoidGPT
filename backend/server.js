import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body?.message;

  if (!userMessage) {
    return res.json({ reply: "No message received." });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are VoidGPT, a helpful AI created by Voided Studios."
          },
          { role: "user", content: userMessage }
        ]
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

    res.json({ reply });

  } catch (err) {
    console.error(err.message);
    res.json({ reply: "Error connecting to Groq." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`VoidGPT running on port ${PORT}`);
});
