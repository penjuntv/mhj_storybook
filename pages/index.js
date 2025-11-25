// pages/index.js

import { useState } from "react";

export default function HomePage() {
  const [wordsText, setWordsText] = useState("");
  const [mainCharacter, setMainCharacter] = useState("");
  const [place, setPlace] = useState("");
  const [problem, setProblem] = useState("");
  const [ending, setEnding] = useState("");
  const [length, setLength] = useState("normal"); // "shorter" | "normal" | "longer"

  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleCreateStory(selectedLength = "normal") {
    setLength(selectedLength);
    setIsLoading(true);
    setErrorMsg("");
    setStory("");

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wordsText,
          mainCharacter,
          place,
          problem,
          ending,
          length: selectedLength,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Story API error");
        return;
      }

      setStory(data.story);
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error while calling /api/story");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 16px",
        display: "flex",
        justifyContent: "center",
        background: "#f7f3ee",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.07)",
          padding: "32px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "4px",
          }}
        >
          🎨 AI Storybook – Tell a story with today&apos;s words
        </h1>
        <p style={{ marginBottom: "24px", color: "#666", fontSize: "14px" }}>
          Type the English words you learned today, then build a short story
          together. 오늘 배운 영어 단어를 넣고, 아이와 함께 아주 쉬운 영어
          동화를 만들어 보세요.
        </p>

        {/* STEP 1 */}
        <section
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: "#fff7f1",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>
            STEP 1 · Today&apos;s words
          </h2>
          <p style={{ fontSize: "13px", color: "#555", marginBottom: "8px" }}>
            Type the English words you learned today. Separate each word with a
            comma or new line. 오늘 배운 영어 단어를 입력해주세요. 쉼표(,)나 줄바꿈으로
            구분해 주세요.
          </p>
          <textarea
            value={wordsText}
            onChange={(e) => setWordsText(e.target.value)}
            rows={3}
            placeholder="e.g. apple, banana, cat, dog"
            style={{
              width: "100%",
              fontSize: "14px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              resize: "vertical",
            }}
          />
        </section>

        {/* STEP 2 */}
        <section
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: "#f3f5ff",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>
            STEP 2 · Tell me your story idea
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#555",
              marginBottom: "12px",
            }}
          >
            Answer in simple English. A parent can type for the child.
            아이가 말한 내용을 그대로 영어로 옮겨 적어도 되고, 부모가 대신 간단히
            써주어도 됩니다.
          </p>

          <div style={{ marginBottom: "8px" }}>
            <label
              style={{ fontSize: "13px", fontWeight: 600, display: "block" }}
            >
              1) Who is the main character?
            </label>
            <input
              type="text"
              value={mainCharacter}
              onChange={(e) => setMainCharacter(e.target.value)}
              placeholder="e.g. Yujin, a brave girl"
              style={{
                width: "100%",
                fontSize: "14px",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ marginBottom: "8px" }}>
            <label
              style={{ fontSize: "13px", fontWeight: 600, display: "block" }}
            >
              2) Where does the story happen?
            </label>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="e.g. in the yard with a cat and a dog"
              style={{
                width: "100%",
                fontSize: "14px",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ marginBottom: "8px" }}>
            <label
              style={{ fontSize: "13px", fontWeight: 600, display: "block" }}
            >
              3) What happens? (problem or event)
            </label>
            <input
              type="text"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. they play basketball together"
              style={{
                width: "100%",
                fontSize: "14px",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label
              style={{ fontSize: "13px", fontWeight: 600, display: "block" }}
            >
              4) How do you want the story to end?
            </label>
            <input
              type="text"
              value={ending}
              onChange={(e) => setEnding(e.target.value)}
              placeholder="e.g. everyone is happy and still friends"
              style={{
                width: "100%",
                fontSize: "14px",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          {/* 버튼들 */}
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              onClick={() => handleCreateStory("normal")}
              disabled={isLoading}
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                border: "none",
                background: "#7b5cff",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "Making story..." : "Create story"}
            </button>
            <button
              onClick={() => handleCreateStory("shorter")}
              disabled={isLoading}
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                border: "none",
                background: "#eee",
                color: "#444",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Shorter
            </button>
            <button
              onClick={() => handleCreateStory("longer")}
              disabled={isLoading}
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                border: "none",
                background: "#eee",
                color: "#444",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Longer
            </button>
          </div>

          {errorMsg && (
            <p
              style={{
                marginTop: "10px",
                color: "#c0392b",
                fontSize: "13px",
              }}
            >
              Error: {errorMsg}
            </p>
          )}
        </section>

        {/* STEP 3 – 결과 스토리 */}
        <section
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: "#f9fafb",
          }}
        >
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>
            STEP 3 · Your AI story
          </h2>
          {story ? (
            <p
              style={{
                whiteSpace: "pre-line",
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#333",
              }}
            >
              {story}
            </p>
          ) : (
            <p style={{ fontSize: "13px", color: "#777" }}>
              After you click &quot;Create story&quot;, your child&apos;s simple
              English story will appear here. 동화 만들기를 누르면, 아이의 동화가
              여기에 나타납니다.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
