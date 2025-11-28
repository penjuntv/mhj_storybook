// pages/index.js
import { useState } from "react";
import { getUIText } from "../lib/uiText";
import { useWordCards } from "../hooks/useWordCards";
import AlphabetPicker from "../components/storybook/AlphabetPicker";
import WordCardsGrid from "../components/storybook/WordCardsGrid";
import Step2Story from "../components/storybook/Step2Story";

const MAX_WORDS = 8;

export default function HomePage() {
  const [language, setLanguage] = useState("ko"); // "en" | "ko" | "zh"
  const [selectedLetter, setSelectedLetter] = useState("A");

  const { cards, isLoading, error: cardsError } = useWordCards(selectedLetter);

  const [selectedWords, setSelectedWords] = useState([]); // [{ word, mustInclude }]
  const [wordInput, setWordInput] = useState("");

  const t = getUIText(language);

  // 단어 칩 추가
  const addWordToChips = (rawWord) => {
    const word = (rawWord || "").trim();
    if (!word) return;

    setSelectedWords((prev) => {
      if (prev.some((w) => w.word.toLowerCase() === word.toLowerCase())) {
        return prev;
      }
      if (prev.length >= MAX_WORDS) return prev;
      return [...prev, { word, mustInclude: false }];
    });
  };

  // 카드 클릭
  const handleCardClick = (cardWord) => {
    addWordToChips(cardWord);
  };

  // 수동 입력 → 쉼표/엔터/줄바꿈으로 칩 생성
  const processWordInput = () => {
    const tokens = wordInput
      .split(/[,;\n]/)
      .map((w) => w.trim())
      .filter(Boolean);

    tokens.forEach(addWordToChips);
  };

  const handleWordInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      processWordInput();
    }
  };

  const handleWordInputBlur = () => {
    processWordInput();
  };

  const removeWordFromChips = (wordToRemove) => {
    setSelectedWords((prev) =>
      prev.filter((w) => w.word.toLowerCase() !== wordToRemove.toLowerCase())
    );
  };

  const toggleMustInclude = (wordToToggle) => {
    setSelectedWords((prev) =>
      prev.map((w) =>
        w.word.toLowerCase() === wordToToggle.toLowerCase()
          ? { ...w, mustInclude: !w.mustInclude }
          : w
      )
    );
  };

  const selectedCount = selectedWords.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFF6EC",
        padding: "24px 12px 48px",
        display: "flex",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Noto Sans KR", system-ui, sans-serif',
        color: "#4a2f1a",
      }}
    >
      <main
        style={{
          maxWidth: "1080px",
          width: "100%",
          background: "#FFEFD9",
          borderRadius: "24px",
          padding: "32px 32px 40px",
          boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* 헤더 + 언어 토글 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#C58B4E",
                marginBottom: 4,
              }}
            >
              MHJ STORYBOOK
            </div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                margin: 0,
                marginBottom: 4,
              }}
            >
              {t.header}
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#7A5A3A",
              }}
            >
              {t.subtitle}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {[
              { code: "en", label: "EN" },
              { code: "ko", label: "KO" },
              { code: "zh", label: "中文" },
            ].map((btn) => {
              const active = language === btn.code;
              return (
                <button
                  key={btn.code}
                  type="button"
                  onClick={() => setLanguage(btn.code)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: active ? "0" : "1px solid #d9a36b",
                    background: active ? "#FF8C41" : "transparent",
                    color: active ? "#fff" : "#7a4c25",
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 1 */}
        <section
          style={{
            background: "#FFE3C1",
            borderRadius: "20px",
            padding: "24px 24px 28px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            {t.step1Title}
          </div>
          <div
            style={{
              fontSize: 13,
              marginBottom: 16,
              lineHeight: 1.4,
            }}
          >
            {t.step1Subtitle}
          </div>

          {/* 알파벳 */}
          <div style={{ fontSize: 13, marginBottom: 8 }}>{t.pickFromCards}</div>
          <AlphabetPicker
            selectedLetter={selectedLetter}
            onSelect={setSelectedLetter}
          />

          {/* 카드 영역 */}
          {isLoading ? (
            <div style={{ fontSize: 13, marginTop: 12 }}>
              카드 이미지를 불러오는 중입니다…
            </div>
          ) : cardsError ? (
            <div
              style={{
                color: "#D23B3B",
                fontSize: 13,
                marginTop: 12,
              }}
            >
              {cardsError}
            </div>
          ) : (
            <WordCardsGrid
              cards={cards}
              letter={selectedLetter}
              onCardClick={handleCardClick}
              noCardsText={t.noCardsForLetter}
            />
          )}

          {/* 오늘 배운 단어 입력 */}
          <div
            style={{
              marginTop: 16,
              marginBottom: 4,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {t.writeWordsLabel}
          </div>
          <textarea
            style={{
              width: "100%",
              minHeight: "90px",
              borderRadius: "16px",
              border: "2px solid #f5c08c",
              padding: "10px 12px",
              fontSize: "14px",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              background: "#FFF9F3",
              marginBottom: "12px",
            }}
            placeholder={t.writeWordsPlaceholder}
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            onKeyDown={handleWordInputKeyDown}
            onBlur={handleWordInputBlur}
          />

          {/* Word chips */}
          <div style={{ fontSize: 13 }}>
            {t.chipsLabel}
            {selectedCount}
            {t.countSuffix}
          </div>
          {selectedCount === 0 ? (
            <div style={{ fontSize: 13, marginTop: 6 }}>{t.selectedZero}</div>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 8,
              }}
            >
              {selectedWords.map((item) => (
                <div
                  key={item.word}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: "#FFF9F3",
                    border: item.mustInclude
                      ? "1px solid #FF8C41"
                      : "1px solid #F2C199",
                    fontSize: "13px",
                    cursor: "pointer",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
                  }}
                  onClick={() => toggleMustInclude(item.word)}
                >
                  <span
                    style={{
                      color: item.mustInclude ? "#FF8C41" : "#d0a17a",
                      marginRight: 4,
                      fontSize: 13,
                    }}
                  >
                    ★
                  </span>
                  <span>{item.word}</span>
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 13,
                      cursor: "pointer",
                      opacity: 0.7,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeWordFromChips(item.word);
                    }}
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* STEP 2 – 아이 프로필 + 장소/행동 추천 + 스토리 */}
        <Step2Story
          language={language}
          t={t}
          selectedWords={selectedWords}
        />
      </main>
    </div>
  );
}
