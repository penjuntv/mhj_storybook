// pages/api/story.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // GET: health check
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "story API is alive",
      method: "GET",
    });
  }

  // Only allow POST for story generation
  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed (use POST)` });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: "OPENAI_API_KEY is not set on the server." });
  }

  const { words = [], mustUse = [], answers = {} } = req.body || {};

  if (!Array.isArray(words) || words.length === 0) {
    return res
      .status(400)
      .json({ error: "words must be a non-empty array." });
  }

  const safeMustUse = Array.isArray(mustUse) ? mustUse : [];
  const { mainCharacter = "", place = "", event = "" } = answers || {};

  if (!mainCharacter || !place || !event) {
    return res.status(400).json({
      error:
        "answers.mainCharacter, answers.place, and answers.event are required.",
    });
  }

  // Decide story length based on number of words
  const lengthCategory = words.length <= 5 ? "normal" : "long";
  const lengthText =
    lengthCategory === "normal"
      ? "about 5–7 short sentences"
      : "about 9–12 short sentences";

  const wordsText = words.join(", ");
  const mustText =
    safeMustUse.length > 0 ? safeMustUse.join(", ") : "no specific word";

  const ideaSummary = [
    `Main character: ${mainCharacter}`,
    `Place: ${place}`,
    `Event/problem: ${event}`,
  ].join("\n");

  const userPrompt = `
You are a warm, playful English story writer for very young children (ages 3–7) who are just starting to read.

TASK:
- Write a short picture-book style story in VERY SIMPLE English.
- Use these English words somewhere in the story: ${wordsText}.
- Strongly try to include these must-use words: ${mustText}.
- Follow this idea from the parent/child:
${ideaSummary}

STYLE RULES:
- ${lengthText}.
- Use simple sentences with clear subjects and verbs.
- The story should feel like a children's picture book or cartoon.
- Include at least two moments of gentle imagination (for example: talking animals, magic doors, brave toys, tiny fairies, friendly monsters, etc.).
- Add some emotional words (happy, excited, scared, surprised, proud).
- Keep everything safe, kind, and positive.
- End with a clearly happy and comforting ending.
- Do NOT add any Korean or Chinese translation. Only output the English story text.
`.trim();

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You write very simple, kind, and imaginative English stories for young children who are beginning readers.",
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9,
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
