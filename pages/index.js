// pages/index.js
import { useState } from "react";

export default function Home() {
  const [wordsInput, setWordsInput] = useState("");
  const [chips, setChips] = useState([]);
  const [mustUse, setMustUse] = useState([]);
  const [step2, setStep2] = useState({
    hero: "",
    place: "",
    problem: "",
    ending: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [storyShort, setStoryShort] = useState("");
  const [storyLong, setStoryLong] = useState("");

  // Step 1: 단어 입력 → 칩 생성
  const handleWordsChange = (e) => {
    const value = e.target.value;
    setWordsInput(value);

    const tokens = value
      .split(/[,\n]/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    setChips(tokens);
    // chips가 바뀌면 mustUse는 (존재하는 것만) 유지
    setMustUse((prev) => prev.filter((w) => tokens.includes(w)));
  };

  const toggleMustUse = (word) => {
    setMustUse((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const handleStep2Change = (field, value) => {
    setStep2((prev) => ({ ...prev, [field]: value }));
  };

  // 서버에 스토리 요청
  const requestStory = async (lengthType) => {
    setErrorMsg("");
    setStoryShort("");
    setStoryLong("");
    setLoading(true);

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          words: chips,
          mustUse,
          idea: step2,
          lengthType // "short" | "long"
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      if (lengthType === "short") {
        setStoryShort(data.story || "");
      } else {
        setStoryLong(data.story || "");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <main className="app-card">
        <header className="app-header">
          <span className="app-tag">AI Storybook · Phase 1</span>
          <h1 className="app-title">
            Tell a story with today&apos;s English words
          </h1>
          <p className="app-sub">
            Type the English words you learned today, then build a very simple
            English story together.
          </p>
        </header>

        {/* STEP 1 */}
        <section className="step-card">
          <div className="step-label">STEP 1</div>
          <h2 className="step-title">Today&apos;s words</h2>
          <p className="step-desc">
            Type the English words you learned today. Separate each word with a{" "}
            <strong>comma</strong> or a <strong>new line</strong>.
          </p>

          <textarea
            className="textarea"
            placeholder="e.g. apple, banana, cat, dog"
            value={wordsInput}
            onChange={handleWordsChange}
          />

          <div className="chips-help">
            <strong>Word chips</strong>{" "}
            <span className="chips-help-sub">
              (click to mark as <span className="star">★</span> MUST-use)
            </span>
          </div>
          <p className="chips-note">
            <span className="star">★</span> = must appear in the story.
          </p>

          <div className="chips-row">
            {chips.length === 0 && (
              <span className="chips-empty">No words yet. Start typing above.</span>
            )}
            {chips.map((w) => {
              const selected = mustUse.includes(w);
              return (
                <button
                  key={w}
                  type="button"
                  className={`chip ${selected ? "chip-selected" : ""}`}
                  onClick={() => toggleMustUse(w)}
                >
                  {selected && <span className="chip-star">★</span>}
                  <span>{w}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* STEP 2 */}
        <section className="step-card">
          <div className="step-label">STEP 2</div>
          <h2 className="step-title">Tell me your story idea</h2>
          <p className="step-desc">
            Answer in simple English. A parent can type for the child.
          </p>

          <label className="field-label">
            1) Who is the main character?
            <input
              className="input"
              placeholder="e.g. Yujin, a brave girl"
              value={step2.hero}
              onChange={(e) => handleStep2Change("hero", e.target.value)}
            />
          </label>

          <label className="field-label">
            2) Where does the story happen?
            <input
              className="input"
              placeholder="e.g. in the yard with a cat and a dog"
              value={step2.place}
              onChange={(e) => handleStep2Change("place", e.target.value)}
            />
          </label>

          <label className="field-label">
            3) What happens? (problem or event)
            <input
              className="input"
              placeholder="e.g. they play basketball together"
              value={step2.problem}
              onChange={(e) => handleStep2Change("problem", e.target.value)}
            />
          </label>

          <label className="field-label">
            4) How do you want the story to end?
            <input
              className="input"
              placeholder="e.g. everyone is happy and still friends"
              value={step2.ending}
              onChange={(e) => handleStep2Change("ending", e.target.value)}
            />
          </label>

          <div className="button-row">
            <button
              type="button"
              className="btn primary"
              onClick={() => requestStory("short")}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create story"}
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => requestStory("short")}
              disabled={loading}
            >
              Shorter
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => requestStory("long")}
              disabled={loading}
            >
              Longer
            </button>
          </div>

          {errorMsg && <p className="error-msg">Error: {errorMsg}</p>}
        </section>

        {/* STEP 3 */}
        <section className="step-card">
          <div className="step-label">STEP 3</div>
          <h2 className="step-title">Your AI story</h2>
          <p className="step-desc">
            Read the story together. You can also print or copy it later.
          </p>

          {storyShort === "" && storyLong === "" && !loading && (
            <p className="placeholder">
              When you click &ldquo;Create story&rdquo;, your story will appear
              here.
            </p>
          )}

          {storyShort && (
            <div className="story-box">
              <div className="story-tag">Version A (short)</div>
              <p className="story-text">{storyShort}</p>
            </div>
          )}

          {storyLong && (
            <div className="story-box">
              <div className="story-tag">Version B (longer)</div>
              <p className="story-text">{storyLong}</p>
            </div>
          )}
        </section>

        {/* Admin 준비 영역: 아직 기능 없음, 텍스트만 */}
        <section className="admin-section">
          <h2 className="admin-title">Admin mode (coming soon)</h2>
          <p className="admin-text">
            Here you&apos;ll be able to adjust story style, background colors,
            fonts, and more. For now, this area is only a placeholder so the
            overall structure is ready.
          </p>
        </section>
      </main>
    </div>
  );
}
