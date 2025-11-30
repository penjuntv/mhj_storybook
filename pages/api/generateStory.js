// pages/api/generateStory.js
// "AI에게 영어 동화 만들기 요청하기" 버튼이 호출하는 API 라우트

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = req.body || {};

    // --- 1) 프런트에서 오는 값들을 최대한 유연하게 읽기 ---
    // selectedWords: [{ word: "Ball", mustInclude: true }, ...] 형태라고 가정
    const rawWords =
      (Array.isArray(body.selectedWords) && body.selectedWords) ||
      (Array.isArray(body.words) && body.words) ||
      [];

    const normalisedWords = rawWords
      .map((item) => {
        if (typeof item === "string") {
          return { word: item, mustInclude: false };
        }
        if (item && typeof item.word === "string") {
          return {
            word: item.word,
            mustInclude: Boolean(item.mustInclude),
          };
        }
        return null;
      })
      .filter(Boolean);

    const mustWords = normalisedWords
      .filter((w) => w.mustInclude)
      .map((w) => w.word);
    const optionalWords = normalisedWords
      .filter((w) => !w.mustInclude)
      .map((w) => w.word);

    const allWords = [...mustWords, ...optionalWords];

    // 이름, 언어, 길이, 톤 등 옵션 (없으면 기본값 사용)
    const childName =
      body.childName || body.studentName || body.kidName || "yujin";
    const uiLanguage = body.language || body.lang || "ko"; // UI 언어
    const storyLanguage =
      body.storyLanguage || "en"; // 실제 동화 언어 (기본: 영어)
    const storyLength =
      body.storyLength ||
      body.length ||
      "about 8–10 short sentences for a young child";
    const storyTone =
      body.storyTone ||
      body.tone ||
      "warm, gentle, imaginative, and easy for elementary school kids";

    // --- 2) OpenAI API 키 없을 때: 데모 텍스트로 graceful fallback ---
    if (!process.env.OPENAI_API_KEY) {
      const demo =
        uiLanguage === "ko"
          ? `${childName}가 좋아하는 단어 ${allWords.join(
              ", "
            )}를(을) 가지고 짧은 영어 동화를 만든다고 상상해 보세요. (demo text – OPENAI_API_KEY 미설정)`
          : `Imagine a short English story for ${childName} using the words ${allWords.join(
              ", "
            )}. (demo text – OPENAI_API_KEY not set)`;

      return res.status(200).json({
        story: demo,
        isDemo: true,
      });
    }

    // --- 3) 실제 OpenAI 호출 ---
    const systemPrompt = `
You are a friendly children's picture-book author.
You write simple, vivid stories for young children who are learning English.
Always keep vocabulary and sentence length appropriate for early elementary school students.
Do NOT explain what you are doing; just output the story itself.
`;

    // 한국어 UI를 쓰더라도 실제 동화는 영어로만 쓰는 것을 기본값으로 둠
    const languageInstruction =
      storyLanguage === "ko"
        ? "Write the story in Korean."
        : "Write the story in clear and simple English only.";

    const vocabInstruction =
      mustWords.length > 0 || optionalWords.length > 0
        ? `Make sure the following vocabulary appears naturally in the story.
IMPORTANT words that must appear: ${
            mustWords.length ? mustWords.join(", ") : "none"
          }.
Optional words that can appear if natural: ${
            optionalWords.length ? optionalWords.join(", ") : "none"
          }.
Do not just list the words; weave them smoothly into the narrative.`
        : "No specific vocabulary was provided, so you may choose suitable simple words yourself.";

    const userPrompt = `
Child's name: ${childName}
Story length: ${storyLength}
Tone: ${storyTone}

${languageInstruction}
${vocabInstruction}

Write one complete story. You may use multiple short paragraphs,
but do NOT add any explanations, titles, notes, or translations around it.
Just output the story text that can be shown directly to the child.
`;

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini", // 필요하면 다른 모델 이름으로 변경
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.9,
        }),
      }
    );

    if (!openaiResponse.ok) {
      const text = await openaiResponse.text();
      console.error("OpenAI API error:", openaiResponse.status, text);

      // OpenAI 쪽에서 실패하면, 여전히 앱은 죽지 않도록 짧은 fallback 제공
      const fallback =
        uiLanguage === "ko"
          ? `${childName}가 좋아하는 단어 ${allWords.join(
              ", "
            )}를(을) 가지고 모험을 떠나는 짧은 이야기가 이어집니다… (fallback text)`
          : `${childName} goes on an adventure with the words ${allWords.join(
              ", "
            )}… (fallback text)`;

      return res.status(200).json({
        story: fallback,
        isDemo: true,
      });
    }

    const data = await openaiResponse.json();
    const story =
      data.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn’t generate a story this time.";

    return res.status(200).json({
      story,
      isDemo: false,
    });
  } catch (err) {
    console.error("generateStory handler error:", err);

    return res.status(500).json({
      error: "Failed to generate story",
      story:
        "An unexpected error occurred while generating the story. Please try again in a moment.",
      isDemo: true,
    });
  }
}
