import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sceneText } = req.body;

    if (!sceneText || sceneText.trim().length === 0) {
      return res.status(400).json({ error: "Missing scene text" });
    }

    const prompt = `
Create a clean children's coloring-book line drawing based on the scene:

"${sceneText}"

Rules:
- Use only black outlines on white background.
- No shading, no colors.
- Simple big shapes appropriate for ages 3–6.
- Center the main subject.
- Remove small details.
`;

    const aiResult = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      // ❌ response_format 제거 — 이게 오류 원인이었음!
    });

    const imageUrl = aiResult.data[0]?.url;

    if (!imageUrl) {
      return res.status(500).json({ error: "No image URL returned" });
    }

    return res.status(200).json({ url: imageUrl });
  } catch (err) {
    console.error("Coloring API Error:", err);
    return res.status(500).json({
      error: "Failed to generate coloring image.",
      detail: err?.response?.data || err.message,
    });
  }
}
