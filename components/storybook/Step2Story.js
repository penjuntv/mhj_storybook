// components/storybook/Step2Story.js
import React, { useState } from "react";

export default function Step2Story({ language, t, selectedWords }) {
  const [kidName, setKidName] = useState("");
  const [kidAge, setKidAge] = useState("");
  const [pov, setPov] = useState("first"); // 'first' | 'third'

  const [place, setPlace] = useState("");
  const [action, setAction] = useState("");
  const [ending, setEnding] = useState("");

  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [actionSuggestions, setActionSuggestions] = useState([]);

  const [story, setStory] = useState("");
  const [storyError, setStoryError] = useState("");
  const [isStoryLoading, setIsStoryLoading] = useState(false);

  const [ideasError, setIdeasError] = useState("");
  const [isIdeasLoading, setIsIdeasLoading] = useState(false);

  const wordsForApi = selectedWords.map((w) => w.word);
  const mustIncludeWords = selectedWords
    .filter((w) => w.mustInclude)
    .map((w) => w.word);

  // AI에게 장소/행동 추천 받기
  const handleGetIdeas = async () => {
    setIdeasError("");

    if (wordsForApi.length < 2) {
      setIdeasError(t.ideasTooFewWords);
      return;
    }

    try {
      setIsIdeasLoading(true);
      const res = await fetch("/api/storyIdeas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: wordsForApi }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to call /api/storyIdeas");
      }

      const data = await res.json();
      setPlaceSuggestions(data.places || []);
      setActionSuggestions(data.actions || []);
    } catch (err) {
      console.error("Error in handleGetIdeas", err);
      setIdeasError(`${t.ideasErrorPrefix}${err.message || String(err)}`);
    } finally {
      setIsIdeasLoading(false);
    }
  };

  // 동화 생성
  const handleRequestStory = async () => {
    setStory("");
    setStoryError("");

    if (wordsForApi.length < 2) {
      setStoryError("단어는 최소 2개 이상 선택해 주세요.");
      return;
    }

    try {
      setIsStoryLoading(true);

      const res = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: wordsForApi,
          mustIncludeWords,
          place,
          action,
          ending,
          language,
          profile: {
            kidName: kidName || "",
            kidAge: kidAge || "",
            pov, // 'first' or 'third'
          },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to call /api/storybook");
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStory(data.story || "");
    } catch (err) {
      console.error("Error generating story", err);
      setStoryError(err.message || "스토리를 생성하는 중 오류가 발생했습니다.");
    } finally {
      setIsStoryLoading(false);
    }
  };

  const sectionBox = {
    background: "#FDF1DE",
    borderRadius: 24,
    padding: 24,
    marginTop: 24,
  };

  const inputBase = {
    width: "100%",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.08)",
    padding: "8px 12px",
    fontSize: 13,
    background: "#FFFDF8",
    boxSizing: "border-box",
  };

  return (
    <section style={sectionBox}>
      <div
        style={{
          display: "inline-block",
          padding: "6px 14px",
          borderRadius: 999,
          background: "#E3F2FF",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#255981",
          marginBottom: 16,
        }}
      >
        STEP 2 · AI가 만든 영어 동화
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
        {t.step2Title}
      </h2>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "#6A4D33",
          marginBottom: 16,
        }}
      >
        {t.step2Subtitle}
      </p>

      {/* 아이 프로필 */}
      <div
        style={{
          background: "#F6F4FF",
          borderRadius: 18,
          padding: 16,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 8,
            color: "#4C3A6B",
          }}
        >
          {t.profileSectionTitle}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                marginBottom: 4,
                color: "#5D4A76",
              }}
            >
              {t.kidNameLabel}
            </label>
            <input
              type="text"
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              style={inputBase}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                marginBottom: 4,
                color: "#5D4A76",
              }}
            >
              {t.kidAgeLabel}
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={kidAge}
              onChange={(e) => setKidAge(e.target.value)}
              style={inputBase}
            />
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 12,
              marginBottom: 4,
              color: "#5D4A76",
              fontWeight: 600,
            }}
          >
            {t.povLabel}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => setPov("first")}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: "none",
                fontSize: 12,
                cursor: "pointer",
                background: pov === "first" ? "#FF9F4A" : "#FFFDF8",
                color: pov === "first" ? "#fff" : "#5D4A76",
                boxShadow:
                  pov === "first"
                    ? "0 0 0 2px rgba(255,159,74,0.45)"
                    : "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              {t.povFirstPerson}
            </button>
            <button
              type="button"
              onClick={() => setPov("third")}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: "none",
                fontSize: 12,
                cursor: "pointer",
                background: pov === "third" ? "#FF9F4A" : "#FFFDF8",
                color: pov === "third" ? "#fff" : "#5D4A76",
                boxShadow:
                  pov === "third"
                    ? "0 0 0 2px rgba(255,159,74,0.45)"
                    : "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              {t.povThirdPerson}
            </button>
          </div>
        </div>
      </div>

      {/* 아이디어 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#7A5A3A",
          }}
        >
          {t.ideasButton}
        </div>
        <button
          type="button"
          onClick={handleGetIdeas}
          disabled={isIdeasLoading}
          style={{
            padding: "8px 16px",
            borderRadius: 999,
            border: "none",
            background: "#FF9F4A",
            color: "#fff",
            fontWeight: 600,
            cursor: isIdeasLoading ? "default" : "pointer",
            boxShadow: "0 10px 24px rgba(255,159,74,0.35)",
            fontSize: 13,
          }}
        >
          {isIdeasLoading ? t.ideasLoading : t.ideasButton}
        </button>
      </div>
      <p
        style={{
          fontSize: 12,
          color: "#8B6A49",
          marginBottom: 12,
        }}
      >
        {t.ideasCaption}
      </p>
      {ideasError && (
        <div
          style={{
            fontSize: 12,
            color: "#C0392B",
            marginBottom: 10,
          }}
        >
          {ideasError}
        </div>
      )}

      {/* 장소 / 행동 / 엔딩 입력 + 추천 칩 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: 8,
        }}
      >
        {/* place */}
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 4,
              color: "#7A5A3A",
            }}
          >
            {t.placeLabel}
          </div>
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            style={inputBase}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginTop: 6,
            }}
          >
            {placeSuggestions.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlace(p)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "0",
                  background: "#FFF9F3",
                  fontSize: 12,
                  cursor: "pointer",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* action */}
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 4,
              color: "#7A5A3A",
            }}
          >
            {t.actionLabel}
          </div>
          <input
            type="text"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            style={inputBase}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginTop: 6,
            }}
          >
            {actionSuggestions.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAction(a)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "0",
                  background: "#FFF9F3",
                  fontSize: 12,
                  cursor: "pointer",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* ending */}
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 4,
              color: "#7A5A3A",
            }}
          >
            {t.endingLabel}
          </div>
          <input
            type="text"
            value={ending}
            placeholder={t.endingPlaceholder}
            onChange={(e) => setEnding(e.target.value)}
            style={inputBase}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 4,
          fontSize: 12,
          color: "#8B6A49",
          marginBottom: 12,
        }}
      >
        {t.suggestionsCaption}
      </div>

      {/* 동화 생성 버튼 */}
      <button
        type="button"
        onClick={handleRequestStory}
        disabled={isStoryLoading}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 20px",
          borderRadius: 999,
          border: "none",
          background: isStoryLoading ? "#FFBF80" : "#FF9F4A",
          color: "#FFFFFF",
          fontSize: 15,
          fontWeight: 700,
          cursor: isStoryLoading ? "default" : "pointer",
          boxShadow: "0 12px 30px rgba(255,159,74,0.35)",
          marginBottom: 12,
        }}
      >
        {isStoryLoading ? t.loading : t.askButton}
      </button>

      {storyError && (
        <div
          style={{
            marginTop: 8,
            fontSize: 13,
            color: "#C0392B",
            padding: "8px 12px",
            borderRadius: 12,
            background: "#FDECEA",
          }}
        >
          {t.errorPrefix}
          {storyError}
        </div>
      )}

      {story && (
        <div
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 18,
            background: "#FFF9F0",
            fontSize: 14,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: 6,
              fontSize: 15,
            }}
          >
            {t.resultTitle}
          </div>
          {story}
        </div>
      )}
    </section>
  );
}
