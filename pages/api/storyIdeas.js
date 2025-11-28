// pages/api/storyIdeas.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { words } = body || {};

    if (!Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: "words must be a non-empty array" });
    }

    const wordList = words.join(", ");

    const systemPrompt =
      "You are an assistant helping parents and young children (ages 3-7) brainstorm simple, fun English story ideas.";

    const userPrompt = `
The child learned these English words today:
${wordList}

1) Suggest 6 possible STORY PLACES that match or naturally fit these words.
   - Each place must be short (1-3 words).
   - Use simple, child-friendly places (e.g. "playground", "grandma's house").
   - Avoid scary or inappropriate locations.
   - Return them as an array of plain strings.

2) For each place in (1), suggest ONE possible ACTION idea that the child could do there.
   - Each action should start with a verb (e.g. "build a sandcastle").
   - Keep them short and easy to imagine.

Return ONLY valid JSON in this exact structure:

{
  "places": [
    "place 1",
    "place 2",
    "place 3",
    "place 4",
    "place 5",
    "place 6"
  ],
  "actions": [
    "action idea for place 1",
    "action idea for place 2",
    "action idea for place 3",
    "action idea for place 4",
    "action idea for place 5",
    "action idea for place 6"
  ]
}
    `.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const maybeJson = raw.slice(jsonStart, jsonEnd + 1);
        parsed = JSON.parse(maybeJson);
      } else {
        throw e;
      }
    }

    if (
      !parsed ||
      !Array.isArray(parsed.places) ||
      !Array.isArray(parsed.actions)
    ) {
      return res
        .status(500)
        .json({ error: "Model returned invalid structure", raw });
    }

    const places = parsed.places.slice(0, 6);
    const actions = parsed.actions.slice(0, 6);

    return res.status(200).json({ places, actions });
  } catch (error) {
    console.error("Error in /api/storyIdeas:", error);
    return res.status(500).json({
      error: "Failed to create story ideas",
      detail: error.message || String(error),
    });
  }
}
