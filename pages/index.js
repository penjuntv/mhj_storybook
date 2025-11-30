// pages/index.js
import Head from "next/head";
import { useState } from "react";
import AlphabetPicker from "../components/storybook/AlphabetPicker";
import { useWordCards } from "../hooks/useWordCards";

// 간단한 다국어 텍스트
const TEXTS = {
  ko: {
    title: "AI Storybook – 오늘 배운 단어로 영어 동화 만들기",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "오늘 수업·숙제·책에서 등장한 영어 단어를 적거나, 아래 카드에서 골라 보세요.",
    pickFromCards: "",
    noCardsForLetter: "아직 이 알파벳에는 카드가 없습니다.",
    writeWordsLabel: "오늘 배운 영어 단어 적기",
    writeWordsPlaceholder:
      "apple, banana, mom 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요.",
    chipsLabel:
      "Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는 단어로 표시됩니다. X로 삭제할 수 있습니다. ",
    countSuffix: " /8",
    selectedZero: "아직 선택된 단어가 없습니다.",
    step2Title: "STEP 2 · 동화 옵션 정하기",
    step2Subtitle: "동화 길이와 아이 이름을 선택해 주세요.",
    lengthLabel: "동화 길이",
    lengthShort: "짧게",
    lengthNormal: "보통",
    lengthLong: "길게",
    childNameLabel: "아이 이름 (이야기 주인공)",
    childNamePlaceholder: "예: yujin",
    requestButton: "AI에게 영어 동화 만들기 요청하기",
    storySectionTitle: "AI가 만든 오늘의 영어 동화",
    storyPlaceholder:
      "위에서 단어 카드 또는 Word chips를 선택한 뒤, 버튼을 누르면 동화가 여기에 표시됩니다.",
    storyError: "AI 동화를 만드는 동안 오류가 발생했습니다.",
    storyEmptyWords: "먼저 위에서 단어를 한 개 이상 선택해 주세요.",
  },
  en: {
    title: "AI Storybook – Make an English story with today's words",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "Type the English words from school / homework / books, or choose from the cards.",
    pickFromCards: "",
    noCardsForLetter: "There are no cards for this letter yet.",
    writeWordsLabel: "Write today's English words",
    writeWordsPlaceholder:
      "Type words like apple, banana, mom separated by commas or line breaks.",
    chipsLabel:
      "Word chips · Click a chip to toggle ★ if you want that word to be strongly included. You can remove chips with X. ",
    countSuffix: " /8",
    selectedZero: "No words selected yet.",
    step2Title: "STEP 2 · Story options",
    step2Subtitle: "Choose story length and the child's name.",
    lengthLabel: "Story length",
    lengthShort: "Short",
    lengthNormal: "Normal",
    lengthLong: "Long",
    childNameLabel: "Child's name (main character)",
    childNamePlaceholder: "e.g. yujin",
    requestButton: "Ask AI to create the story",
    storySectionTitle: "AI story for today",
    storyPlaceholder:
      "Select some cards or word chips above, then press the button to generate a story here.",
    storyError: "An error occurred while generating the story.",
    storyEmptyWords: "Please select at least one word first.",
  },
};

const LANG_ORDER = ["ko", "en"]; // 중국어는 나중에 추가 가능

