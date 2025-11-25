// pages/index.js
import { useState } from "react";

export default function Home() {
  const [wordsInput, setWordsInput] = useState("");
  const [words, setWords] = useState([]);
  const [mustUse, setMustUse] = useState([]);
  const [answers, setAnswers] = useState({
    mainCharacter: "",
    place: "",
    problem: "",
    ending: "",
  });
  const [length, setLength] = useState("normal"); // "short" | "normal" | "long"
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1: 오늘 배운 단어 입력 → 칩으로 분리
  const handleWordsBlur = () => {
    const parts = wordsInput
      .split(/[,\\n]/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    setWords(parts);
    // 기존 mustUse 중에 없는 단어는 자동 제거
    setMustUse((prev) => prev.filter((w) => parts.includes(w)));
  };

  const toggleMustUse = (word) => {
    setMustUse((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  // Step 2: 폼 입력
  const handleAnswerChange = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  // 길이 버튼
  const handleLengthChange = (value) => {
    setLength(value);
  };

  // 스토리 생성
  const handleCreateStory = async () => {
    setErrorMsg("");
    setStory("");

    const trimmedWords = words.map((w) => w.trim()).filter(Boolean);

    if (trimmedWords.length === 0) {
      setErrorMsg("먼저 오늘 배운 영어 단어를 입력해 주세요.");
      return;
    }

    if (!answers.mainCharacter || !answers.place || !answers.problem) {
      setErrorMsg("Step 2의 질문을 모두 간단히 채워 주세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: trimmedWords,
          mustUse,
          answers,
          length,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "스토리 생성에 실패했습니다.");
      }

      const data = await res.json();
      setStory(data.story || "");
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff7ec",
        display: "flex",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          padding: 32,
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>
          🎨 AI Storybook – Tell a story with today&apos;s words
        </h1>
        <p style={{ color: "#666", marginBottom: 24 }}>
          오늘 배운 영어 단어와 아이의 상상력을 넣으면, 아주 쉬운 영어 동화를
          만들어 줍니다.
        </p>

        {/* STEP 1 */}
        <section
          style={{
            borderRadius: 12,
            padding: 20,
            background: "#fff3e0",
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>STEP 1 · Today&apos;s words</h2>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>
            Type the English words you learned today. Separate each word with a comma
            or new line.
          </p>
          <textarea
            value={wordsInput}
            onChange={(e) => setWordsInput(e.target.value)}
            onBlur={handleWordsBlur}
            placeholder={"e.g. apple, banana, cat, dog"}
            rows={3}
            style={{
              width: "100%",
              resize: "vertical",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 14,
            }}
          />

          {/* 단어 칩 */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, marginBottom: 4 }}>
              Word chips (click to mark as MUST-use)
            </div>
            <div style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>
              ★ = must use in the story. 단어를 클릭해 ★ 표시하면 동화 안에 꼭 넣어
              달라고 요청합니다.
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {words.map((w) => {
                const isMust = mustUse.includes(w);
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => toggleMustUse(w)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      border: isMust ? "1px solid #ff9800" : "1px solid #ccc",
                      background: isMust ? "#fff8e1" : "#f7f7f7",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    {isMust ? "★ " : ""}
                    {w}
                  </button>
                );
              })}
              {words.length === 0 && (
                <span style={{ fontSize: 13, color: "#aaa" }}>
                  아직 단어가 없습니다. 위에 입력 후 바깥을 클릭해 주세요.
                </span>
              )}
            </div>
          </div>
        </section>

        {/* STEP 2 */}
        <section
          style={{
            borderRadius: 12,
            padding: 20,
            background: "#e8f5e9",
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            STEP 2 · Tell me your story idea
          </h2>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 12 }}>
            Answer in simple English. A parent can type for the child.
            <br />
            아이가 말한 내용을 그대로 영어로 옮겨 적어도 되고, 부모가 대신 간단히
            써 주어도 됩니다.
          </p>

          <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>
            1) Who is the main character?
          </label>
          <input
            type="text"
            value={answers.mainCharacter}
            onChange={(e) => handleAnswerChange("mainCharacter", e.target.value)}
            placeholder="e.g. Yujin, a brave girl"
            style={inputStyle}
          />

          <label style={labelStyle}>
            2) Where does the story happen?
          </label>
          <input
            type="text"
            value={answers.place}
            onChange={(e) => handleAnswerChange("place", e.target.value)}
            placeholder="e.g. in the yard with a cat and a dog"
            style={inputStyle}
          />

          <label style={labelStyle}>
            3) What happens? (problem or event)
          </label>
          <input
            type="text"
            value={answers.problem}
            onChange={(e) => handleAnswerChange("problem", e.target.value)}
            placeholder="e.g. they play basketball together"
            style={inputStyle}
          />

          <label style={labelStyle}>
            4) How do you want the story to end?
          </label>
          <input
            type="text"
            value={answers.ending}
            onChange={(e) => handleAnswerChange("ending", e.target.value)}
            placeholder="e.g. everyone is happy and still friends"
            style={inputStyle}
          />

          {/* 길이 선택 + 버튼 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
              marginTop: 14,
            }}
          >
            <span style={{ fontSize: 13, color: "#555" }}>Story length:</span>
            <LengthButton
              label="Short"
              active={length === "short"}
              onClick={() => handleLengthChange("short")}
            />
            <LengthButton
              label="Normal"
              active={length === "normal"}
              onClick={() => handleLengthChange("normal")}
            />
            <LengthButton
              label="Long"
              active={length === "long"}
              onClick={() => handleLengthChange("long")}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={handleCreateStory}
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                border: "none",
                background: "#7b5cff",
                color: "#fff",
                fontSize: 15,
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating story..." : "Create story"}
            </button>
          </div>

          {errorMsg && (
            <div
              style={{
                marginTop: 12,
                color: "#d32f2f",
                fontSize: 13,
                whiteSpace: "pre-wrap",
              }}
            >
              {errorMsg}
            </div>
          )}
        </section>

        {/* STEP 3: 결과 */}
        <section
          style={{
            borderRadius: 12,
            padding: 20,
            background: "#f3e5f5",
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>STEP 3 · Your AI story</h2>
          {!story && !loading && (
            <p style={{ fontSize: 14, color: "#666" }}>
              위 단계들을 채운 뒤 &quot;Create story&quot; 버튼을 누르면, 여기 아주
              쉬운 영어 동화가 나타납니다.
            </p>
          )}
          {story && (
            <div
              style={{
                marginTop: 8,
                padding: 16,
                borderRadius: 12,
                background: "#fff",
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {story}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
  marginBottom: 10,
};

const labelStyle = {
  display: "block",
  fontSize: 14,
  marginBottom: 4,
  marginTop: 4,
};

function LengthButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        border: active ? "1px solid #7b5cff" : "1px solid #ccc",
        background: active ? "#ede7ff" : "#f7f7f7",
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
