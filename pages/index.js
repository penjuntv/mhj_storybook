import { useMemo, useState } from "react";

const ADMIN_PASSWORD = "mhjadmin"; // 나중에 .env로 옮겨도 됨

export default function Home() {
  const [wordsText, setWordsText] = useState("apple, banana, cat, dog");
  const [mustUse, setMustUse] = useState([]);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");

  const [lengthMode, setLengthMode] = useState("normal"); // normal | short | long
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [stylePrompt, setStylePrompt] = useState("");
  const [debugInfo, setDebugInfo] = useState({ words: [], mustUse: [] });

  // wordsText → 단어 리스트
  const wordList = useMemo(() => {
    const rawTokens = wordsText
      .split(/[\s,]+/)
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean);

    const cleaned = Array.from(
      new Set(
        rawTokens
          .map((w) => w.replace(/[^a-zA-Z]/g, ""))
          .filter((w) => w.length > 0)
      )
    );

    return cleaned;
  }, [wordsText]);

  const toggleMustUse = (word) => {
    setMustUse((prev) =>
      prev.includes(word)
        ? prev.filter((w) => w !== word)
        : [...prev, word]
    );
  };

  const handleGenerate = async (mode) => {
    setLengthMode(mode);
    setLoading(true);
    setErrorMsg("");
    setStories([]);

    try {
      const resp = await fetch("/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          wordsText,
          mustUseWords: mustUse,
          answers: { q1, q2, q3, q4 },
          lengthMode: mode,
          stylePrompt: stylePrompt || undefined
        })
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Unknown error");
      }

      setStories(data.stories || []);
      setDebugInfo({
        words: data.words || [],
        mustUse: data.mustUse || []
      });
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message || "Failed to generate story.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminPasswordInput("");
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div className="page-root">
      <main className="card-shell">
        <header>
          <h1 className="page-title">AI Storybook – Tell a story with today&apos;s words</h1>
          <p className="page-subtitle">
            Type the English words you learned today, then build a short
            English story together. 오늘 배운 영어 단어를 넣고, 아이와
            상상력으로 아주 쉬운 영어 동화를 만들어 보세요.
          </p>
        </header>

        {/* STEP 1 */}
        <section className="step-box">
          <div className="step-label">Step 1</div>
          <h2 className="step-title">Today&apos;s words</h2>
          <p className="step-caption">
            Type the English words you learned today. Separate each word with a
            comma or new line. 오늘 배운 영어 단어를 입력해 주세요. 쉼표(,)
            또는 줄바꿈으로 구분해도 됩니다.
          </p>

          <div className="label-row">
            Words list
            <span className="label-help"> · e.g. apple, banana, cat, dog</span>
          </div>
          <textarea
            className="textarea"
            rows={3}
            value={wordsText}
            onChange={(e) => setWordsText(e.target.value)}
          />

          <div style={{ marginTop: 10 }}>
            <div className="label-row">
              Word chips (click to mark as MUST-use)
            </div>
            <p className="label-help">
              단어 칩을 클릭하면 ★ 표시가 되고, 동화 안에 꼭 넣어달라고
              요청합니다.
            </p>
            <div className="wordchips-row">
              {wordList.length === 0 && (
                <span style={{ fontSize: 13, color: "#a1917e" }}>
                  No words yet. Start typing above.
                </span>
              )}
              {wordList.map((w) => (
                <button
                  key={w}
                  type="button"
                  className={
                    "wordchip" + (mustUse.includes(w) ? " must" : "")
                  }
                  onClick={() => toggleMustUse(w)}
                >
                  {mustUse.includes(w) ? "★ " : ""}
                  {w}
                </button>
              ))}
            </div>
            <div className="wordchips-legend">
              ★ = must use in the story.
            </div>
          </div>
        </section>

        {/* STEP 2 */}
        <section className="step-box">
          <div className="step-label">Step 2</div>
          <h2 className="step-title">Tell me your story idea</h2>
          <p className="step-caption">
            Answer in simple English. A parent can type for the child. 아이가
            말한 내용을 그대로 영어로 옮겨 적어도 되고, 부모가 대신 간단히
            써 주어도 됩니다.
          </p>

          <div className="label-row">1) Who is the main character?</div>
          <div className="label-help">
            e.g. a brave girl, a funny boy, a kind dragon
          </div>
          <input
            className="text-input"
            value={q1}
            onChange={(e) => setQ1(e.target.value)}
            placeholder="Yujin, a brave girl"
          />

          <div className="label-row">2) Where does the story happen?</div>
          <div className="label-help">
            e.g. in the yard, at home, on the playground
          </div>
          <input
            className="text-input"
            value={q2}
            onChange={(e) => setQ2(e.target.value)}
            placeholder="in the yard with a cat and a dog"
          />

          <div className="label-row">3) What happens? (problem or event)</div>
          <div className="label-help">
            e.g. they lose a ball, they miss the bus
          </div>
          <input
            className="text-input"
            value={q3}
            onChange={(e) => setQ3(e.target.value)}
            placeholder="they play basketball together"
          />

          <div className="label-row">4) How do you want the story to end?</div>
          <div className="label-help">
            e.g. they become friends, everyone is safe and happy
          </div>
          <input
            className="text-input"
            value={q4}
            onChange={(e) => setQ4(e.target.value)}
            placeholder="everyone is happy and still friends"
          />

          <div className="button-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleGenerate("normal")}
              disabled={loading}
            >
              {loading && lengthMode === "normal" ? "Making story..." : "Create story"}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-small"
              onClick={() => handleGenerate("short")}
              disabled={loading}
            >
              {loading && lengthMode === "short"
                ? "Working..."
                : "Shorter (조금 더 짧게)"}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-small"
              onClick={() => handleGenerate("long")}
              disabled={loading}
            >
              {loading && lengthMode === "long"
                ? "Working..."
                : "Longer (조금 더 길게)"}
            </button>
          </div>

          {errorMsg && (
            <p style={{ color: "#c0392b", fontSize: 13, marginTop: 10 }}>
              Error: {errorMsg}
            </p>
          )}
        </section>

        {/* STEP 3 */}
        <section className="step-box">
          <div className="step-label">Step 3</div>
          <h2 className="step-title">Your AI story</h2>
          <p className="step-caption">
            Read the story together. Select the version you like best. 아이와
            함께 읽어 보고, 마음에 드는 버전을 골라 주세요.
          </p>

          {stories.length === 0 && (
            <div style={{ fontSize: 13, color: "#a1917e" }}>
              No story yet. Fill in Step 1 and 2, then click{" "}
              <strong>Create story</strong>.
            </div>
          )}

          {stories.map((s, idx) => (
            <div key={idx} className="story-box">
              <div className="story-version-label">
                Version {idx + 1}
              </div>
              <div className="story-text">
                {s.split("\n").map((line, i) => (
                  <p key={i} style={{ margin: "4px 0" }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Admin mode */}
        <section className="admin-toggle">
          {!isAdmin ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#8c7864" }}>
                Admin mode (for parent only)
              </span>
              <input
                type="password"
                className="text-input"
                style={{ maxWidth: 160, padding: "4px 8px" }}
                placeholder="Password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={handleAdminLogin}
              >
                Enter
              </button>
            </div>
          ) : (
            <>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#8c7864",
                  marginBottom: 4
                }}
              >
                Admin Mode – story style & debug
              </p>
              <p style={{ fontSize: 12, color: "#8c7864" }}>
                You can tweak the system prompt for story style. If something
                breaks, just refresh the page to reset.
              </p>
              <textarea
                className="textarea"
                rows={6}
                placeholder="Custom system prompt for story style (optional). Leave empty to use the default preset."
                value={stylePrompt}
                onChange={(e) => setStylePrompt(e.target.value)}
              />
              <div className="admin-debug">
                <div>Debug info (last API call)</div>
                <div>Words: {debugInfo.words.join(", ") || "(none)"}</div>
                <div>
                  Must-use: {debugInfo.mustUse.join(", ") || "(none)"}
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
