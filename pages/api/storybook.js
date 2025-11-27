// pages/api/storybook.js
import OpenAI from "openai";

// 서버에서만 쓰는 OpenAI 클라이언트
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS (프레이머 / 브라우저에서 직접 호출해도 안전하게)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { words, idea } = body || {};

    if (!Array.isArray(words) || words.length === 0) {
      res.status(400).json({ error: "words 배열이 비어 있습니다." });
      return;
    }

    const safeWords = words.slice(0, 8).join(", ");

    const character = idea?.character || "a child";
    const place = idea?.place || "a special place";
    const event = idea?.event || "has a small adventure";
    const ending = idea?.ending || "everything ends in a warm, happy way";

    const userPrompt = `
Today's English words: ${safeWords}

Make a very simple children's story for 3–7 year old ESL learners.

Story idea:
- Main character: ${character}
- Place: ${place}
- What happens: ${event}
- How it ends: ${ending}

Requirements:
- Use as many of the words as natural.
- Very simple English (A1~A2 level).
- 1–3 short sentences per line.
- Short overall length, like a one-page picture book.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert children's storyteller. Write warm, safe stories in very simple English for 3–7 year old ESL learners. Use short, clear sentences. Avoid difficult grammar.",
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const story =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I could not create a story.";

    res.status(200).json({ story });
  } catch (err) {
    console.error("Story API error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
