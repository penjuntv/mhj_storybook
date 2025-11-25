export default function Home() {
  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>AI Storybook – Phase 1</h1>
      <p>Today's words, tell your story idea, and generate a story.</p>

      <div style={{ marginTop: 40 }}>
        <h3>STEP 1 · Today's words</h3>
        <input
          placeholder="apple, banana, cat, dog"
          style={{ width: "100%", padding: 12, fontSize: 16 }}
        />

        <h3 style={{ marginTop: 40 }}>STEP 2 · Tell me your story idea</h3>
        <input placeholder="Who is the main character?" style={{ width: "100%", padding: 12, marginBottom: 12 }} />
        <input placeholder="Where does the story happen?" style={{ width: "100%", padding: 12, marginBottom: 12 }} />
        <input placeholder="What happens?" style={{ width: "100%", padding: 12, marginBottom: 12 }} />
        <input placeholder="How does it end?" style={{ width: "100%", padding: 12, marginBottom: 12 }} />

        <button style={{ padding: "12px 20px", fontSize: 16 }}>
          Create Story
        </button>
      </div>
    </div>
  );
}
