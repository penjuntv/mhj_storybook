// components/storybook/Step2Story.js

import React from "react";

const POV_OPTIONS = [
  { id: "first", label: "내가 이야기의 주인공 (1인칭)" },
  { id: "third", label: "내가 들려주는 이야기 (3인칭)" },
];

const THEMES = [
  { id: "everyday", label: "일상 모험", emoji: "🏠" },
  { id: "school", label: "학교 이야기", emoji: "🏫" },
  { id: "family", label: "가족", emoji: "👨‍👩‍👧" },
  { id: "friends", label: "친구", emoji: "🧑‍🤝‍🧑" },
  { id: "animals", label: "동물", emoji: "🐶" },
  { id: "princess", label: "공주", emoji: "👑" },
  { id: "hero", label: "영웅", emoji: "🦸" },
  { id: "fairytale", label: "전래동화", emoji: "📜" },
  { id: "animation", label: "애니메이션 느낌", emoji: "🎬" },
  { id: "space", label: "우주 / SF", emoji: "🚀" },
];

const LENGTH_OPTIONS = [
  { id: "short", label: "숏 (아주 짧게)" },
  { id: "normal", label: "노멀 (보통 길이)" },
  { id: "long", label: "롱 (조금 길게)" },
];

export default function Step2Story({
  kidName,
  setKidName,
  pov,
  setPov,
  themeId,
  setThemeId,
  length,
  setLength,
  selectedWords,
  onRequestStory,
  isRequesting,
}) {
  const wordCount = selectedWords.length;

  return (
    <section
      style={{
        marginTop: 56,
        padding: 32,
        borderRadius: 36,
        background: "#fff6e8",
        boxShadow: "0 14px 40px rgba(214, 150, 90, 0.18)",
      }}
    >
      <h2
        style={{
          fontSize: 26,
          fontWeight: 700,
          marginBottom: 8,
          color: "#4a2d1a",
        }}
      >
        STEP 2 · AI가 만든 영어 동화
      </h2>
      <p
        style={{
          fontSize: 15,
          color: "#7a5b3c",
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        아이 이름과 이야기 방식을 고르고, 동화의 테마와 길이를 선택해 주세요.
        단어{" "}
        <strong style={{ fontWeight: 700 }}>
          {wordCount}개
        </strong>{" "}
        를 골라 두면, AI가 아이 눈높이에 맞춰 동화를 만들어 줍니다.
      </p>

      {/* 이름 */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#4a2d1a",
            marginBottom: 8,
          }}
        >
          이름 (예: Yujin) <span style={{ fontWeight: 400 }}>(선택)</span>
        </div>
        <input
          type="text"
          placeholder="예: yujin"
          value={kidName}
          onChange={(e) => setKidName && setKidName(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 320,
            padding: "12px 16px",
            borderRadius: 999,
            border: "1px solid #e1c8aa",
            fontSize: 16,
            outline: "none",
          }}
        />
      </div>

      {/* 이야기 방식 */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#4a2d1a",
            marginBottom: 10,
          }}
        >
          이야기 방식
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {POV_OPTIONS.map((opt) => {
            const active = pov === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPov && setPov(opt.id)}
                style={{
                  borderRadius: 999,
                  border: "1px solid",
                  borderColor: active ? "#f29b4b" : "#e1c8aa",
                  background: active ? "#ffe3c0" : "#fff",
                  padding: "8px 14px",
                  fontSize: 14,
                  cursor: "pointer",
                  color: active ? "#8b4a1d" : "#5d4631",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 이야기 테마 */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#4a2d1a",
            marginBottom: 10,
          }}
        >
          이야기 테마 고르기
        </div>
        <p
          style={{
            fontSize: 14,
            color: "#937254",
            marginBottom: 10,
          }}
        >
          공주, 가족, 전래동화, 애니메이션 느낌 등 아이가 좋아하는 분위기를 골라 보세요.
          선택한 단어 + 테마가 섞여서 동화의 톤이 정해집니다.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {THEMES.map((t) => {
            const active = themeId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeId && setThemeId(t.id)}
                style={{
                  borderRadius: 999,
                  border: "1px solid",
                  borderColor: active ? "#f29b4b" : "#e1c8aa",
                  background: active ? "#ffe3c0" : "#fff",
                  padding: "8px 14px",
                  fontSize: 14,
                  cursor: "pointer",
                  color: active ? "#8b4a1d" : "#5d4631",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 이야기 길이 */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#4a2d1a",
            marginBottom: 10,
          }}
        >
          이야기 길이
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {LENGTH_OPTIONS.map((opt) => {
            const active = length === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLength && setLength(opt.id)}
                style={{
                  borderRadius: 999,
                  border: "1px solid",
                  borderColor: active ? "#f29b4b" : "#e1c8aa",
                  background: active ? "#ffe3c0" : "#fff",
                  padding: "8px 14px",
                  fontSize: 14,
                  cursor: "pointer",
                  color: active ? "#8b4a1d" : "#5d4631",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 버튼 */}
      <button
        type="button"
        onClick={onRequestStory}
        disabled={isRequesting || !wordCount}
        style={{
          marginTop: 8,
          padding: "12px 28px",
          borderRadius: 999,
          border: "none",
          background: isRequesting || !wordCount ? "#d9c3a8" : "#ff9a4b",
          color: "#fff",
          fontSize: 16,
          fontWeight: 700,
          cursor: isRequesting || !wordCount ? "default" : "pointer",
          boxShadow:
            isRequesting || !wordCount
              ? "none"
              : "0 10px 24px rgba(224, 130, 40, 0.45)",
        }}
      >
        {isRequesting
          ? "동화를 만드는 중이에요..."
          : "AI에게 영어 동화 만들기 요청하기"}
      </button>
      {wordCount === 0 && (
        <p
          style={{
            marginTop: 8,
            fontSize: 13,
            color: "#a07349",
          }}
        >
          먼저 STEP 1에서 오늘 배운 영어 단어를 2~8개 선택해 주세요.
        </p>
      )}
    </section>
  );
}
