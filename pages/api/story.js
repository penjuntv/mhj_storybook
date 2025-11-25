// pages/api/story.js

// 이 API 라우트는 서버에서만 실행됩니다.
// OpenAI API 키는 Vercel 환경변수 OPENAI_API_KEY에서 읽습니다.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "OPENAI_API_KEY is not set on the server." });
  }

  try:
  {
  } catch (e) {}

  try {
    const { words, mustUse, idea, lengthType } = req.body || {};

    const safeWords = Array.isArray(words) ? words : [];
    const safeMustUse = Array.isArray(mustUse) ? mustUse : [];
    const { hero = "", place = "", problem = "", ending = "" } = idea || {};

    const lengthInstruction =
      lengthType === "long"
        ? "Write a little longer story, about 6–8 short sentences."
        : "Write a short story, about 3–5 very short sentences.";

    const systemPrompt =
      "You are an expert children's storyteller. " +
      "Write SHORT, CLEAR stories in very simple English (A1~A2 level, 6–9 year old ESL learners). " +
      "Use very short sentences (mostly 5–10 words). " +
      "Avoid difficult grammar (no passive voice, no complex clauses). " +
      "The story should be warm, kind, and emotionally safe.";

    const userPrompt = `
Child's English level: beginner ESL (Year 1–3).

Today's words: ${safeWords.join(", ") || "(none given)"}
Words marked as MUST-use: ${safeMustUse.join(", ") || "(none)"}

Story idea from the child:
- Main character: ${hero || "(not given)"}
- Place: ${place || "(not given)"}
- What happens (problem or event): ${problem || "(not given)"}
- Ending the child wants: ${ending || "(not given)"}

Please:
1. Use ONLY very simple English.
2. Make the story friendly and safe.
3. Try to naturally include all MUST-use words.
4. Do not number the sentences. Just write one short paragraph.
5. ${lengthInstruction}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("OpenAI error:", response.status, errData);
      return res
        .status(500)
        .json({ error: "Failed to generate story from OpenAI." });
    }

    const data = await response.json();
    const story =
      data.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I could not create a story.";

    return res.status(200).json({ story });
  } catch (err) {
    console.error("API /story error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
