// pages/api/generateStory.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    // Vercel 환경변수 설정이 잘못된 경우
    return res.status(500).json({ error: "OPENAI_API_KEY is missing" });
  }

  try {
    const { words, length, language, childName } = req.body || {};

    if (!Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: "words array is required" });
    }

    const safeChildName = (childName || "yujin").trim();
    const safeLanguage = language === "ko" ? "Korean" : "English";

    let lengthHint = "about 10–12 sentences";
    if (length === "short") lengthHint = "about 5–7 short sentences";
    if (length === "long") lengthHint = "about 15–20 sentences";

    const wordList = words.join(", ");

    const systemPrompt = `
You are a kind children's storyteller who writes very simple, clear stories 
for young ESL learners. Always keep grammar and vocabulary easy.
    `.trim();

    const userPrompt = `
Write a ${lengthHint} story in ${safeLanguage} that a child named "${safeChildName}" would enjoy.
You MUST use all of the following words naturally in the story: ${wordList}.

Rules:
- Write as a continuous story, not a list.
- Keep sentences short and clear.
- Do not add translations.
- Do not mention that you are an AI.
    `.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 800,
      temperature: 0.8,
    });

    const story =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I could not create a story this time.";

    return res.status(200).json({ story });
  } catch (err) {
    console.error("generateStory error:", err);
    return res
      .status(500)
      .json({ error: "Failed to generate story from OpenAI." });
  }
}
