export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is not set on the server.",
    });
  }

  try {
    const { words, answers } = req.body;

    if (!words || !answers) {
      return res.status(400).json({
        error: "Missing required fields: words, answers",
      });
    }

    // Create a short story prompt
    const prompt = `
Make a very short children's story (5–6 sentences).
Use these words in the story: ${words.join(", ")}.
Story idea:
- Main character: ${answers.q1}
- Setting: ${answers.q2}
- Problem or event: ${answers.q3}
- Ending: ${answers.q4}

Write the story in very simple English (A1 level).
    `;

    // OpenAI API call
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a children's storyteller." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const story = data.choices?.[0]?.message?.content || "No story generated.";

    return res.status(200).json({ story });
  } catch (error) {
    console.error("Story API failed:", error);
    return res.status(500).json({
      error: "Story generation failed.",
    });
  }
}
