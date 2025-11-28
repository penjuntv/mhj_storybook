// pages/index.js
import { useState } from "react";
import { getUIText } from "../lib/uiText";
import useWordCards from "../hooks/useWordCards";

import AlphabetPicker from "../components/storybook/AlphabetPicker";
import WordCardsGrid from "../components/storybook/WordCardsGrid";
import Step2Story from "../components/storybook/Step2Story";
import StoryResult from "../components/storybook/StoryResult";

const MAX_WORDS = 8;

export default function HomePage() {
  const [language, setLanguage] = useState("ko"); // "en" | "ko" | "zh"
  const [selectedLetter, setSelectedLetter] = useState("A");

  const { cards, isLoading, error: cardsError } =
    useWordCards(selectedLetter);

  const [selectedWords, setSelectedWords] = useState([]); // [{ word, mustInclude }]
  const [wordInput, setWordInput] = useState("");

  // STEP 2 상태
  const [kidName, setKidName] = useState("");
  const [pov, setPov] = useState("first"); // "first" | "third"
  const [themeId, setThemeId] = useState("everyday");
  const [length, setLength] = useState("normal");
  const [isRequesting, setIsRequesting] = useState(false);
  const [story, setStory] = useState("");
  const [storyError, setStoryError] = useState(null);

  const t = getUIText(language);

  // 단어 칩 추가
  const addWordToChips = (rawWord) => {
    const word = (rawWord || "").trim();
    if (!word) return;

    setSelectedWords((prev) => {
      if (
        prev.some(
          (w) => w.word.toLowerCase() === word.toLowerCase()
        )
      ) {
        return prev;
      }
      if (prev.length >= MAX_WORDS) return prev;
      return [...prev, { word, mustInclude: false }];
    });
  };

  // 카드 클릭
  const handleCardClick = (cardWord) => {
    addWordToChips(cardWord.label || cardWord.word || "");
  };

  // 입력창에서 엔터/쉼표로 추가
  const handleWordInputChange = (e) => {
    const value = e.target.value;
    setWordInput(value);

    // 쉼표나 줄바꿈이 들어오면 바로 잘라서 chip 추가
    if (/[,\n]/.test(value)) {
      const parts = value
        .split(/[,\n]/)
        .map((v) => v.trim())
        .filter(Boolean);
      parts.forEach(addWordToChips);
      setWordInput("");
    }
  };

  const handleWordInputBlur = () => {
    if (!wordInput.trim()) return;
    const parts = wordInput
      .split(/[,\n]/)
      .map((v) => v.trim())
      .filter(Boolean);
    parts.forEach(addWordToChips);
    setWordInput("");
  };

  const toggleMustInclude = (word) => {
    setSelectedWords((prev) =>
      prev.map((w) =>
        w.word === word ? { ...w, mustInclude: !w.mustInclude } : w
      )
    );
  };

  const removeWord = (word) => {
    setSelectedWords((prev) =>
      prev.filter((w) => w.word !== word)
    );
  };

  // STORY 요청
  const handleAskStory = async (settings) => {
    if (!selectedWords.length || isRequesting) return;

    try {
      setIsRequesting(true);
      setStoryError(null);
      setStory("");

      const words = selectedWords.map((w) => w.word);

      const res = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words,
          storySettings: {
            language,
            kidName: settings.kidName,
            pov: settings.pov,
            themeId: settings.themeId,
            length: settings.length,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }

      const data = await res.json();
      setStory(data.story || "");
    } catch (err) {
      console.error(err);
      setStoryError(
        err?.message || "동화를 만드는 중 오류가 발생했습니다."
      );
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff7ec",
        paddingBottom: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "40px 24px 0",
        }}
      >
        {/* 헤더 + 언어 토글 */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            gap: "12px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 800,
                color: "#5b3b28",
                marginBottom: "4px",
              }}
            >
              {t.appTitle}
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              backgroundColor: "#ffe5c9",
              padding: "4px",
              borderRadius: "999px",
            }}
          >
            {["en", "ko", "zh"].map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => setLanguage(lng)}
                style={{
                  minWidth: "44px",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  backgroundColor:
                    language === lng ? "#ff9448" : "transparent",
                  color: language === lng ? "#fff" : "#5b3b28",
                }}
              >
                {lng === "en" ? "EN" : lng === "ko" ? "KO" : "中文"}
              </button>
            ))}
          </div>
        </header>

        {/* STEP 1 영역 */}
        <section
          style={{
            padding: "32px 32px 28px",
            borderRadius: "32px",
            backgroundColor: "#ffe5c9",
            boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 800,
              marginBottom: "8px",
              color: "#5b3b28",
            }}
          >
            {t.step1Title}
          </h2>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.5,
              color: "#7b5a3b",
              marginBottom: "20px",
            }}
          >
            {t.step1Subtitle}
          </p>

          {/* 알파벳 선택 */}
          <AlphabetPicker
            selectedLetter={selectedLetter}
            onSelect={setSelectedLetter}
            label={t.pickFromCards}
          />

          {/* 카드 그리드 */}
          <WordCardsGrid
            t={t}
            letter={selectedLetter}
            cards={cards}
            isLoading={isLoading}
            error={cardsError}
            onCardClick={handleCardClick}
          />

          {/* 단어 입력 & 칩 */}
          <div style={{ marginTop: "24px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#5b3b28",
                marginBottom: "8px",
              }}
            >
              {t.writeWordsLabel}
            </h3>
            <textarea
              value={wordInput}
              onChange={handleWordInputChange}
              onBlur={handleWordInputBlur}
              rows={3}
              style={{
                width: "100%",
                borderRadius: "18px",
                border: "1px solid rgba(193, 145, 108, 0.8)",
                padding: "10px 12px",
                fontSize: "14px",
                resize: "vertical",
              }}
              placeholder={t.writeWordsPlaceholder}
            />

            <p
              style={{
                fontSize: "13px",
                color: "#8b6b4a",
                marginTop: "8px",
              }}
            >
              {t.chipsLabel.replace(
                "0/8",
                `${selectedWords.length}${t.countSuffix}`
              )}
            </p>

            <div
              style={{
                minHeight: "32px",
                marginTop: "8px",
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
              }}
            >
              {selectedWords.length === 0 && (
                <span
                  style={{
                    fontSize: "13px",
                    color: "#a17a53",
                  }}
                >
                  {t.selectedZero}
                </span>
              )}
              {selectedWords.map((w) => (
                <div
                  key={w.word}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 10px",
                    borderRadius: "999px",
                    backgroundColor: "#fff6eb",
                    border: w.mustInclude
                      ? "2px solid #ff9448"
                      : "1px solid rgba(201, 154, 118, 0.7)",
                    fontSize: "13px",
                    color: "#5b3b28",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleMustInclude(w.word)}
                    style={{
                      border: "none",
                      padding: 0,
                      margin: 0,
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    title="반드시 넣기 토글"
                  >
                    {w.mustInclude ? "★" : "☆"}
                  </button>
                  <span>{w.word}</span>
                  <button
                    type="button"
                    onClick={() => removeWord(w.word)}
                    style={{
                      border: "none",
                      padding: 0,
                      marginLeft: "2px",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STEP 2 – 아이 프로필 + 테마 + 길이 */}
        <Step2Story
          t={t}
          language={language}
          selectedWords={selectedWords}
          kidName={kidName}
          setKidName={setKidName}
          pov={pov}
          setPov={setPov}
          themeId={themeId}
          setThemeId={setThemeId}
          length={length}
          setLength={setLength}
          onAskStory={handleAskStory}
          isRequesting={isRequesting}
        />

        {/* 결과 표시 */}
        <StoryResult
          t={t}
          story={story}
          error={storyError}
        />
      </div>
    </main>
  );
}
