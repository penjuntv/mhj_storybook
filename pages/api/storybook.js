// pages/api/storybook.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS (프레이머/브라우저에서 직접 호출해도 안전하게)
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

    const {
      words,
      mustIncludeWords = [],
      place,
      action,
      ending,
      language,
      profile,
    } = body || {};

    if (!Array.isArray(words) || words.length === 0) {
      res.status(400).json({ error: "words 배열이 비어 있습니다." });
      return;
    }

    const safeWords = words.slice(0, 8).join(", ");
    const mustList =
      Array.isArray(mustIncludeWords) && mustIncludeWords.length > 0
        ? mustIncludeWords.slice(0, 8).join(", ")
        : "none";

    const kidName = (profile?.kidName || "the child").trim();
    const kidAge = (profile?.kidAge || "").toString().trim();
    const pov = profile?.pov === "third" ? "third" : "first";

    const ageLine = kidAge ? `The child is about ${kidAge} years old.` : "";
    const placeLine = place ? `Place: ${place}` : "Place: a simple friendly place";
    const actionLine = action
      ? `What happens: ${action}`
      : "What happens: the child has a small adventure.";
    const endingLine = ending
      ? `How it ends: ${ending}`
      : "How it ends: everything is warm and happy.";

    const povInstruction =
      pov === "first"
        ? `Write the story in FIRST PERSON, so the main character says "I". Use the child's name "${kidName}" only when natural.`
        : `Write the story in THIRD PERSON about a child named "${kidName}".`;

    const userPrompt = `
Today's English words: ${safeWords}
Words that must appear if natural: ${mustList}

${placeLine}
${actionLine}
${endingLine}
${ageLine}

${povInstruction}

Audience:
- Young ESL learner, around 3–7 years old.
- Very simple English (A1–A2).
- 1–3 short sentences per line.
- Short overall length, like a one-page picture book.

Requirements:
- Use as many of the words as natural.
- Keep grammar and vocabulary easy.
- The story must feel warm, safe, and child-friendly.
    `.trim();

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
      max_tokens: 600,
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
