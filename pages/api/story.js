// pages/api/story.js

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // 1) 메서드 체크
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Only POST is allowed" });
  }

  // 2) 환경변수 체크 (API 키 제대로 들어갔는지 확인용)
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is missing on the server. Check Vercel env settings.",
    });
  }

  try {
    const { wordsText, mainCharacter, place, problem, ending, length } =
      req.body || {};

    // 3) 오늘 배운 단어 파싱
    const words = (wordsText || "")
      .split(/[,\n]/)
      .map((w) => w.trim())
      .filter(Boolean);

    const mustUseWords = words; // 지금은 전부 MUST-use 로 처리

    // 4) 시스템 프롬프트 (스토리 스타일)
    const systemPrompt = `
You are an expert children's storyteller.
Write SHORT, CLEAR stories in very simple English (A1~A2 level, 6–9 year old ESL learners).
Use very short sentences (mostly 5–10 words).
Avoid difficult grammar (no passive voice, no complex clauses).
The story should be warm, kind, and emotionally safe.
The child is learning English as an immigrant in a new country.
Always include all MUST-USE words naturally in the story.
    `.trim();

    // 5) 사용자 프롬프트
    const storyLength =
      length === "longer"
        ? "about 10 sentences"
        : length === "shorter"
        ? "about 4–5 sentences"
        : "about 6–8 sentences";

    const userPrompt = `
Today's English words: ${words.join(", ") || "(none)"}.

MUST-USE words: ${mustUseWords.join(", ") || "(none)"}.

Story idea (from child + parent):
1) Main character: ${mainCharacter || "(not given)"}
2) Place: ${place || "(not given)"}
3) What happens (problem or event): ${problem || "(not given)"}
4) How should the story end: ${ending || "(not given)"}

Write one children's story in very simple English.
Use ${storyLength}.
Write in 1 continuous paragraph (no bullet points).
    `.trim();

    // 6) OpenAI 호출
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const story = response.choices?.[0]?.message?.content?.trim();

    if (!story) {
      return res
        .status(500)
        .json({ error: "No story returned from OpenAI API" });
    }

    // 7) 클라이언트로 응답
    return res.status(200).json({
      story,
      words,
      mustUseWords,
    });
  } catch (err) {
    console.error("Story API error:", err);
    return res.status(500).json({
      error: "Story API failed",
      detail: err?.message || String(err),
    });
  }
}
