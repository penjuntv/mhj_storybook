// pages/api/storybook.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS (Framer / 브라우저 직접 호출 대비)
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
      language = "ko",
      kidName = "",
      pov = "first", // "first" | "third"
      length = "normal", // "short" | "normal" | "long"
      place = "",
      action = "",
      ending = "",
    } = body || {};

    if (!Array.isArray(words) || words.length === 0) {
      res.status(400).json({ error: "words 배열이 비어 있습니다." });
      return;
    }

    const safeWords = words.slice(0, 8).join(", ");
    const safeMustInclude =
      Array.isArray(mustIncludeWords) && mustIncludeWords.length > 0
        ? mustIncludeWords.slice(0, 8).join(", ")
        : "";

    let lengthInstruction = "";
    let maxTokens = 600;

    if (length === "short") {
      lengthInstruction =
        "Make the story quite short, about 3–4 short lines in total.";
      maxTokens = 350;
    } else if (length === "long") {
      lengthInstruction =
        "Make the story a bit longer, about 8–12 short lines in total, but still easy.";
      maxTokens = 800;
    } else {
      // normal
      lengthInstruction =
        "Make the story medium length, about 5–7 short lines in total.";
      maxTokens = 600;
    }

    const childName = (kidName || "").trim() || "the child";

    const povInstruction =
      pov === "third"
        ? `Write the story in simple third person, as if a grown-up is telling about ${childName}. Use "${childName}" or "the child" instead of "I".`
        : `Write the story in the child's first person voice using "I". Pretend that ${childName} is telling the story.`;

    const placeLine = place ? `- Place: ${place}\n` : "";
    const actionLine = action ? `- What happens: ${action}\n` : "";
    const endingLine = ending ? `- How it ends: ${ending}\n` : "";

    const mustIncludeLine = safeMustInclude
      ? `Use these starred words and make sure they appear in the story: ${safeMustInclude}.\n`
      : "";

    // 이야기 언어는 계속 "아주 쉬운 영어" 기준 (UI 언어와는 무관)
    const userPrompt = `
Today's English words: ${safeWords}

Story idea:
${placeLine}${actionLine}${endingLine}

${mustIncludeLine}
Write a very simple, warm children's story for a 3–7 year old ESL learner.

Requirements:
- Use as many of the given words as is natural.
- Use very simple English (A1–A2 level).
- 1–3 short sentences per line.
- ${lengthInstruction}
- ${povInstruction}
- Avoid anything scary, violent, or inappropriate.
    `.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert children's storyteller. You write warm, safe stories in very simple English for 3–7 year old ESL learners.",
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
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