export default function HomePage() {
  const [lang, setLang] = useState("ko");
  const t = TEXTS[lang];

  const [selectedLetter, setSelectedLetter] = useState("A");

  // 단어 카드 불러오기 (Supabase 이미지 + 단어)
  const { cards, isLoading, error } = useWordCards(selectedLetter);

  // 선택된 단어 chips
  const [selectedWords, setSelectedWords] = useState([]); // { word, mustInclude }

  const [wordInput, setWordInput] = useState("");

  // 동화 옵션
  const [storyLength, setStoryLength] = useState("normal"); // "short" | "normal" | "long"
  const [childName, setChildName] = useState("yujin");

  // 스토리 결과
  const [story, setStory] = useState("");
  const [storyError, setStoryError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedCount = selectedWords.length;

  // chip 추가
  const addWordToChips = (rawWord) => {
    const word = (rawWord || "").trim();
    if (!word) return;

    setSelectedWords((prev) => {
      if (prev.length >= 8) return prev;
      // 이미 있으면 그대로
      if (prev.some((w) => w.word.toLowerCase() === word.toLowerCase())) {
        return prev;
      }
      return [...prev, { word, mustInclude: false }];
    });
  };

  // 카드 클릭 시 chip 추가
  const handleCardClick = (card) => {
    addWordToChips(card.word);
  };

  // chip 삭제
  const removeWordFromChips = (wordToRemove) => {
    setSelectedWords((prev) =>
      prev.filter(
        (w) => w.word.toLowerCase() !== wordToRemove.toLowerCase()
      )
    );
  };

  // chip ★ 토글
  const toggleMustInclude = (wordToToggle) => {
    setSelectedWords((prev) =>
      prev.map((w) =>
        w.word.toLowerCase() === wordToToggle.toLowerCase()
          ? { ...w, mustInclude: !w.mustInclude }
          : w
      )
    );
  };

  // 수동 입력 -> chips 변환
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

  // 동화 생성 버튼
  const handleGenerateStory = async () => {
    if (!selectedWords.length) {
      setStoryError(t.storyEmptyWords);
      return;
    }

    setIsGenerating(true);
    setStoryError("");

    try {
      const res = await fetch("/api/generateStory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: selectedWords.map((w) => w.word),
          length: storyLength,
          language: lang,
          childName,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setStory(data.story || "");
    } catch (err) {
      console.error(err);
      setStoryError(t.storyError);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t.title}</title>
      </Head>

      <div className="page-root">
        {/* 헤더 */}
        <header className="page-header">
          <h1>{t.title}</h1>

          <div className="lang-switch">
            {LANG_ORDER.map((code) => (
              <button
                key={code}
                type="button"
                className={code === lang ? "active" : ""}
                onClick={() => setLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        {/* STEP 1 – 단어 카드 + Word chips */}
        <section className="step-section">
          <h2>{t.step1Title}</h2>
          <p>{t.step1Subtitle}</p>

          {/* 알파벳 버튼 */}
          <AlphabetPicker
            selectedLetter={selectedLetter}
            onSelectLetter={setSelectedLetter}
          />

          {/* 카드 그리드 */}
          {isLoading ? (
            <div className="word-grid-empty">카드 이미지를 불러오는 중입니다…</div>
          ) : error ? (
            <div className="word-grid-empty" style={{ color: "#D23B3B" }}>
              {error}
            </div>
          ) : cards.length === 0 ? (
            <div className="word-grid-empty">
              {t.noCardsForLetter.replace("{letter}", selectedLetter)}
            </div>
          ) : (
            <div className="word-grid">
              {cards.map((card) => (
                <button
                  type="button"
                  key={card.id}
                  className="word-card"
                  onClick={() => handleCardClick(card)}
                >
                  <div className="word-card-inner">
                    <div className="word-card-image-wrapper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.imageUrl}
                        alt={card.word}
                        className="word-card-image"
                      />
                    </div>
                    {/* 카드 밑에 별도 스펠링 텍스트는 표시하지 않음 */}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 오늘 배운 단어 입력 + chips */}
          <div className="word-input-block">
            <label htmlFor="today-words-input">{t.writeWordsLabel}</label>
            <div className="word-input-row">
              <input
                id="today-words-input"
                type="text"
                placeholder={t.writeWordsPlaceholder}
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                onKeyDown={handleWordInputKeyDown}
                onBlur={handleWordInputBlur}
              />
            </div>
            <div className="chips-hint">
              {t.chipsLabel}
              {selectedCount}
              {t.countSuffix}
            </div>

            {selectedCount === 0 ? (
              <div style={{ marginTop: 6, fontSize: "0.9rem" }}>
                {t.selectedZero}
              </div>
            ) : (
              <div className="chips-row">
                {selectedWords.map((item) => (
                  <button
                    key={item.word}
                    type="button"
                    className={`chip ${item.mustInclude ? "must" : ""}`}
                    onClick={() => toggleMustInclude(item.word)}
                  >
                    <span style={{ marginRight: 4 }}>
                      {item.mustInclude ? "★" : "☆"}
                    </span>
                    <span>{item.word}</span>
                    <span
                      className="chip-close"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWordFromChips(item.word);
                      }}
                    >
                      ✕
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* STEP 2 – 동화 옵션 + 생성 버튼 + 결과 */}
        <section className="step-section step2-story">
          <h2>{t.step2Title}</h2>
          <p>{t.step2Subtitle}</p>

          {/* 길이 선택 */}
          <div className="step2-row">
            <label className="input-label">{t.lengthLabel}</label>
            <div className="button-group">
              <button
                type="button"
                className={`pill-button ${
                  storyLength === "short" ? "active" : ""
                }`}
                onClick={() => setStoryLength("short")}
              >
                {t.lengthShort}
              </button>
              <button
                type="button"
                className={`pill-button ${
                  storyLength === "normal" ? "active" : ""
                }`}
                onClick={() => setStoryLength("normal")}
              >
                {t.lengthNormal}
              </button>
              <button
                type="button"
                className={`pill-button ${
                  storyLength === "long" ? "active" : ""
                }`}
                onClick={() => setStoryLength("long")}
              >
                {t.lengthLong}
              </button>
            </div>
          </div>

          {/* 아이 이름 */}
          <div className="step2-row">
            <label htmlFor="child-name" className="input-label">
              {t.childNameLabel}
            </label>
            <input
              id="child-name"
              type="text"
              className="text-input"
              value={childName}
              placeholder={t.childNamePlaceholder}
              onChange={(e) => setChildName(e.target.value)}
            />
          </div>

          {/* 요청 버튼 */}
          <div className="request-row">
            <button
              type="button"
              onClick={handleGenerateStory}
              disabled={isGenerating}
            >
              {isGenerating ? "동화를 만드는 중입니다…" : t.requestButton}
            </button>
          </div>

          {/* 결과 영역 */}
          <div className="story-result">
            <h3 className="section-title">{t.storySectionTitle}</h3>

            {storyError && <p className="error-text">{storyError}</p>}

            <div className="story-box">
              {story ? (
                <p className="story-text">{story}</p>
              ) : (
                <p className="story-placeholder">{t.storyPlaceholder}</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
