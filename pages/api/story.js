// pages/api/story.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: "OPENAI_API_KEY is not set on the server." });
  }

  const { words = [], mustUse = [], answers = {}, length = "normal" } =
    req.body || {};

  try {
    const lengthHint =
      length === "short"
        ? "about 3-5 very short sentences"
        : length === "long"
        ? "about 10-14 short sentences"
        : "about 6-8 short sentences";

    const prompt = `
You are an English picture-book writer for young EFL learners.

Write a very simple English story for a child.
Use the following information:

- Today's English words: ${words.join(", ") || "(none)"}
- MUST-use words: ${mustUse.join(", ") || "(none)"}
- Main character: ${answers.mainCharacter || "(not specified)"}
- Place: ${answers.place || "(not specified)"}
- Problem / event: ${answers.problem || "(not specified)"}
- Ending: ${answers.ending || "(not specified)"}

Requirements:
- Target reader: a Korean child in primary school, beginner level English.
- Use only very simple vocabulary and short sentences.
- Write in the style of a picture-book read-aloud text.
- Make sure every MUST-use word appears at least once in the story.
- Length: ${lengthHint}.
- Output ONLY the story text. No title, no explanation.
    `.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write very simple English stories for young children learning English as a foreign language.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const story =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Story generation failed.";

    return res.status(200).json({ story });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "Failed to generate story from OpenAI." });
  }
}
