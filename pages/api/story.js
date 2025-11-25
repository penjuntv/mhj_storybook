// pages/api/story.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // 1) 단순 GET 체크용 (브라우저에서 /api/story 열어볼 때)
  if (req.method === "GET") {
    return res
      .status(200)
      .json({ ok: true, message: "Send POST to this endpoint to create a story." });
  }

  // 2) 그 외 메서드는 다 POST로 처리 (405 안 내보내도록)
  if (req.method !== "POST") {
    // 굳이 405를 보내서 헷갈리게 만들지 말고 200 + 안내만 줍니다.
    return res
      .status(200)
      .json({ ok: false, message: "Use POST with JSON body from the app." });
  }

  // 3) API 키 확인
  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: "OPENAI_API_KEY is not set on the server." });
  }

  try {
    const { words, mustUse = [], answers = {}, length = "normal" } = req.body || {};

    // 기본 유효성 체크
    if (!Array.isArray(words) || words.length === 0) {
      return res
        .status(400)
        .json({ error: "words 배열에 오늘 배운 영어 단어들을 넣어 주세요." });
    }

    const { mainCharacter = "", place = "", problem = "", ending = "" } = answers;

    if (!mainCharacter || !place || !problem) {
      return res
        .status(400)
        .json({ error: "mainCharacter, place, problem 값은 필수입니다." });
    }

    const lengthMap = {
      short: 80,
      normal: 150,
      long: 250,
    };
    const targetTokens = lengthMap[length] || lengthMap.normal;

    const wordsList = words.join(", ");
    const mustUseList =
      mustUse && mustUse.length > 0 ? mustUse.join(", ") : "없음";

    const prompt = `
You are a friendly children's story writer.

Write a very simple English story for a Korean primary school child.
Use easy vocabulary and short sentences.

Requirements:
- Use today's English words: ${wordsList}.
- MUST include these words in the story if possible: ${mustUseList}.
- Main character: ${mainCharacter}
- Place: ${place}
- Problem or event: ${problem}
- Ending: ${ending || "happy and warm ending"}
- Target length: about ${targetTokens} words.
- Output ONLY the story text in English. Do NOT add any explanations.
    `.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You write very simple English stories for young Korean children.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    });

    const story =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Story generation failed.";

    return res.status(200).json({ story });
  } catch (err) {
    console.error("API /api/story error:", err);
    return res
      .status(500)
      .json({ error: "서버에서 스토리 생성 중 오류가 발생했습니다." });
  }
}
