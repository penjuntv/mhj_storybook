// pages/api/generateStory.js

/**
 * Generate an English children's story for the MHJ Storybook app.
 *
 * Request body (JSON):
 * {
 *   locale: "ko" | "en" | "zh",      // UI 언어, 스토리 언어에는 영향 주지 않음
 *   length: "short" | "medium" | "long",
 *   childName: string,               // optional, 주인공 이름
 *   themeKey: string,                // "everyday" | "school" | ...
 *   words: {
 *     mustInclude: string[],         // 반드시 들어가야 할 단어들
 *     optional: string[],           // 가능하면 넣어줄 단어들
 *   }
 * }
 *
 * Response body (JSON):
 * { story: string }
 */

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const THEME_DESCRIPTIONS = {
  everyday: "a warm everyday adventure at home or in the neighbourhood",
  school: "a fun story that happens at school or on the way to school",
  family: "a heart-warming story about family love and time together",
  friends: "a story about friendship, helping each other and playing together",
  animals: "a story where friendly animals appear and interact with the child",
  princess: "a gentle fairy-tale style princess story, but still modern and kind",
  hero: "a child hero who shows bravery and kindness, without violence",
  classic: "a classic fairy-tale style story, but with a gentle modern twist",
  animation: "a story that feels like a cute, colourful animation movie",
  sf: "a simple space / sci-fi adventure that is still easy to understand",
};

function mapLength(length) {
  switch (length) {
    case "short":
      return { sentences: "6–8 sentences", targetWords: "around 200–250 words" };
    case "long":
      return { sentences: "14–18 sentences", targetWords: "around 550–700 words" };
    case "medium":
    default:
      return { sentences: "9–12 sentences", targetWords: "around 350–450 words" };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_TOKEN;
  if (!apiKey) {
    return res.status(500).json({
      error:
        "OPENAI_API_KEY (or OPENAI_API_TOKEN) is not set in environment variables.",
    });
  }

  try {
    const {
      locale = "ko",
      length = "medium",
      childName = "",
      themeKey = "everyday",
      words = {},
    } = req.body || {};

    const mustInclude = Array.isArray(words.mustInclude)
      ? words.mustInclude
      : [];
    const optional = Array.isArray(words.optional) ? words.optional : [];

    const themeDescription =
      THEME_DESCRIPTIONS[themeKey] || THEME_DESCRIPTIONS.everyday;

    const { sentences, targetWords } = mapLength(length);

    const namePart = childName
      ? `The main character of the story is a child named "${childName}".`
      : "The main character is a child (you can choose a suitable English name).";

    const mustPart =
      mustInclude.length > 0
        ? `You MUST naturally include ALL of the following English words in the story: ${mustInclude
            .map((w) => `"${w}"`)
            .join(", ")}.`
        : "If helpful, you may gently introduce some simple English vocabulary words.";

    const optionalPart =
      optional.length > 0
        ? `If it fits naturally, you MAY also include some of these extra words: ${optional
            .map((w) => `"${w}"`)
            .join(", ")}. Do not force them.`
        : "";

    // locale는 UI 언어일 뿐, 스토리는 항상 영어로만 작성해야 한다.
    const parentNoteLanguage =
      locale === "ko"
        ? "At the very end, add one short parent note line in Korean starting with '부모님께:'."
        : locale === "zh"
        ? "At the very end, add one short parent note line in Chinese starting with '给家长：'."
        : "You do NOT need to add any translation or parent note.";

    const systemPrompt =
      "You are a professional children's book writer. " +
      "You ALWAYS write stories in SIMPLE, CLEAR ENGLISH only. " +
      "Your tone is warm, gentle, and encouraging. " +
      "You write for children who are learning English as a second language, " +
      "so you avoid long, complex sentences and difficult vocabulary.";

    const userPrompt = `
Please write a complete children's story in ENGLISH only.

- Target reader: 7–10 years old child who is learning English.
- Style: bright, kind, emotional but not scary, no violence.
- Length: ${sentences} (${targetWords}).
- Theme: ${themeDescription}
- ${namePart}
- ${mustPart}
- ${optionalPart}

Structure:
1. Start with a simple, catchy opening line that sets the scene.
2. Build a clear beginning, middle, and end (introduction – problem or small challenge – happy resolution).
3. Make sure the story feels like something that could later be turned into a picture book.
4. Use ONLY English for the main story text.

${parentNoteLanguage}

Output format:
- Write the story as plain text paragraphs.
- Do NOT wrap the story in JSON or XML.
- Do NOT add any headings like "Story:" or "Title:"; just start the story text directly.
    `.trim();

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return res.status(500).json({
        error: "Failed to generate story from OpenAI.",
        detail: errorText,
      });
    }

    const data = await response.json();
    const content =
      data.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I could not generate a story.";

    return res.status(200).json({ story: content });
  } catch (err) {
    console.error("generateStory error:", err);
    return res.status(500).json({
      error: "Unexpected server error while generating story.",
    });
  }
}
