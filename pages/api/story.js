// pages/api/story.js
import OpenAI from "openai";

// OpenAI 클라이언트 생성 (서버에서만 사용)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // 1) GET: 상태 확인용 (브라우저에서 직접 쳐볼 수 있는 헬스 체크)
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "story API is alive",
      method: "GET",
    });
  }

  // 2) POST 이외의 메서드는 405로 막기
  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed (use POST)` });
  }

  // 3) 환경변수 체크
  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: "OPENAI_API_KEY is not set on the server." });
  }

  // 4) 요청 바디 파싱
  const { words = [], mustUse = [], answers = {}, length = "normal" } =
    req.body || {};

  if (!Array.isArray(words) || words.length === 0) {
    return res
      .status(400)
      .json({ error: "words must be a non-empty array." });
  }

  const safeMustUse = Array.isArray(mustUse) ? mustUse : [];
  const { mainCharacter = "", place = "", problem = "", ending = "" } =
    answers || {};

  // 5) 프롬프트 구성
  const lengthText =
    length === "short"
      ? "about 5 short sentences"
      : length === "long"
      ? "about 12–15 short sentences"
      : "about 8–10 short sentences";

  const wordsText = words.join(", ");
  const mustText =
    safeMustUse.length > 0 ? safeMustUse.join(", ") : "no specific word";

  const ideaSummary = [
    mainCharacter && `Main character: ${mainCharacter}`,
    place && `Place: ${place}`,
    problem && `Event/problem: ${problem}`,
    ending && `Ending: ${ending}`,
  ]
    .filter(Boolean)
    .join("\n");

  const userPrompt = `
You are a friendly English teacher writing super-simple English stories for young Korean children.

Use these English words in the story: ${wordsText}
Make sure you include these must-use words: ${mustText}

Story idea (from parent/child):
${ideaSummary || "(no extra details provided)"}

Write the story in very easy English, ${lengthText}.
Use short sentences that a young learner can read.
Do NOT add any Korean translation. Only the English story.
  `.trim();

  try {
    // 6) OpenAI 호출
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You write very simple English stories for children who are just starting to read.",
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
    });

    const story =
      completion.choices?.[0]?.message?.content?.trim() ||
      "No story generated.";

    return res.status(200).json({ story });
  } catch (err) {
    console.error("story API error:", err);
    return res
      .status(500)
      .json({ error: "Failed to generate story from OpenAI." });
  }
}
