// pages/api/storybook.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS
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

    // 새 구조: words, mustIncludeWords, kid, place, action, ending, language
    const {
      words,
      mustIncludeWords = [],
      kid = {},
      place,
      action,
      ending,
      language,
      idea, // 옛날 구조와의 호환: { character, place, event, ending }
    } = body || {};

    const wordsArray = Array.isArray(words)
      ? words
      : Array.isArray(idea?.words)
      ? idea.words
      : [];

    if (!Array.isArray(wordsArray) || wordsArray.length === 0) {
      res.status(400).json({ error: "words 배열이 비어 있습니다." });
      return;
    }

    const safeWords = wordsArray.slice(0, 8).join(", ");

    // 아이 정보
    const kidName = kid.name && String(kid.name).trim();
    const kidAge = kid.age && String(kid.age).trim();
    const pov = kid.pov === "I" || kid.pov === "first" ? "I" : "third";

    const characterDescription = kidName
      ? `${kidName}${kidAge ? `, a ${kidAge}-year-old child` : ""}`
      : "a child";

    // 장소/이벤트/엔딩 (새 구조 > 옛 구조 순으로 fallback)
    const resolvedPlace = place || idea?.place || "a special place";
    const resolvedEvent =
      action || idea?.event || "has a small, gentle adventure";
    const resolvedEnding =
      ending || idea?.ending || "everything ends in a warm, happy way";

    const targetLanguage = language || "en";

    const povInstruction =
      pov === "I"
        ? `Tell the story in the first person, using "I" as the main character.`
        : `Tell the story about the child in third person, using "he/she/they".`;

    const userPrompt = `
Today's English words: ${safeWords}
Words that must appear in the story if possible: ${
      mustIncludeWords.length ? mustIncludeWords.join(", ") : "(none explicitly)"
    }

Child:
- Main character: ${characterDescription}
- Story language code (from client): ${targetLanguage}

Story idea:
- Place: ${resolvedPlace}
- What happens: ${resolvedEvent}
- How it ends: ${resolvedEnding}

Requirements:
- ${povInstruction}
- Very simple English (A1~A2 level) for 3–7 year old ESL learners.
- Use as many of the words as natural, especially the "must include" words.
- 1–3 short sentences per line.
- Short overall length, like a one-page picture book.
- Do NOT add translations unless it is extremely short and natural.
    `.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert children's storyteller. Write warm, safe stories in very simple English for 3–7 year old ESL learners. Use very short, clear sentences and gentle situations only.",
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
