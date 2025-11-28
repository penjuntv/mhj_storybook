// components/storybook/Step2Story.js
//
// STEP 2: 아이 프로필 + 장소/행동 추천 + 동화 생성 UI
// - props.selectedWords : 선택된 단어 배열 (예: ["apple", "banana"])
// - props.language      : "ko" | "en" | "zh" (기본값 "ko")

import { useState } from "react";
import { getUIText } from "../../lib/uiText";
import StoryResult from "./StoryResult";

export default function Step2Story({ selectedWords = [], language = "ko" }) {
  const t = getUIText(language);

  const [kidName, setKidName] = useState("");
  const [kidAge, setKidAge] = useState("");
  const [povMode, setPovMode] = useState("first"); // "first" | "third"

  const [place, setPlace] = useState("");
  const [action, setAction] = useState("");
  const [ending, setEnding] = useState("");

  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [actionSuggestions, setActionSuggestions] = useState([]);

  const [isIdeasLoading, setIsIdeasLoading] = useState(false);
  const [isStoryLoading, setIsStoryLoading] = useState(false);

  const [ideasError, setIdeasError] = useState("");
  const [storyError, setStoryError] = useState("");
  const [story, setStory] = useState("");

  const hasEnoughWords = selectedWords && selectedWords.length >= 2;

  // AI에게 장소/행동 아이디어 요청
  const handleAskIdeas = async () => {
    setIdeasError("");
    setPlaceSuggestions([]);
    setActionSuggestions([]);

    if (!hasEnoughWords) {
      // uiText에 전용 문구가 있으면 사용, 없으면 fallback
      const msg =
        t.ideasTooFewWords ||
        t.storyTooFewWords ||
        "단어를 두 개 이상 고른 뒤에 눌러 주세요.";
      setIdeasError(msg);
      return;
    }

    try {
      setIsIdeasLoading(true);
      const res = await fetch("/api/storyIdeas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: selectedWords }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch story ideas");
      }

      const data = await res.json();
      setPlaceSuggestions(data.places || []);
      setActionSuggestions(data.actions || []);
    } catch (err) {
      console.error("Error in handleAskIdeas:", err);
      setIdeasError(
        err.message || "AI 장소·행동 아이디어를 가져오는 중 오류가 발생했습니다."
      );
    } finally {
      setIsIdeasLoading(false);
    }
  };

  // 동화 생성
  const handleCreateStory = async () => {
    setStoryError("");
    setStory("");

    if (!hasEnoughWords) {
      const msg =
        t.storyTooFewWords ||
        "단어를 두 개 이상 선택한 뒤, AI에게 동화를 만들어 달라고 요청해 주세요.";
      setStoryError(msg);
      return;
    }

    try {
      setIsStoryLoading(true);

      const povText =
        povMode === "first" ? t.povFirstPerson || "" : t.povThirdPerson || "";

      const body = {
        words: selectedWords,
        idea: {
          character: kidName || "a child",
          age: kidAge || "",
          pov: povMode,
          povText,
          place: place || "",
          event: action || "",
          ending: ending || "",
        },
      };

      const res = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create story");
      }

      const data = await res.json();
      setStory(data.story || "");
    } catch (err) {
      console.error("Error in handleCreateStory:", err);
      setStoryError(
        err.message || "동화를 만드는 중 오류가 발생했습니다. 다시 시도해 주세요."
      );
    } finally {
      setIsStoryLoading(false);
    }
  };

  // 스타일 (index.js와 톤 맞춤)
  const boxStyle = {
    background: "#FFF9F3",
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
  };

  const labelStyle = {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
    color: "#6B4A2A",
  };

  const inputStyle = {
    width: "100%",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.08)",
    padding: "8px 12px",
    fontSize: 13,
    background: "#FFFFFF",
    boxSizing: "border-box",
  };

  const chipBtn = {
    borderRadius: 999,
    padding: "6px 12px",
    border: "none",
    background: "#FFEBD7",
    fontSize: 13,
    cursor: "pointer",
    marginRight: 8,
    marginBottom: 8,
    color: "#5E3B20",
  };

  const primaryButton = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 20px",
    borderRadius: 999,
    border: "none",
    background: "#FF9F4A",
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(255,159,74,0.35)",
  };

  const secondaryButton = {
    ...primaryButton,
    background: "#FFE0B5",
    color: "#7A4B16",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  };

  const errorTextStyle = {
    marginTop: 8,
    fontSize: 13,
    color: "#C0392B",
  };

  return (
    <section
      style={{
        background: "#FFF3E1",
        borderRadius: 24,
        padding: 24,
        marginTop: 24,
        boxShadow: "0 18px 45px rgba(0,0,0,0.04)",
      }}
    >
      {/* STEP 2 타이틀 */}
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
          marginBottom: 12,
        }}
      >
        {t.step2Title}
      </div>

      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {t.step2Subtitle}
      </h2>

      {/* 아이 프로필 박스 */}
      <div style={boxStyle}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 10,
            color: "#6B4A2A",
          }}
        >
          {t.profileSectionTitle}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <div style={labelStyle}>{t.kidNameLabel}</div>
            <input
              type="text"
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              placeholder="Yujin"
              style={inputStyle}
            />
          </div>
          <div>
            <div style={labelStyle}>{t.kidAgeLabel}</div>
            <input
              type="text"
              value={kidAge}
              onChange={(e) => setKidAge(e.target.value)}
              placeholder="4"
              style={inputStyle}
            />
          </div>
        </div>

        {/* 시점 토글 */}
        <div>
          <div style={labelStyle}>{t.povLabel}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setPovMode("first")}
              style={{
                ...secondaryButton,
                padding: "6px 14px",
                background: povMode === "first" ? "#FF9F4A" : "#FFE0B5",
                color: povMode === "first" ? "#fff" : "#7A4B16",
                boxShadow:
                  povMode === "first"
                    ? "0 10px 22px rgba(255,159,74,0.4)"
                    : "0 8px 18px rgba(0,0,0,0.05)",
              }}
            >
              {t.povFirstPerson}
            </button>
            <button
              type="button"
              onClick={() => setPovMode("third")}
              style={{
                ...secondaryButton,
                padding: "6px 14px",
                background: povMode === "third" ? "#FF9F4A" : "#FFE0B5",
                color: povMode === "third" ? "#fff" : "#7A4B16",
                boxShadow:
                  povMode === "third"
                    ? "0 10px 22px rgba(255,159,74,0.4)"
                    : "0 8px 18px rgba(0,0,0,0.05)",
              }}
            >
              {t.povThirdPerson}
            </button>
          </div>
        </div>
      </div>

      {/* 장소·행동 추천 + 입력 영역 */}
      <div style={{ marginTop: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#6B4A2A",
            }}
          >
            {t.ideasButton}
          </div>
          <button
            type="button"
            onClick={handleAskIdeas}
            style={secondaryButton}
            disabled={isIdeasLoading}
          >
            {isIdeasLoading ? t.loading : t.ideasButton}
          </button>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#8B6A49",
            marginBottom: 10,
          }}
        >
          {t.ideasCaption}
        </div>

        {/* 장소 / 행동 / 엔딩 입력 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <div>
            <div style={labelStyle}>{t.placeLabel}</div>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              style={inputStyle}
            />
            {/* 장소 추천 칩 */}
            {placeSuggestions.length > 0 && (
              <div style={{ marginTop: 6 }}>
                {placeSuggestions.map((p) => (
                  <button
                    key={p}
                    type="button"
                    style={chipBtn}
                    onClick={() => setPlace(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={labelStyle}>{t.actionLabel}</div>
            <input
              type="text"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              style={inputStyle}
            />
            {/* 행동 추천 칩 */}
            {actionSuggestions.length > 0 && (
              <div style={{ marginTop: 6 }}>
                {actionSuggestions.map((a) => (
                  <button
                    key={a}
                    type="button"
                    style={chipBtn}
                    onClick={() => setAction(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={labelStyle}>{t.endingLabel}</div>
            <input
              type="text"
              value={ending}
              onChange={(e) => setEnding(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {ideasError && <div style={errorTextStyle}>{ideasError}</div>}
      </div>

      {/* AI에게 동화 만들기 요청 버튼 */}
      <div style={{ marginTop: 20 }}>
        <button
          type="button"
          onClick={handleCreateStory}
          style={primaryButton}
          disabled={isStoryLoading}
        >
          {isStoryLoading ? t.loading : t.askButton}
        </button>
        {storyError && <div style={errorTextStyle}>{storyError}</div>}
      </div>

      {/* 동화 결과 */}
      {story && (
        <div style={{ marginTop: 18 }}>
          <StoryResult title={t.resultTitle} story={story} />
        </div>
      )}
    </section>
  );
}
