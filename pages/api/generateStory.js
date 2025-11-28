// pages/api/generateStory.js

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      language = "ko",
      kidName = "",
      pov = "first",     // "first" | "third"
      themes = [],       // ["family", "princess", ...]
      length = "normal", // "short" | "normal" | "long"
      words = [],        // ["apple", "banana", ...]
    } = req.body || {};

    const lengthMap = {
      short: "about 250–350 words",
      normal: "about 400–600 words",
      long: "about 700–900 words",
    };
    const lengthText = lengthMap[length] || lengthMap.normal;

    const povText =
      pov === "first"
        ? `Write the story in the FIRST person, as if ${
            kidName || "the child"
          } is saying "I".`
        : `Write the story in the THIRD person, talking about ${
            kidName || "the child"
          } as "he/she".`;

    const themeText =
      themes && themes.length
        ? `Make the overall mood and genre fit these themes: ${themes.join(
            ", "
          )}.`
        : "Use a warm, fun, child-friendly tone.";

    const wordsText =
      words && words.length
        ? `You MUST naturally include all of these English words in the story: ${words.join(
            ", "
          )}.`
        : "If no specific words are given, use simple beginner English vocabulary.";

    const systemMsg =
      language === "ko"
        ? "You are an English storybook writer for Korean children aged 5 to 10. You write simple, clear English stories that are easy to read aloud. You do NOT add Korean translations."
        : "You are a friendly English storybook writer for children aged 5 to 10.";

    const userMsg = `
Create a children's English story.

Child's name: ${kidName || "Yujin"}
Target age: 5–10 years old
Story length: ${lengthText}

${povText}
${themeText}
${wordsText}

Write the story in simple English, with clear paragraphs.
Do NOT add explanations or translations. Just output the story text only.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: userMsg },
      ],
      temperature: 0.9,
    });

    const story =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I could not generate a story.";

    return res.status(200).json({ story });
  } catch (err) {
    console.error("Story API error:", err);
    return res.status(500).json({
      error: "Failed to generate story",
      detail: err.message || String(err),
    });
  }
}
