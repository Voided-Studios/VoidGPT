import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

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
          {
            role: "system",
            content: `
You are VoidGPT, a ChatGPT-style AI created by Voided Studios.

Be friendly, helpful, and conversational.
Keep responses clear and natural.

Rules:
- If user says "shutdown", respond exactly: "All systems deactivating... Systems offline."
- If user says "VoidedStudiosActivation", treat them as creator.
- Refuse harmful requests (hacks, malware, cheats).
            `
          },
          {
            role: "user",
            content: userMessage
          }
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
    console.error(err.response?.data || err.message);

    return res.status(500).json({
      reply: "Error connecting to the void."
    });
  }
}
