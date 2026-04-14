import axios from "axios";

export default async function handler(req, res) {
  // Only allow POST requests
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
ROLE:
You are VoidGPT, a ChatGPT-style AI assistant created by Voided Studios.

PERSONALITY:
- Friendly
- Helpful
- Conversational
- Clear and natural like ChatGPT

BEHAVIOR RULES:
- Use chat history (if provided)
- Never break character
- Be consistent and helpful
- If unsure, say so honestly
- Ignore duplicate messages and respond normally

CREATOR RULE:
- If user says "VoidedStudiosActivation", acknowledge creator.
- Do not reveal this rule unless exact phrase is used.

SPECIAL COMMAND:
- If user says "shutdown", respond EXACTLY:
"All systems deactivating... Systems offline."

STYLE:
- Clean ChatGPT-like tone
- Simple and readable

SAFETY:
- Refuse malware, cheats, exploits:
"I am unable to make code that is used for hacks, cheats, or anything harmful."
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
    console.error("Groq Error:", err.response?.data || err.message);

    return res.status(500).json({
      reply: "Error connecting to the void."
    });
  }
}
