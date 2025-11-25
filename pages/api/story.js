// pages/api/story.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: "OPENAI_API_KEY is not set on the server." });
  }

  const { words, mustUse = [], answers = {}, length = "normal" } = req.body || {};

  if (!Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ error: "words must be a non-empty array." });
  }

  const safeMustUse = mustUse.filter((w) => typeof w === "string" && w.trim());
  const mustUseLine =
    safeMustUse.length > 0
      ? `You MUST include all of these words in the story: ${safeMustUse.join(
          ", "
        )}.`
      : `Use as many of these words as natural: ${words.join(", ")}.`;

  const { mainCharacter = "", place = "", problem = "", ending = "" } = answers;

  const lengthHint =
    length === "short"
      ? "Write a very short story, about 4–6 sentences."
      : length === "long"
      ? "Write a longer story, about 10–14 short sentences."
      : "Write a medium-length story, about 7–9 short sentences.";

  const systemPrompt = [
    "You are an expert children's storyteller.",
    "Write SHORT, CLEAR stories in very simple English (A1~A2 level, 6–9 year old ESL learners).",
    "Use very short sentences (mostly 5–10 words).",
    "Avoid difficult grammar (no passive voice, no complex clauses).",
    "The story should be warm, kind, and emotionally safe.",
    "The child is learning English as an immigrant in a new country.",
  ].join(" ");

  const userPromptLines = [];

  userPromptLines.push(
    `Today’s words: ${words.join(
      ", "
    )}. ${mustUseLine} Do NOT add Korean translations. Only English.`
  );

  if (mainCharacter) {
    userPromptLines.push(`Main character: ${mainCharacter}`);
  }
  if (place) {
    userPromptLines.push(`Place: ${place}`);
  }
  if (problem) {
    userPromptLines.push(`What happens: ${problem}`);
  }
  if (ending) {
    userPromptLines.push(`Ending: ${ending}`);
  }

  userPromptLines.push(lengthHint);
  userPromptLines.push(
    "Write the story as simple paragraphs, not as a list. Do not add a title."
  );

  const userPrompt = userPromptLines.join("\n");

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens:
        length === "short" ? 450 : length === "long" ? 800 : 600,
    });

    const story =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I could not create a story.";

    return res.status(200).json({ story });
  } catch (e) {
    console.error("Story API error:", e);
    return res.status(500).json({
      error: "Failed to create story.",
      detail: e?.message || String(e),
    });
  }
}
