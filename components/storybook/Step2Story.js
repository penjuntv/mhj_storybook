// components/storybook/Step2Story.js
import React from "react";

const THEMES = [
  { id: "everyday", emoji: "🏠", label: "일상 모험" },
  { id: "school", emoji: "🏫", label: "학교 이야기" },
  { id: "family", emoji: "👨‍👩‍👧", label: "가족" },
  { id: "friends", emoji: "🧑‍🤝‍🧑", label: "친구" },
  { id: "animals", emoji: "🐶", label: "동물" },
  { id: "princess", emoji: "👑", label: "공주" },
  { id: "hero", emoji: "🦸", label: "영웅" },
  { id: "fairy_tale", emoji: "📖", label: "전래동화" },
  { id: "animation", emoji: "🎬", label: "애니메이션 느낌" },
  { id: "space", emoji: "🚀", label: "우주 / SF" },
];

const LENGTH_OPTIONS = [
  { id: "short", label: "숏 (아주 짧게)" },
  { id: "normal", label: "노멀 (보통 길이)" },
  { id: "long", label: "롱 (조금 길게)" },
];

const POV_OPTIONS = [
  { id: "first", label: "내가 이야기의 주인공 (1인칭)" },
  { id: "third", label: "내가 들려주는 이야기 (3인칭)" },
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
  isRequesting,
  onAskStory,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRequesting) return;
    onAskStory();
  };

  return (
    <section className="step-section">
      <h2 className="step-title">
        STEP 2 · {t?.step2Title || "AI에게 영어 동화 만들어 달라고 하기"}
      </h2>
      <p className="step-subtitle">
        {t?.step2Subtitle ||
          "아이 이름, 시점, 테마를 고르고 AI에게 오늘의 단어로 동화를 부탁해 보세요."}
      </p>

      <form onSubmit={handleSubmit} className="story-profile-form">
        {/* 이름 */}
        <div className="field-group">
          <label className="field-label">
            {t?.kidNameLabel || "아이 이름"}{" "}
            <span className="field-label-optional">(선택)</span>
          </label>
          <input
            type="text"
            className="text-input"
            placeholder={t?.kidNamePlaceholder || "예: yujin"}
            value={kidName}
            onChange={(e) => setKidName(e.target.value)}
          />
        </div>

        {/* 시점 선택 */}
        <div className="field-group">
          <label className="field-label">
            {t?.povLabel || "이야기를 어떻게 들려줄까요?"}
          </label>
          <div className="pill-group">
            {POV_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={
                  "pill-button" + (pov === opt.id ? " pill-button--active" : "")
                }
                onClick={() => setPov(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 테마 선택 */}
        <div className="field-group">
          <label className="field-label">
            {t?.themeLabel || "이야기 테마 고르기"}
          </label>
          <p className="field-help">
            공주, 가족, 전래동화, 애니메이션 느낌 등 아이가 좋아하는 분위기를
            골라 보세요. 선택한 단어 + 테마가 섞여서 동화의 톤이 정해집니다.
          </p>
          <div className="pill-group pill-group--themes">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={
                  "pill-button pill-button--theme" +
                  (themeId === theme.id ? " pill-button--active" : "")
                }
                onClick={() => setThemeId(theme.id)}
              >
                <span className="pill-emoji">{theme.emoji}</span>
                <span>{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 길이 선택 */}
        <div className="field-group">
          <label className="field-label">
            {t?.lengthLabel || "이야기 길이"}
          </label>
          <div className="pill-group">
            {LENGTH_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={
                  "pill-button" +
                  (length === opt.id ? " pill-button--active" : "")
                }
                onClick={() => setLength(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="field-group field-group--submit">
          <button
            type="submit"
            className="primary-button"
            disabled={isRequesting}
          >
            {isRequesting
              ? t?.loading || "AI가 동화를 만드는 중..."
              : t?.askButton || "AI에게 영어 동화 만들어 달라고 요청하기"}
          </button>
        </div>
      </form>
    </section>
  );
}
