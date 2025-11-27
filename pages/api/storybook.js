// pages/api/storybook.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 간단한 CORS 처리 (프레이머/브라우저에서 직접 호출 가능하게)
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

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
    const { mode, words, place, event } = body || {};

    if (!mode) {
      res.status(400).json({ error: "mode is required" });
      return;
    }

    const safeWords =
      Array.isArray(words) && words.length > 0
        ? words.slice(0, 8).map((w) => String(w))
        : [];

    if (mode === "suggestPlaces") {
      if (safeWords.length < 2) {
        res.status(400).json({ error: "At least 2 words are required." });
        return;
      }

      const places = await suggestPlaces(safeWords);
      res.status(200).json({ places });
      return;
    }

    if (mode === "suggestEvents") {
      if (safeWords.length < 2 || !place) {
        res.status(400).json({ error: "Words and place are required." });
        return;
      }

      const events = await suggestEvents(safeWords, place);
      res.status(200).json({ events });
      return;
    }

    if (mode === "createStory") {
      if (safeWords.length === 0 || !place || !event) {
        res
          .status(400)
          .json({ error: "Words, place and event are required." });
        return;
      }

      const story = await createStory(safeWords, place, event);
      res.status(200).json({ story });
      return;
    }

    res.status(400).json({ error: "Unknown mode" });
  } catch (err) {
    console.error("Story API error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// ---------- OpenAI 헬퍼들 ----------

function wordsToSentence(words) {
  return words.join(", ");
}

function parseListFromText(text, maxItems = 6) {
  if (!text) return [];
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const cleaned = lines
    .map((line) => line.replace(/^\d+[\).\-\:]\s*/, ""))
    .filter((line) => line.length > 0);

  return cleaned.slice(0, maxItems);
}

async function suggestPlaces(words) {
  const userPrompt = `
Child's chosen English words: ${wordsToSentence(words)}

You are helping a 3–7 year old ESL child.
Suggest 6 fun, imaginative but simple places in very simple English,
where a story using these words could happen.

Rules:
- 1 short place phrase per line (for buttons), like "at the playground", "in a small castle".
- NO explanations, NO numbering like "1." – just the phrases, each on its own line.
- Very simple words only (A1 level).
  `;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant for a children's English story app. Output must be plain text with one short phrase per line.",
      },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  const content =
    completion.choices?.[0]?.message?.content?.trim() || "";
  return parseListFromText(content, 6);
}

async function suggestEvents(words, place) {
  const userPrompt = `
Child's chosen English words: ${wordsToSentence(words)}
Chosen place: ${place}

Suggest 6 fun and simple ideas for "what happens" at this place.

Rules:
- 1 short sentence or phrase per line, like "They build a sandcastle" or "They find a tiny dragon".
- MUST be grammatically simple (A1 level).
- Use simple verbs (play, find, make, read, help, etc.).
- NO explanations, NO numbering like "1." – just the ideas, each on its own line.
  `;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant for a children's English story app. Output must be plain text with one idea per line.",
      },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 220,
  });

  const content =
    completion.choices?.[0]?.message?.content?.trim() || "";
  return parseListFromText(content, 6);
}

async function createStory(words, place, event) {
  const userPrompt = `
Child's chosen English words: ${wordsToSentence(words)}
Chosen place: ${place}
Chosen action (what happens): ${event}

Write a short children's story in very simple English (A1 level) for a 3–7 year old ESL learner.

Requirements:
- Use as many of the child's words as natural.
- 3–6 short sentences, each on its own line.
- Very simple grammar and vocabulary.
- Warm, kind, encouraging tone.
- Do NOT include translation or explanations, only the English story.
  `;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert children's storyteller. You write warm, safe stories in very simple English for young ESL learners.",
      },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const story =
    completion.choices?.[0]?.message?.content?.trim() ||
    "Sorry, I could not create a story.";
  return story;
}
