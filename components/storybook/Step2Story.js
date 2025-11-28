// components/storybook/Step2Story.js
import { useState } from "react";
import { getUIText } from "../../lib/uiText";

export default function Step2Story(props) {
  const {
    language = "ko",
    selectedWords: rawSelectedWords = [],
    onStoryGenerated,
    onStoryError,
  } = props;

  const t = getUIText(language);

  // selectedWords 형식 통일: { word, mustInclude }
  const selectedWords = Array.isArray(rawSelectedWords)
    ? rawSelectedWords.map((item) =>
        typeof item === "string"
          ? { word: item, mustInclude: false }
          : {
              word: item.word || "",
              mustInclude: Boolean(item.mustInclude),
            }
      )
    : [];

  const words = selectedWords
    .map((w) => (w.word || "").trim())
    .filter(Boolean);
  const mustIncludeWords = selectedWords
    .filter((w) => w.mustInclude)
    .map((w) => w.word.trim())
    .filter(Boolean);

  const [kidName, setKidName] = useState("");
  const [pov, setPov] = useState("first"); // "first" | "third"
  const [length, setLength] = useState("normal"); // "short" | "normal" | "long"

  const [place, setPlace] = useState("");
  const [action, setAction] = useState("");
  const [ending, setEnding] = useState("");

  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const [suggestedActions, setSuggestedActions] = useState([]);
  const [isIdeasLoading, setIsIdeasLoading] = useState(false);
  const [ideasError, setIdeasError] = useState("");

  const [story, setStory] = useState("");
  const [storyError, setStoryError] = useState("");
  const [isStoryLoading, setIsStoryLoading] = useState(false);

  // AI에게 장소·행동 아이디어 요청
  const handleAskIdeas = async () => {
    setIdeasError("");
    setSuggestedPlaces([]);
    setSuggestedActions([]);

    if (words.length < 2) {
      setIdeasError(t.storyTooFewWords);
      return;
    }

    try {
      setIsIdeasLoading(true);
      const res = await fetch("/api/storyIdeas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch story ideas");
      }

      const data = await res.json();
      const places = Array.isArray(data.places) ? data.places : [];
      const actions = Array.isArray(data.actions) ? data.actions : [];

      setSuggestedPlaces(places);
      setSuggestedActions(actions);

      // 비어 있을 때는 첫 번째 추천값을 기본값으로 세팅
      if (!place && places[0]) setPlace(places[0]);
      if (!action && actions[0]) setAction(actions[0]);
    } catch (err) {
      console.error("Error in handleAskIdeas", err);
      setIdeasError(
        (err && err.message) || "장소·행동 아이디어를 가져오는 중 오류가 발생했습니다."
      );
    } finally {
      setIsIdeasLoading(false);
    }
  };

  // 동화 생성 요청
  const handleRequestStory = async () => {
    setStory("");
    setStoryError("");
    onStoryError && onStoryError("");

    if (words.length < 2) {
      setStoryError(t.storyTooFewWords);
      onStoryError && onStoryError(t.storyTooFewWords);
      return;
    }

    try {
      setIsStoryLoading(true);

      const res = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words,
          mustIncludeWords,
          language,
          kidName: kidName || "",
          pov, // "first" or "third"
          length, // "short" | "normal" | "long"
          place,
          action,
          ending,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to call /api/storybook");
      }

      const data = await res.json();
      const newStory = data.story || "";

      setStory(newStory);
      onStoryGenerated && onStoryGenerated(newStory);
    } catch (err) {
      console.error("Error generating story", err);
      const msg =
        (err && err.message) ||
        "스토리를 생성하는 중 오류가 발생했습니다.";
      setStoryError(msg);
      onStoryError && onStoryError(msg);
    } finally {
      setIsStoryLoading(false);
    }
  };

  // 간단 스타일 (기존 레이아웃과 비슷하게)
  const styles = {
    section: {
      background: "#FFF8F0",
      borderRadius: 24,
      padding: 24,
      marginTop: 24,
      boxShadow: "0 14px 30px rgba(0,0,0,0.04)",
    },
    badge: {
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
    },
    label: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 4,
      color: "#7A5A3A",
    },
    textInput: {
      width: "100%",
      borderRadius: 999,
      border: "1px solid rgba(0,0,0,0.08)",
      padding: "8px 12px",
      fontSize: 13,
      background: "#FFFDF8",
      boxSizing: "border-box",
    },
    small: {
      fontSize: 12,
      color: "#8B6A49",
      marginTop: 4,
    },
    chipsRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
    },
    chipButton: (active) => ({
      borderRadius: 999,
      padding: "6px 12px",
      border: "none",
      fontSize: 13,
      cursor: "pointer",
      background: active ? "#FF9F4A" : "#FFE4C4",
      color: active ? "#FFFFFF" : "#5E3B20",
      boxShadow: active
        ? "0 0 0 2px rgba(255,159,74,0.35)"
        : "0 10px 20px rgba(0,0,0,0.06)",
    }),
    primaryButton: {
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
      marginTop: 12,
    },
    secondaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px 16px",
      borderRadius: 999,
      border: "none",
      background: "#FFD9A5",
      color: "#5E3B20",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
      marginBottom: 12,
    },
    errorText: {
      marginTop: 8,
      fontSize: 13,
      color: "#C0392B",
      padding: "8px 12px",
      borderRadius: 12,
      background: "#FDECEA",
    },
    storyBox: {
      marginTop: 18,
      padding: 16,
      borderRadius: 18,
      background: "#FFF9F0",
      fontSize: 14,
      lineHeight: 1.7,
      whiteSpace: "pre-wrap",
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.badge}>STEP 2 · AI STORY</div>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
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

      {/* 아이 정보 + 이야기 방식/길이 */}
      <div
        style={{
          background: "#F5F7FF",
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
            color: "#3F4A7A",
          }}
        >
          {t.profileSectionTitle}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div>
            <div style={styles.label}>{t.kidNameLabel}</div>
            <input
              type="text"
              style={styles.textInput}
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              placeholder="Yujin"
            />
          </div>

          <div>
            <div style={styles.label}>{t.lengthLabel}</div>
            <div style={styles.chipsRow}>
              <button
                type="button"
                style={styles.chipButton(length === "short")}
                onClick={() => setLength("short")}
              >
                {t.lengthShort}
              </button>
              <button
                type="button"
                style={styles.chipButton(length === "normal")}
                onClick={() => setLength("normal")}
              >
                {t.lengthNormal}
              </button>
              <button
                type="button"
                style={styles.chipButton(length === "long")}
                onClick={() => setLength("long")}
              >
                {t.lengthLong}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div style={styles.label}>{t.povLabel}</div>
          <div style={styles.chipsRow}>
            <button
              type="button"
              style={styles.chipButton(pov === "first")}
              onClick={() => setPov("first")}
            >
              {t.povFirstPerson}
            </button>
            <button
              type="button"
              style={styles.chipButton(pov === "third")}
              onClick={() => setPov("third")}
            >
              {t.povThirdPerson}
            </button>
          </div>
        </div>
      </div>

      {/* 장소/행동/엔딩 & 아이디어 버튼 */}
      <button
        type="button"
        style={styles.secondaryButton}
        onClick={handleAskIdeas}
        disabled={isIdeasLoading}
      >
        {isIdeasLoading ? t.loading : t.ideasButton}
      </button>
      <div style={styles.small}>{t.ideasCaption}</div>
      {ideasError && <div style={styles.errorText}>{ideasError}</div>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        <div>
          <div style={styles.label}>{t.placeLabel}</div>
          <input
            type="text"
            style={styles.textInput}
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />
          {suggestedPlaces.length > 0 && (
            <div style={styles.chipsRow}>
              {suggestedPlaces.map((p) => (
                <button
                  key={p}
                  type="button"
                  style={styles.chipButton(place === p)}
                  onClick={() => setPlace(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div style={styles.label}>{t.actionLabel}</div>
          <input
            type="text"
            style={styles.textInput}
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
          {suggestedActions.length > 0 && (
            <div style={styles.chipsRow}>
              {suggestedActions.map((a) => (
                <button
                  key={a}
                  type="button"
                  style={styles.chipButton(action === a)}
                  onClick={() => setAction(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div style={styles.label}>{t.endingLabel}</div>
          <input
            type="text"
            style={styles.textInput}
            value={ending}
            onChange={(e) => setEnding(e.target.value)}
            placeholder="everyone smiles, they go to sleep..."
          />
        </div>
      </div>

      {/* 동화 요청 버튼 */}
      <button
        type="button"
        style={styles.primaryButton}
        onClick={handleRequestStory}
        disabled={isStoryLoading}
      >
        {isStoryLoading ? t.loading : t.askButton}
      </button>

      {storyError && (
        <div style={styles.errorText}>
          {t.errorPrefix}
          {storyError}
        </div>
      )}

      {story && (
        <div style={styles.storyBox}>
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
