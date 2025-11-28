// components/storybook/Step2Story.js
import React from "react";
import { STORY_THEMES } from "../../data/storyThemes";

export default function Step2Story({
  t,
  language,
  selectedWords,
  kidName,
  setKidName,
  pov,
  setPov,
  themeId,
  setThemeId,
  length,
  setLength,
  onAskStory,
  isRequesting,
}) {
  const canRequest = selectedWords && selectedWords.length > 0 && !isRequesting;

  const handleSubmit = () => {
    if (!canRequest) return;
    onAskStory({
      kidName: kidName?.trim(),
      pov, // "first" | "third"
      themeId,
      length, // "short" | "normal" | "long"
    });
  };

  const renderChip = (active, label, onClick) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "10px 16px",
        borderRadius: "999px",
        border: active ? "0" : "1px solid rgba(180, 132, 96, 0.4)",
        backgroundColor: active ? "#ff9448" : "#fff6eb",
        color: active ? "#fff" : "#5b3b28",
        fontSize: "14px",
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        boxShadow: active
          ? "0 6px 14px rgba(0,0,0,0.15)"
          : "0 2px 6px rgba(0,0,0,0.05)",
        transition: "all 0.15s ease-out",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );

  return (
    <section
      style={{
        marginTop: "56px",
        padding: "32px 32px 40px",
        borderRadius: "32px",
        background:
          "linear-gradient(135deg, #fdf1e2 0%, #ffe9d2 40%, #ffece1 100%)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
      }}
    >
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 800,
          marginBottom: "6px",
          color: "#5b3b28",
        }}
      >
        {t.step2Title}
      </h2>
      <p
        style={{
          fontSize: "15px",
          lineHeight: 1.5,
          color: "#7b5a3b",
          marginBottom: "24px",
        }}
      >
        {t.step2Subtitle}
      </p>

      {/* 프로필 & 시점 */}
      <div
        style={{
          padding: "20px 20px 18px",
          borderRadius: "24px",
          backgroundColor: "rgba(255,255,255,0.9)",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#5b3b28",
            marginBottom: "12px",
          }}
        >
          {t.profileSectionTitle}
        </h3>

        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 220px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                color: "#8b6b4a",
                marginBottom: "6px",
              }}
            >
              {t.kidNameLabel}
            </label>
            <input
              type="text"
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "999px",
                border: "1px solid rgba(194, 151, 118, 0.7)",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ flex: "1 1 260px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                color: "#8b6b4a",
                marginBottom: "6px",
              }}
            >
              {t.povLabel}
            </label>
            <div
              style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
            >
              {renderChip(
                pov === "first",
                t.povFirstPerson,
                () => setPov("first")
              )}
              {renderChip(
                pov === "third",
                t.povThirdPerson,
                () => setPov("third")
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 테마 선택 */}
      <div
        style={{
          padding: "20px 20px 18px",
          borderRadius: "24px",
          backgroundColor: "rgba(255,255,255,0.95)",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#5b3b28",
            marginBottom: "6px",
          }}
        >
          {t.themeTitle}
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "#a17a53",
            marginBottom: "12px",
          }}
        >
          {t.themeSubtitle}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {STORY_THEMES.map((theme) => {
            const active = themeId === theme.id;
            const label =
              (t.themes && t.themes[theme.id]) || theme.id;
            return renderChip(active, `${theme.emoji} ${label}`, () =>
              setThemeId(theme.id)
            );
          })}
        </div>
      </div>

      {/* 길이 선택 */}
      <div
        style={{
          padding: "18px 20px 20px",
          borderRadius: "24px",
          backgroundColor: "rgba(255,255,255,0.9)",
          marginBottom: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#5b3b28",
            marginBottom: "10px",
          }}
        >
          {t.lengthTitle}
        </h3>
        <div
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          {renderChip(
            length === "short",
            t.lengthShort,
            () => setLength("short")
          )}
          {renderChip(
            length === "normal",
            t.lengthNormal,
            () => setLength("normal")
          )}
          {renderChip(
            length === "long",
            t.lengthLong,
            () => setLength("long")
          )}
        </div>
      </div>

      {/* 요청 버튼 & 선택 단어 안내 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            color: "#8b6b4a",
          }}
        >
          {selectedWords.length === 0
            ? t.mustSelectWords
            : `${selectedWords.length} word(s) selected`}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canRequest}
          style={{
            padding: "13px 26px",
            borderRadius: "999px",
            border: "none",
            cursor: canRequest ? "pointer" : "not-allowed",
            background: canRequest
              ? "linear-gradient(135deg,#ff9448,#ff7b3a)"
              : "#d9c4b0",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 700,
            boxShadow: canRequest
              ? "0 10px 22px rgba(0,0,0,0.18)"
              : "none",
            transition: "transform 0.1s ease-out, box-shadow 0.1s ease-out",
          }}
        >
          {isRequesting ? t.loadingStory : t.askButton}
        </button>
      </div>
    </section>
  );
}
