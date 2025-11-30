// pages/index.js
import Head from "next/head";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import wordCards from "../data/wordCards";

const LANGUAGES = ["EN", "KO", "CN"];

const STORY_LENGTH_OPTIONS = [
  { id: "short", labelKO: "짧게", labelEN: "Short" },
  { id: "medium", labelKO: "보통", labelEN: "Normal" },
  { id: "long", labelKO: "길게", labelEN: "Long" },
];

const THEMES = [
  { id: "daily_adventure", emoji: "🏠", labelKO: "일상 모험" },
  { id: "school_life", emoji: "🏫", labelKO: "학교 이야기" },
  { id: "family", emoji: "👪", labelKO: "가족" },
  { id: "friends", emoji: "👬", labelKO: "친구" },
  { id: "animals", emoji: "🐶", labelKO: "동물" },
  { id: "princess", emoji: "👑", labelKO: "공주" },
  { id: "hero", emoji: "🧑‍🚒", labelKO: "영웅" },
  { id: "fairy_tale", emoji: "📜", labelKO: "전래동화" },
  { id: "animation", emoji: "🎬", labelKO: "애니메이션 느낌" },
  { id: "space_sf", emoji: "🚀", labelKO: "우주 / SF" },
];

const MAIN_BG = "#FFEBD2";
const PANEL_BG = "#FFE3C1";
const CARD_BG = "#FFEED8";

function getChildNamePlaceholder(lang) {
  switch (lang) {
    case "EN":
      return "Please type your child's name (main character)";
    case "CN":
      return "请输入孩子的名字（故事主角）";
    case "KO":
    default:
      return "아이 이름을 적어주세요 (이야기 주인공)";
  }
}

