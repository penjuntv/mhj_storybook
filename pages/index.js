// pages/index.js
// 메인 페이지: STEP1 + STEP2 + 결과

import { useState } from "react";
import { getUIText } from "../lib/uiText";
import useWordCards from "../hooks/useWordCards";

import AlphabetPicker from "../components/storybook/AlphabetPicker";
import WordCardsGrid from "../components/storybook/WordCardsGrid";
import Step2Story from "../components/storybook/Step2Story";
import StoryResult from "../components/storybook/StoryResult";

const MAX_WORDS = 8;

export default function HomePage() {
  // UI 언어
  const [language, setLanguage] = useState("ko"); // "en" | "ko" | "zh"

  // STEP 1 – 알파벳 + 단어 카드
  const [selectedLetter, setSelectedLetter] = useState("A");

  // STEP 1 – 선택 단어들 (chips)
  // 예: [{ word: "apple", mustInclude: true }, ...]
  const [selectedWords, setSelectedWords] = useState([]);
  const [wordInput, setWordInput] = useState("");

  // STEP 2 – 상태
  const [kidName, setKidName] = useState("");
  const [pov, setPov] = useState("first"); // "first" | "third"
  const [themeId, setThemeId] = useState("everyday"); // string 또는 string[]
  const [length, setLength] = useState("normal"); // "short" | "normal" | "long"
  const [isRequesting, setIsRequesting] = useState(false);
  const [story, setStory] = useState("");
  const [storyError, setStoryError] = useState(null);

  const t = getUIText(language);

  // 선택된 알파벳에 따른 카드
  const { cards, isLoading, error: cardsError } = useWordCards(selectedLetter);

  // ---------- STEP 1: 단어 chip 관리 ----------

  // 단어 chip 추가 (카드 클릭 또는 수동 입력)
  const addWordToChips = (rawWord) => {
    const word = (rawWord || "").trim();
    if (!word) return;

    setSelectedWords((prev) => {
      // 이미 존재하면 무시 (대소문자 구분 없이)
      if (prev.some((w) => w.word.toLowerCase() === word.toLowerCase())) {
        return prev;
      }
      // 최대 개수 제한
      if (prev.length >= MAX_WORDS) return prev;

      return [...prev, { word, mustInclude: false }];
    });
  };

  // 카드 클릭 → 단어 추가
  const handleCardClick = (cardWord) => {
    addWordToChips(cardWord);
  };

  // 수동 입력창에서 "추가" 버튼
  const handleAddWordFromInput = () => {
    addWordToChips(wordInput);
    setWordInput("");
  };

  // chip 삭제
  const handleRemoveChip = (word) => {
    setSelectedWords((prev) =>
      prev.filter((w) => w.word.toLowerCase() !== word.toLowerCase())
    );
  };

  // chip의 “★ 꼭 나와야 해” 토글
  const handleToggleMustInclude = (word) => {
    setSelectedWords((prev) =>
      prev.map((w) =>
        w.word.toLowerCase() === word.toLowerCase()
          ? { ...w, mustInclude: !w.mustInclude }
          : w
      )
    );
  };

  // ---------- STEP 2: 동화 생성 요청 ----------

  async function handleRequestStory() {
    // 이미 요청 중이면 중복 호출 방지
    if (isRequesting) return;

    setIsRequesting(true);
    setStoryError(null);

    try {
      // 1) chip 객체 배열에서 실제 단어만 뽑기
      const coreWords = selectedWords
        .map((w) => (typeof w === "string" ? w : w.word))
        .filter(Boolean);

      // 2) 테마를 항상 배열로 맞추기 (단일 선택/다중 선택 모두 대응)
      const themes = Array.isArray(themeId) ? themeId : [themeId].filter(Boolean);

      const payload = {
        language,
        kidName: kidName || "", // 빈 값도 허용
        pov, // "first" | "third"
        themes, // ["family", "princess", ...]
        length, // "short" | "normal" | "long"
        words: coreWords,
        // 꼭 등장해야 하는 핵심 단어들 별도 배열
        mustIncludeWords: selectedWords
          .filter((w) => w.mustInclude)
          .map((w) => w.word),
      };

      const res = await fetch("/api/storybook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      // API에서 { story: "..." } 형태로 온다고 가정
      setStory(data.story || "");
    } catch (err) {
      console.error("Failed to request story:", err);
      setStory("");
      setStoryError(
        err?.message || "동화를 만드는 도중 오류가 발생했습니다. 다시 시도해 주세요."
      );
    } finally {
      setIsRequesting(false);
    }
  }

  // ---------- 렌더링 ----------

  return (
    <main className="page-root">
      {/* 언어 스위처 등은 기존 스타일에 맞춰 유지 */}
      <div className="page-language-switch">
        <button
          type="button"
          className={language === "en" ? "lang-btn active" : "lang-btn"}
          onClick={() => setLanguage("en")}
        >
          EN
        </button>
        <button
          type="button"
          className={language === "ko" ? "lang-btn active" : "lang-btn"}
          onClick={() => setLanguage("ko")}
        >
          KO
        </button>
        <button
          type="button"
          className={language === "zh" ? "lang-btn active" : "lang-btn"}
          onClick={() => setLanguage("zh")}
        >
          中文
        </button>
      </div>

      {/* STEP 1 */}
      <section className="step-section step1">
        <h1 className="step-title">
          AI Storybook – 오늘 배운 단어로 영어 동화 만들기
        </h1>

        <h2 className="step-subtitle">STEP 1 · Today&apos;s words</h2>
        <p className="step-description">
          오늘 수업·숙제·책에서 등장한 영어 단어를 적거나,
          <br />
          위 알파벳에서 골라 단어 카드를 눌러 보세요.
        </p>

        {/* 알파벳 선택 */}
        <AlphabetPicker
          selectedLetter={selectedLetter}
          onChangeLetter={setSelectedLetter}
        />

        {/* 단어 카드 6장 그리드 (2행 × 3열) */}
        <WordCardsGrid
          cards={cards}
          isLoading={isLoading}
          error={cardsError}
          onCardClick={handleCardClick}
        />

        {/* 수동 입력 + chips 영역 */}
        <div className="word-input-area">
          <label className="word-input-label">
            오늘 배운 영어 단어 적기
            <input
              type="text"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              placeholder="apple, banana, mom 처럼 쉽고(,)나 줄바꿈으로 단어를 입력해 주세요."
            />
          </label>
          <button
            type="button"
            className="word-input-add-btn"
            onClick={handleAddWordFromInput}
          >
            추가
          </button>
        </div>

        <div className="word-chips-area">
          <p className="word-chips-help">
            Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면
            하는 단어로 표시됩니다. X로 삭제할 수 있습니다. {selectedWords.length}/
            {MAX_WORDS}
          </p>
          <div className="word-chips-list">
            {selectedWords.length === 0 && (
              <span className="word-chips-empty">
                아직 선택된 단어가 없습니다. 카드나 입력창으로 단어를 추가해 보세요.
              </span>
            )}
            {selectedWords.map((w) => (
              <button
                key={w.word}
                type="button"
                className={
                  w.mustInclude ? "word-chip word-chip-important" : "word-chip"
                }
                onClick={() => handleToggleMustInclude(w.word)}
              >
                {w.mustInclude && <span className="star">★</span>}
                <span className="word">{w.word}</span>
                <span
                  className="remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveChip(w.word);
                  }}
                >
                  ×
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STEP 2 – 스토리 옵션 & 요청 버튼 */}
      <section className="step-section step2">
        <Step2Story
          language={language}
          kidName={kidName}
          setKidName={setKidName}
          pov={pov}
          setPov={setPov}
          themeId={themeId}
          setThemeId={setThemeId}
          length={length}
          setLength={setLength}
          onRequestStory={handleRequestStory}
          isRequesting={isRequesting}
          // 선택된 단어들을 STEP2 쪽에서도 보여주고 싶다면 같이 넘겨도 된다
          selectedWords={selectedWords}
        />
      </section>

      {/* 결과 영역 */}
      <section className="step-section step-result">
        <StoryResult story={story} isLoading={isRequesting} error={storyError} />
      </section>
    </main>
  );
}
