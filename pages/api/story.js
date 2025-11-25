// pages/api/story.js

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // 1) 메서드 체크
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 2) 바디 파싱
  const { words, idea, length = "normal" } = req.body || {};

  // words: ["apple", "banana", "cat"] 이런 배열
  if (!Array.isArray(words) || words.length === 0) {
    return res.status(400).json({
      error: "words must be a non-empty array of strings.",
    });
  }

  if (!idea || typeof idea !== "string") {
    return res.status(400).json({
      error: "idea (child's story idea) is required.",
    });
  }

  // 3) API 키 확인
  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: "OPENAI_API_KEY is not set on the server." });
  }

  // 4) 프롬프트 구성
  const mustUseWords = words.join(", ");

  const lengthHint =
    length === "short"
      ? "Write a very short story (3–4 sentences)."
      : length === "long"
      ? "Write a slightly longer story (6–8 short sentences)."
      : "Write a short story (4–6 short sentences).";

  const systemPrompt =
    "You are an expert children's storyteller. " +
    "Write VERY SIMPLE English stories for 6–9 year-old ESL learners (A1~A2 level). " +
    "Use very short sentences (mostly 5–10 words). " +
    "Avoid difficult grammar (no passive voice, no complex clauses). " +
    "The story should be warm, kind, and emotionally safe.";

  const userPrompt = `
Child's idea:
"${idea}"

Today's English words (must be used in the story):
${mustUseWords}

Instructions:
- Use ALL of the must-use words above naturally in the story.
- Keep the language very simple and clear.
- ${lengthHint}
- Write the story as one paragraph, with sentences separated by a single space.
`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const story =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Story generation failed.";

    return res.status(200).json({
      story,
      debug: {
        words,
        idea,
        length,
      },
    });
  } catch (e) {
    console.error("Story API error:", e);
    return res.status(500).json({
      error: "Failed to generate story.",
      detail: e?.message || String(e),
    });
  }
}
