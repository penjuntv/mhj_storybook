// components/storybook/StoryResult.js

export default function StoryResult({ t, story }) {
  if (!story) return null;

  return (
    <section
      style={{
        background: "#FFFFFF",
        borderRadius: 20,
        padding: "20px 24px",
        boxShadow: "0 18px 45px rgba(0,0,0,0.04)",
        marginBottom: 32,
        marginTop: 8,
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {t.resultTitle}
      </div>
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
        }}
      >
        {story}
      </div>
    </section>
  );
}