export default function Home() {
  const router = useRouter();

  // 언어 선택
  const [language, setLanguage] = useState("KO");

  // STEP1 상태
  const [activeLetter, setActiveLetter] = useState("A");
  const [selectedWords, setSelectedWords] = useState([]); // ['apple','bus',...]
  const [todayWordsInput, setTodayWordsInput] = useState("");

  // STEP2 상태
  const [storyLength, setStoryLength] = useState("medium");
  const [childName, setChildName] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState("daily_adventure");

  const [storyText, setStoryText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyError, setStoryError] = useState("");

  const activeTheme = useMemo(
    () => THEMES.find((t) => t.id === selectedThemeId) || THEMES[0],
    [selectedThemeId]
  );

  // 알파벳별 카드들
  const currentLetterCards = useMemo(() => {
    const list = wordCards[activeLetter] || [];
    return list;
  }, [activeLetter]);

  const handleToggleWord = (word) => {
    setSelectedWords((prev) =>
      prev.includes(word)
        ? prev.filter((w) => w !== word)
        : prev.length >= 8
        ? prev
        : [...prev, word]
    );
  };

  const handleTodayWordsBlur = () => {
    if (!todayWordsInput.trim()) return;
    const splitted = todayWordsInput
      .split(/[,，\n]/)
      .map((w) => w.trim())
      .filter(Boolean);
    if (splitted.length === 0) return;
    setSelectedWords((prev) => {
      const merged = [...prev];
      for (const w of splitted) {
        if (!merged.includes(w) && merged.length < 8) merged.push(w);
      }
      return merged;
    });
  };

  const handleRemoveChip = (word) => {
    setSelectedWords((prev) => prev.filter((w) => w !== word));
  };

  // === 스토리 생성 ===
  const handleGenerateStory = async () => {
    if (selectedWords.length === 0) {
      alert("오늘 배운 영어 단어를 최소 1개 이상 선택하거나 입력해 주세요.");
      return;
    }

    setIsGenerating(true);
    setStoryError("");
    try {
      const res = await fetch("/api/generateStory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          words: selectedWords,
          childName: childName || "아이",
          length: storyLength,
          themeId: selectedThemeId,
          language,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to generate story");
      }
      const data = await res.json();
      setStoryText(data.story || "");
    } catch (error) {
      console.error(error);
      setStoryError("동화를 생성하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  // === 색칠 페이지로 이동 ===
  const handleGoToColoring = () => {
    if (!storyText.trim()) return;

    if (typeof window === "undefined") return;

    const sessionId = Date.now().toString();
    const storageKey = `mhj-coloring-session-${sessionId}`;

    const storyTitle = childName
      ? `${childName}의 ${activeTheme.labelKO}`
      : `오늘의 영어 동화`;

    const payload = {
      storyTitle,
      storySummary: storyText,
      // 아직은 라인아트 이미지가 없으므로 pages는 비워둔다.
      // /pages/coloring.js 에서 pages가 비어 있으면 FALLBACK_PAGES를 사용함.
      pages: [],
    };

    window.localStorage.setItem(storageKey, JSON.stringify(payload));

    router.push(`/coloring?session=${sessionId}`);
  };

  // 언어별 타이틀
  const mainTitle =
    language === "EN"
      ? "AI Storybook – Make an English Story with Today’s Words"
      : language === "CN"
      ? "AI 故事书 – 用今天学的单词创作英语故事"
      : "AI Storybook – 오늘 배운 단어로 영어 동화 만들기";

  return (
    <>
      <Head>
        <title>AI Storybook</title>
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background: MAIN_BG,
          display: "flex",
          justifyContent: "center",
          padding: "32px 12px 40px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1280,
            background: PANEL_BG,
            borderRadius: 32,
            boxShadow: "0 26px 60px rgba(0,0,0,0.12)",
            padding: "28px 28px 36px",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* 언어 토글 */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              display: "flex",
              background: "#FFEAD4",
              borderRadius: 999,
              padding: 4,
              gap: 2,
            }}
          >
            {LANGUAGES.map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => setLanguage(lng)}
                style={{
                  border: "none",
                  borderRadius: 999,
                  padding: "4px 14px",
                  fontSize: 12,
                  cursor: "pointer",
                  background: language === lng ? "#FF8C41" : "transparent",
                  color: language === lng ? "#FFFFFF" : "#8B5A2B",
                  fontWeight: language === lng ? 700 : 500,
                }}
              >
                {lng === "EN" ? "EN" : lng === "KO" ? "KO" : "中文"}
              </button>
            ))}
          </div>

          {/* 메인 타이틀 */}
          <h1
            style={{
              fontSize: 28,
              margin: "0 0 12px",
              color: "#4B240C",
              fontWeight: 800,
            }}
          >
            {mainTitle}
          </h1>

          {/* STEP 1 */}
          <section style={{ marginTop: 16 }}>
            <h2
              style={{
                fontSize: 22,
                margin: "0 0 4px",
                color: "#5B3312",
                fontWeight: 800,
              }}
            >
              STEP 1 · Today&apos;s words
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#754628",
                margin: "0 0 16px",
              }}
            >
              오늘 수업·숙제·책에서 등장한 영어 단어를 적거나, 아래 카드에서 골라 보세요.
            </p>

            {/* 알파벳 버튼 */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 18,
              }}
            >
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
                const isActive = activeLetter === letter;
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => setActiveLetter(letter)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                      background: isActive ? "#FF8C41" : "#FFF6EB",
                      color: isActive ? "#FFFFFF" : "#7A4C25",
                      fontWeight: 700,
                      boxShadow: isActive
                        ? "0 12px 24px rgba(0,0,0,0.18)"
                        : "0 6px 15px rgba(0,0,0,0.08)",
                    }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* 카드 그리드 */}
            <div
              style={{
                background: CARD_BG,
                borderRadius: 26,
                padding: "18px 20px 18px",
                boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: 18,
                }}
              >
                {currentLetterCards.map((card) => {
                  const isSelected = selectedWords.includes(card.word);
                  return (
                    <button
                      key={card.word}
                      type="button"
                      onClick={() => handleToggleWord(card.word)}
                      style={{
                        border: "none",
                        borderRadius: 26,
                        background: isSelected ? "#FFCE9B" : "#FFF7EC",
                        boxShadow: isSelected
                          ? "0 0 0 2px rgba(255,140,65,0.8), 0 12px 28px rgba(0,0,0,0.12)"
                          : "0 10px 24px rgba(0,0,0,0.1)",
                        padding: 10,
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      {/* 선택 표시 */}
                      {isSelected && (
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "#FF8C41",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          ★
                        </div>
                      )}

                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "3 / 4",
                          borderRadius: 22,
                          overflow: "hidden",
                          background: "#FFF2DD",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={card.imageUrl}
                          alt={card.word}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 오늘 배운 단어 입력 + 칩 */}
            <div
              style={{
                marginTop: 22,
                background: "#FFEAD4",
                borderRadius: 24,
                padding: "14px 18px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  marginBottom: 8,
                  color: "#6D4020",
                  fontWeight: 600,
                }}
              >
                오늘 배운 영어 단어 적기
              </div>
              <input
                type="text"
                value={todayWordsInput}
                onChange={(e) => setTodayWordsInput(e.target.value)}
                onBlur={handleTodayWordsBlur}
                placeholder="apple, banana, mom 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요."
                style={{
                  width: "100%",
                  borderRadius: 999,
                  border: "none",
                  padding: "10px 18px",
                  fontSize: 14,
                  boxSizing: "border-box",
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
                  outline: "none",
                }}
              />
              <div
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  color: "#8E5C32",
                }}
              >
                Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는
                단어로 표시됩니다. X로 삭제할 수 있습니다. {selectedWords.length}/8 선택됨
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {selectedWords.map((w) => (
                  <div
                    key={w}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "#FFF4E3",
                      fontSize: 13,
                      color: "#5B3312",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <span>★ {w}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChip(w)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: 13,
                        color: "#B46935",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* STEP 2 */}
          <section style={{ marginTop: 36 }}>
            <h2
              style={{
                fontSize: 22,
                margin: "0 0 12px",
                color: "#5B3312",
                fontWeight: 800,
              }}
            >
              STEP 2 · 동화 옵션 정하기
            </h2>

            {/* 옵션 패널 */}
            <div
              style={{
                background: CARD_BG,
                borderRadius: 26,
                padding: "18px 20px 20px",
                boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
                marginBottom: 20,
              }}
            >
              {/* 동화 길이 */}
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 14,
                    marginBottom: 10,
                    color: "#6D4020",
                    fontWeight: 600,
                  }}
                >
                  동화 길이
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {STORY_LENGTH_OPTIONS.map((opt) => {
                    const isActive = storyLength === opt.id;
                    const label = language === "EN" ? opt.labelEN : opt.labelKO;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setStoryLength(opt.id)}
                        style={{
                          borderRadius: 999,
                          border: "none",
                          padding: "8px 20px",
                          fontSize: 14,
                          cursor: "pointer",
                          background: isActive ? "#FF8C41" : "#FFF4E5",
                          color: isActive ? "#fff" : "#7A4C25",
                          fontWeight: isActive ? 700 : 500,
                          boxShadow: isActive
                            ? "0 10px 22px rgba(0,0,0,0.16)"
                            : "0 6px 14px rgba(0,0,0,0.08)",
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 아이 이름 */}
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 14,
                    marginBottom: 8,
                    color: "#6D4020",
                    fontWeight: 600,
                  }}
                >
                  아이 이름 (이야기 주인공)
                </div>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder={getChildNamePlaceholder(language)}
                  style={{
                    width: "100%",
                    borderRadius: 999,
                    border: "none",
                    padding: "10px 18px",
                    fontSize: 14,
                    boxSizing: "border-box",
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
                    outline: "none",
                    background: "#FFFFFF",
                  }}
                />
              </div>

              {/* 테마 선택 */}
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 14,
                    marginBottom: 10,
                    color: "#6D4020",
                    fontWeight: 600,
                  }}
                >
                  이야기 테마 고르기
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  {THEMES.map((theme) => {
                    const isActive = selectedThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedThemeId(theme.id)}
                        style={{
                          borderRadius: 999,
                          border: "none",
                          padding: "10px 22px",
                          fontSize: 14,
                          cursor: "pointer",
                          background: isActive ? "#FF8C41" : "#FFF6EB",
                          color: isActive ? "#fff" : "#7A4C25",
                          fontWeight: isActive ? 700 : 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          boxShadow: isActive
                            ? "0 10px 22px rgba(0,0,0,0.16)"
                            : "0 6px 14px rgba(0,0,0,0.08)",
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{theme.emoji}</span>
                        <span>{theme.labelKO}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI 호출 버튼 */}
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  onClick={handleGenerateStory}
                  disabled={isGenerating}
                  style={{
                    borderRadius: 999,
                    border: "none",
                    padding: "12px 26px",
                    fontSize: 16,
                    cursor: "pointer",
                    background: isGenerating ? "#FFB37A" : "#FF8C41",
                    color: "#fff",
                    fontWeight: 700,
                    boxShadow: "0 16px 30px rgba(0,0,0,0.16)",
                  }}
                >
                  {isGenerating ? "AI가 동화를 만드는 중..." : "AI에게 영어 동화 만들기 요청하기"}
                </button>
              </div>
            </div>

            {/* 스토리 결과 영역 */}
            <div
              style={{
                background: "#FFEAD4",
                borderRadius: 30,
                padding: "18px 20px 18px",
                boxShadow: "0 18px 40px rgba(0,0,0,0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: 20,
                  margin: "0 0 12px",
                  color: "#5B3312",
                  fontWeight: 800,
                }}
              >
                AI가 만든 오늘의 영어 동화
              </h3>

              <div
                style={{
                  minHeight: 160,
                  background: "#FFFDF8",
                  borderRadius: 24,
                  padding: "14px 16px",
                  boxSizing: "border-box",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#5A3416",
                  whiteSpace: "pre-wrap",
                }}
              >
                {storyError
                  ? storyError
                  : storyText
                  ? storyText
                  : "아직 동화가 생성되지 않았습니다. 위에서 단어·테마·이름을 선택한 후, ‘AI에게 영어 동화 만들기 요청하기’ 버튼을 눌러 주세요. (demo text)"}
              </div>

              {/* 동화 그리기 / 색칠하기 버튼 – 스토리가 있을 때만 */}
              {storyText.trim() && (
                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleGoToColoring}
                    style={{
                      borderRadius: 999,
                      border: "none",
                      padding: "10px 22px",
                      fontSize: 14,
                      cursor: "pointer",
                      background: "#FF8C41",
                      color: "#fff",
                      fontWeight: 700,
                      boxShadow: "0 12px 26px rgba(0,0,0,0.16)",
                    }}
                  >
                    이 동화로 색칠하기 (동화 그리기)
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
