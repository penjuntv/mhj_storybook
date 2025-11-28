// pages/api/storybook.js
import OpenAI from "openai";
import { STORY_THEME_DESCRIPTIONS } from "../../data/storyThemes";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS
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
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { words, storySettings } = body || {};

    if (!Array.isArray(words) || words.length === 0) {
      res.status(400).json({ error: "words 배열이 비어 있습니다." });
      return;
    }

    const safeWords = words.slice(0, 8).join(", ");

    const language = storySettings?.language || "en";
    const name = storySettings?.kidName || "the child";
    const pov = storySettings?.pov === "third" ? "third" : "first";
    const themeId = storySettings?.themeId || "everyday";
    const length = storySettings?.length || "normal";

    const themeDescription =
      STORY_THEME_DESCRIPTIONS[themeId] ||
      STORY_THEME_DESCRIPTIONS.everyday;

    let povInstruction;
    if (pov === "first") {
      povInstruction = `Tell the story in FIRST PERSON, using "I", as if ${name} is the hero.`;
    } else {
      povInstruction =
        `Tell the story in THIRD PERSON, using "he/she/they" for ${name}, ` +
        `but still make the child feel like the main character.`;
    }

    let lengthInstruction;
    if (length === "short") {
      lengthInstruction =
        "Keep the story very short: about 3–5 simple sentences total.";
    } else if (length === "long") {
      lengthInstruction =
        "Make the story a bit longer: about 12–16 short sentences, grouped into a few small paragraphs.";
    } else {
      lengthInstruction =
        "Make the story medium length: about 6–10 short sentences.";
    }

    const userPrompt = `
Today's English words: ${safeWords}

Child:
- Name: ${name}
- Preferred story theme: ${themeDescription}
- Point of view: ${pov === "first" ? "1st person (I)" : "3rd person"}

Requirements:
- Language: English only.
- Use as many of the words as sounds natural.
- ${povInstruction}
- ${lengthInstruction}
- Very simple English (A1~A2 level) for 3–7 year old ESL learners.
- Short sentences, clear grammar, warm and safe content.
- No scary or violent scenes.
`.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert children's storyteller. Write warm, safe stories in very simple English for 3–7 year old ESL learners.",
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
