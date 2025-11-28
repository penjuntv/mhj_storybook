// components/storybook/Step2Story.js
// STEP 2 UI – 아이 이름, 이야기 방식, 테마, 길이 선택

import React from "react";

const THEMES = [
  { id: "everyday", emoji: "🏡", label: "일상 모험" },
  { id: "school", emoji: "🏫", label: "학교 이야기" },
  { id: "family", emoji: "👨‍👩‍👧", label: "가족" },
  { id: "friends", emoji: "🧑‍🤝‍🧑", label: "친구" },
  { id: "animals", emoji: "🐶", label: "동물" },
  { id: "princess", emoji: "👑", label: "공주" },
  { id: "hero", emoji: "🦸", label: "영웅" },
  { id: "fairytale", emoji: "📖", label: "전래동화" },
  { id: "anime", emoji: "🎬", label: "애니메이션 느낌" },
  { id: "space", emoji: "🚀", label: "우주 / SF" },
];

const LENGTHS = [
  { id: "short", label: "숏 (아주 짧게)" },
  { id: "normal", label: "노멀 (보통 길이)" },
  { id: "long", label: "롱 (조금 길게)" },
];

export default function Step2Story({
  t,
  kidName,
  setKidName,
  pov,
  setPov,
  themeId,
  setThemeId,
  length,
  setLength,
  onSubmit,
  isRequesting,
}) {
  return (
    <>
      <section className="step2">
        <h2 className="step2-title">{t.step2Title}</h2>
        <p className="step2-sub">
          아이 이름과 이야기 방식을 고르고, 동화의 테마와 길이를 선택해 주세요. 단어 2개
          이상을 고르면, AI가 아이 눈높이에 맞춰 동화를 만들어 줍니다.
        </p>

        {/* 이름 */}
        <div className="field-group">
          <label className="field-label">
            이름 (예: Yujin) <span className="field-hint">(선택)</span>
          </label>
          <input
            className="text-input"
            placeholder="예: yujin"
            value={kidName}
            onChange={(e) => setKidName(e.target.value)}
          />
        </div>

        {/* 이야기 방식 */}
        <div className="field-group">
          <div className="field-label">이야기 방식</div>
          <div className="pill-row">
            <button
              type="button"
              className={`pill ${pov === "first" ? "pill--active" : ""}`}
              onClick={() => setPov("first")}
            >
              내가 이야기의 주인공 (1인칭)
            </button>
            <button
              type="button"
              className={`pill ${pov === "third" ? "pill--active" : ""}`}
              onClick={() => setPov("third")}
            >
              내가 들려주는 이야기 (3인칭)
            </button>
          </div>
        </div>

        {/* 테마 */}
        <div className="field-group">
          <div className="field-label">이야기 테마 고르기</div>
          <p className="field-help">
            공주, 가족, 전래동화, 애니메이션 느낌 등 아이가 좋아하는 분위기를 골라 보세요.
            선택한 단어 + 테마가 섞여서 동화의 톤이 정해집니다.
          </p>

          <div className="theme-grid">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={`theme-pill ${
                  themeId === theme.id ? "theme-pill--active" : ""
                }`}
                onClick={() => setThemeId(theme.id)}
              >
                <span className="theme-emoji">{theme.emoji}</span>
                <span className="theme-label">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 길이 */}
        <div className="field-group">
          <div className="field-label">이야기 길이</div>
          <div className="pill-row">
            {LENGTHS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`pill pill--length ${
                  length === opt.id ? "pill--active" : ""
                }`}
                onClick={() => setLength(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="actions">
          <button
            type="button"
            className="submit-btn"
            onClick={onSubmit}
            disabled={isRequesting}
          >
            {isRequesting ? "동화 만드는 중..." : "AI에게 영어 동화 만들기 요청하기"}
          </button>
        </div>
      </section>

      <style jsx>{`
        .step2 {
          margin-top: 64px;
          padding: 32px 40px 40px;
          border-radius: 32px;
          background: #ffe9cf;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.12);
        }

        .step2-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #5a3319;
          margin-bottom: 8px;
        }

        .step2-sub {
          font-size: 0.98rem;
          color: #8a6b52;
          margin-bottom: 28px;
        }

        .field-group {
          margin-bottom: 24px;
        }

        .field-label {
          font-size: 0.98rem;
          font-weight: 700;
          color: #5b3b26;
          margin-bottom: 8px;
        }

        .field-hint {
          font-weight: 400;
          font-size: 0.85rem;
          color: #a3876b;
        }

        .field-help {
          font-size: 0.9rem;
          color: #94755a;
          margin-bottom: 12px;
        }

        .text-input {
          width: 100%;
          max-width: 320px;
          padding: 12px 16px;
          border-radius: 999px;
          border: none;
          outline: none;
          font-size: 0.97rem;
          background: #fff6ea;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04);
        }

        .text-input:focus {
          box-shadow: 0 0 0 2px rgba(255, 153, 102, 0.9);
        }

        .pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .pill {
          border: none;
          cursor: pointer;
          border-radius: 999px;
          padding: 10px 18px;
          background: #ffe3c7;
          color: #6e4a2b;
          font-size: 0.92rem;
          font-weight: 600;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.1s ease-out, box-shadow 0.1s ease-out,
            background 0.1s ease-out;
        }

        .pill--length {
          min-width: 130px;
          text-align: center;
        }

        .pill--active {
          background: #ffb27a;
          color: #3f2614;
          box-shadow: 0 10px 26px rgba(255, 133, 76, 0.5);
          transform: translateY(-2px);
        }

        .theme-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
          margin-top: 6px;
        }

        .theme-pill {
          border-radius: 999px;
          border: none;
          padding: 10px 14px;
          background: #ffe3c7;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #6e4a2b;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.1s ease-out, box-shadow 0.1s ease-out,
            background 0.1s ease-out;
          white-space: nowrap;
        }

        .theme-emoji {
          font-size: 1.1rem;
        }

        .theme-label {
          flex: 1;
          text-align: left;
        }

        .theme-pill--active {
          background: #ffb27a;
          color: #3f2614;
          box-shadow: 0 10px 26px rgba(255, 133, 76, 0.5);
          transform: translateY(-2px);
        }

        .actions {
          margin-top: 24px;
          display: flex;
          justify-content: flex-start;
        }

        .submit-btn {
          border-radius: 999px;
          border: none;
          padding: 14px 32px;
          font-size: 1rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ff9a66, #ffb57f);
          color: #3a2210;
          cursor: pointer;
          box-shadow: 0 16px 40px rgba(255, 133, 76, 0.6);
          transition: transform 0.12s ease-out, box-shadow 0.12s ease-out,
            opacity 0.12s ease-out;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: default;
          box-shadow: none;
          transform: none;
        }

        .submit-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 50px rgba(255, 133, 76, 0.7);
        }

        @media (max-width: 960px) {
          .theme-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .step2 {
            padding: 24px 20px 28px;
          }
          .theme-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </>
  );
}
