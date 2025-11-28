// components/storybook/StoryResult.js

import React from "react";

export default function StoryResult({ story }) {
  if (!story) return null;

  const paragraphs = String(story)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      style={{
        marginTop: 40,
        padding: 28,
        borderRadius: 32,
        background: "#fffdf8",
        boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
      }}
    >
      <h3
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 16,
          color: "#4a2d1a",
        }}
      >
        오늘의 영어 동화
      </h3>
      <div style={{ fontSize: 16, lineHeight: 1.7, color: "#61452f" }}>
        {paragraphs.map((p, idx) => (
          <p key={idx} style={{ marginBottom: 12 }}>
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
