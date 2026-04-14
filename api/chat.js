export default function handler(req, res) {
  // Only allow POST (optional safety)
  if (req.method !== "POST") {
    return res.status(200).json({
      reply: "VoidGPT backend is alive ✅ (GET request received)"
    });
  }

  const userMessage = req.body?.message;

  if (!userMessage) {
    return res.status(200).json({
      reply: "VoidGPT backend is alive ✅ (no message received)"
    });
  }

  // SIMPLE TEST RESPONSE (NO GROQ YET)
  return res.status(200).json({
    reply: `VoidGPT is alive and heard: "${userMessage}"`
  });
}
