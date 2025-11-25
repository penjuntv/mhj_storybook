export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is not set on the server."
    });
  }

  try {
    const {
      wordsText = "",
      mustUseWords = [],
      answers = {},
      lengthMode = "normal",
      stylePrompt
    } = req.body || {};

    // 단어 파싱: 콤마/줄바꿈/공백 기준, 알파벳만 남기기
    const rawTokens = wordsText
      .split(/[\s,]+/)
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean);

    const cleanedWords = Array.from(
      new Set(
        rawTokens
          .map((w) => w.replace(/[^a-zA-Z]/g, ""))
          .filter((w) => w.length > 0)
      )
    );

    const must = (mustUseWords || [])
      .map((w) => String(w).toLowerCase())
      .filter((w) => cleanedWords.includes(w));

    const baseSystemPrompt = `
You are an expert children's storyteller.
Write very SHORT, CLEAR stories in simple English (A1~A2 level, 6–9 year old ESL learners).
Use very short sentences (mostly 5–10 words).
Avoid difficult grammar (no passive voice, no complex clauses).
The story should be warm, kind, and emotionally safe.
The child is learning English as an immigrant in a new country.
Use all MUST words in natural sentences.
If some normal words are hard to use, it's OK to skip them.
    `.trim();

    const lengthInstruction =
      lengthMode === "short"
        ? "Make the story as short as possible while still complete."
        : lengthMode === "long"
        ? "Make the story a little longer with a few more simple sentences."
        : "Make the story medium length with 4–6 short sentences.";

    const systemPrompt = (stylePrompt || baseSystemPrompt) + "\n\n" + lengthInstruction;

    // 스토리 두 버전 생성 함수
    async function generateOneStory(variantLabel) {
      const userSummary = `
Today's English words: ${cleanedWords.join(", ") || "(none)"}
MUST-use words: ${must.length ? must.join(", ") : "(none)"}

Story idea from the parent/child:
1) Main character: ${answers.q1 || "(not given)"}
2) Where: ${answers.q2 || "(not given)"}
3) What happens (problem or event): ${answers.q3 || "(not given)"}
4) How it ends: ${answers.q4 || "(not given)"}

Write one complete short story in very simple English.
DO NOT number the sentences.
DO NOT add titles.
Just plain story text only.
This is Story version ${variantLabel}.
      `.trim();

      const openaiResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userSummary }
            ],
            temperature: 0.7
          })
        }
      );

      if (!openaiResponse.ok) {
        const errText = await openaiResponse.text();
        throw new Error(
          `OpenAI error (${openaiResponse.status}): ${errText}`
        );
      }

      const data = await openaiResponse.json();
      const story = data.choices?.[0]?.message?.content?.trim() || "";
      return story;
    }

    const [story1, story2] = await Promise.all([
      generateOneStory(1),
      generateOneStory(2)
    ]);

    return res.status(200).json({
      words: cleanedWords,
      mustUse: must,
      stories: [story1, story2]
    });
  } catch (e) {
    console.error("Story API error:", e);
    return res.status(500).json({
      error: "Failed to generate story.",
      detail: e.message
    });
  }
}
