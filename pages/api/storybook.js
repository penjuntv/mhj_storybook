// pages/api/storybook.js
import OpenAI from "openai";

// 서버에서만 쓰는 OpenAI 클라이언트
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS (프레이머 / 브라우저에서 직접 호출해도 안전하게)
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
      childName,
      childAge,
      perspective = "firstPerson", // "firstPerson" | "thirdPerson"
      place,
      action,
      ending,
      language = "ko", // UI 언어 (en|ko|zh) – 지금은 주로 설명 문구에만 사용
    } = body || {};

    if (!Array.isArray(words) || words.length === 0) {
      res.status(400).json({ error: "words 배열이 비어 있습니다." });
      return;
    }

    const safeWords = words.slice(0, 8).join(", ");
    const mustWords =
      Array.isArray(mustIncludeWords) && mustIncludeWords.length > 0
        ? mustIncludeWords.slice(0, 8).join(", ")
        : "";

    const trimmedName = (childName || "").toString().trim();
    const trimmedAge = (childAge || "").toString().trim();
    const nameForStory = trimmedName || "the child";
    const agePhrase = trimmedAge ? `${trimmedAge}-year-old ` : "";
    const placeText = (place || "").toString().trim();
    const actionText = (action || "").toString().trim();
    const endingText = (ending || "").toString().trim();

    // 1인칭/3인칭 설정
    let perspectiveInstruction = "";
    if (perspective === "firstPerson") {
      perspectiveInstruction = `
- Write the story in first person, using "I".
- The child narrator's name is ${nameForStory}. You may mention the name once, but mostly use "I".
`;
    } else {
      perspectiveInstruction = `
- Write the story in third person, about a child named ${nameForStory}.
- Use "${nameForStory}" and "they/he/she" naturally (you can choose pronouns that feel neutral and kind).
`;
    }

    // 언어별 간단한 톤 설명 (필요하면 나중에 더 확장 가능)
    let uiHint = "";
    if (language === "ko") {
      uiHint =
        "The interface language is Korean, but the story itself must still be in simple English.";
    } else if (language === "zh") {
      uiHint =
        "The interface language is Chinese, but the story itself must still be in simple English.";
    } else {
      uiHint = "The interface language is English.";
    }

    const ideaLines = [];
    if (placeText) ideaLines.push(`- Place: ${placeText}`);
    if (actionText) ideaLines.push(`- What happens: ${actionText}`);
    if (endingText) ideaLines.push(`- How it ends: ${endingText}`);

    const ideaBlock =
      ideaLines.length > 0
        ? `Story idea (from parent/child):
${ideaLines.join("\n")}

`
        : "";

    const mustWordsBlock = mustWords
      ? `The following words are marked as VERY important and should appear if possible: ${mustWords}.
`
      : "";

    const userPrompt = `
Today's English words: ${safeWords}
${mustWordsBlock}
${ideaBlock}
Child information:
- Name: ${nameForStory}
- Age: ${trimmedAge || "not specified"}

${uiHint}

Write a very simple, warm English story for a ${agePhrase}child learning English as a second language (ESL).

Requirements:
- Use as many of the words as is natural.
- Use extremely simple English (around A1–A2 level).
- Short overall length, like a one-page picture book.
- 1–3 short sentences per line.
- Sentences should be kind, safe, and encouraging.
${perspectiveInstruction}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert children's storyteller. Write warm, safe stories in very simple English for 3–7 year old ESL learners. Use short, clear sentences. Avoid difficult grammar and scary topics.",
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
