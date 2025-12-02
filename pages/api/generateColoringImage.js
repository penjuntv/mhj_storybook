// pages/api/generateColoringImage.js

const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";

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
    const { sceneText, childName, themeKey } = req.body || {};

    if (!sceneText || typeof sceneText !== "string") {
      return res.status(400).json({
        error: "sceneText is required and must be a string.",
      });
    }

    const safeChildName =
      typeof childName === "string" && childName.trim().length > 0
        ? childName.trim()
        : "a child";

    // themeKey는 있으면 살짝만 힌트로 사용 (너무 과하게 의존하지 않도록)
    let themeHint = "";
    switch (themeKey) {
      case "school":
        themeHint = "in a simple school setting";
        break;
      case "family":
        themeHint = "with family at home";
        break;
      case "animals":
        themeHint = "with friendly animals";
        break;
      case "princess":
        themeHint = "in a soft fairy-tale style scene";
        break;
      case "hero":
        themeHint = "in a gentle hero story scene";
        break;
      case "space":
      case "sf":
        themeHint = "in a simple space adventure scene";
        break;
      default:
        themeHint = "in a simple everyday life scene";
    }

    // 장면 텍스트를 요약해서 프롬프트에 넣기 (너무 길면 잘라내기)
    const trimmedScene =
      sceneText.length > 400 ? sceneText.slice(0, 400) : sceneText;

    const prompt = `
Create a children's coloring page line art for the following story scene.

Scene description:
"${trimmedScene}"

The main character is ${safeChildName}, a young child, ${themeHint}.

Requirements:
- Simple black line art only, no colors, no shading.
- Thick, clean outlines suitable for 5–8 year old children to color.
- White background.
- Avoid tiny details; keep shapes big and clear.
- Style like a soft crayon / pencil drawing but still clear as line art.
`.trim();

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
        n: 1,
        response_format: "url",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI image API error:", response.status, errorText);
      return res.status(500).json({
        error: "Failed to generate coloring image.",
        detail: errorText,
      });
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      return res.status(500).json({
        error: "Image URL missing from OpenAI response.",
      });
    }

    return res.status(200).json({ imageUrl });
  } catch (err) {
    console.error("generateColoringImage error:", err);
    return res.status(500).json({
      error: "Unexpected server error while generating coloring image.",
    });
  }
}
