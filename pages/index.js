// pages/index.js
// 메인 페이지: STEP1 + STEP2 + (선택) 결과

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

  const { cards, isLoading, error: cardsError } = useWordCards(selectedLetter);

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

  // 입력창에서 Enter로 단어 추가
  const handleWordInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // 콤마로 여러 개 들어온 경우 분리
      const parts = wordInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length === 0) return;
      parts.forEach(addWordToChips);
      setWordInput("");
    }
  };

  // 칩에서 X 클릭
  const handleRemoveChip = (word) => {
    setSelectedWords((prev) =>
      prev.filter((w) => w.word.toLowerCase() !== word.toLowerCase())
    );
  };

  // 칩에서 별 클릭 (mustInclude 토글)
  const handleToggleMustInclude = (word) => {
    setSelectedWords((prev) =>
      prev.map((w) =>
        w.word.toLowerCase() === word.toLowerCase()
          ? { ...w, mustInclude: !w.mustInclude }
          : w
      )
    );
  };

  // STEP2: 동화 생성 요청
  const handleRequestStory = async () => {
    setStoryError(null);
    if (selectedWords.length === 0) {
      setStoryError("동화에 사용할 단어를 최소 1개 이상 선택해 주세요.");
      return;
    }

    setIsRequesting(true);
    try {
      // TODO: 나중에 /api/story 와 연동할 때 이 부분 구현
      // 지금은 임시로 더미 스토리 생성
      const wordsList = selectedWords.map((w) => w.word).join(", ");
      const dummy =
        `${kidName || "아이"}가 등장하는 ${themeId} 테마의 영어 동화가 여기에 들어갈 자리입니다.\n\n` +
        `선택한 단어: ${wordsList}\n` +
        `시점: ${pov === "first" ? "1인칭" : "3인칭"}, 길이: ${length}`;
      setStory(dummy);
    } catch (err) {
      console.error(err);
      setStoryError("동화를 만드는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="logo">AI Storybook – 오늘 배운 단어로 영어 동화 만들기</div>
        <div className="lang-switch">
          {["en", "ko", "zh"].map((code) => (
            <button
              key={code}
              type="button"
              className={`lang-btn ${language === code ? "lang-btn--active" : ""}`}
              onClick={() => setLanguage(code)}
            >
              {code === "en" && "EN"}
              {code === "ko" && "KO"}
              {code === "zh" && "中文"}
            </button>
          ))}
        </div>
      </header>

      <main className="main">
        {/* STEP 1 -------------------------------------------------- */}
        <section className="step1">
          <h2 className="step-title">STEP 1 · Today's words</h2>
          <p className="step-desc">
            오늘 수업·숙제·책에서 등장한 영어 단어를 적거나, 아래 카드에서 골라 보세요.
          </p>

          <AlphabetPicker
            selectedLetter={selectedLetter}
            onSelectLetter={setSelectedLetter}
          />

          {isLoading && <p className="info-text">카드를 불러오는 중...</p>}
          {cardsError && (
            <p className="error-text">카드를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
          )}

          {!isLoading && !cardsError && (
            <WordCardsGrid
              cards={cards}
              selectedWords={selectedWords}
              onCardClick={handleCardClick}
            />
          )}

          {/* 오늘 배운 단어 적기 */}
          <div className="word-input-section">
            <h3 className="sub-title">오늘 배운 영어 단어 적기</h3>
            <div className="word-input-row">
              <input
                className="word-input"
                placeholder="apple, banana, mom 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요."
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                onKeyDown={handleWordInputKeyDown}
              />
              <button
                type="button"
                className="add-btn"
                onClick={() => {
                  const parts = wordInput
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  if (parts.length === 0) return;
                  parts.forEach(addWordToChips);
                  setWordInput("");
                }}
              >
                추가
              </button>
            </div>
            <p className="chips-help">
              Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는
              단어로 표시됩니다. X로 삭제할 수 있습니다. {selectedWords.length}/{MAX_WORDS}
            </p>

            {/* 선택된 칩들 */}
            <div className="chips-row">
              {selectedWords.length === 0 && (
                <span className="chips-empty">
                  아직 선택된 단어가 없습니다. 카드나 입력창으로 단어를 추가해 보세요.
                </span>
              )}
              {selectedWords.map((w) => (
                <button
                  key={w.word}
                  type="button"
                  className="chip"
                  onClick={() => handleToggleMustInclude(w.word)}
                >
                  <span className="chip-star">{w.mustInclude ? "★" : "☆"}</span>
                  <span className="chip-label">{w.word}</span>
                  <span
                    className="chip-remove"
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

        {/* STEP 2 -------------------------------------------------- */}
        <Step2Story
          t={{ step2Title: "STEP 2 · AI가 만든 영어 동화" }}
          kidName={kidName}
          setKidName={setKidName}
          pov={pov}
          setPov={setPov}
          themeId={themeId}
          setThemeId={setThemeId}
          length={length}
          setLength={setLength}
          onSubmit={handleRequestStory}
          isRequesting={isRequesting}
        />

        {/* 결과 ---------------------------------------------------- */}
        {storyError && <p className="error-text step2-error">{storyError}</p>}
        {story && (
          <section className="result-section">
            <StoryResult story={story} />
          </section>
        )}
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #fff7ec;
          color: #4b3020;
        }

        .header {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 24px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          font-weight: 800;
          font-size: 1.3rem;
          color: #4b2b16;
        }

        .lang-switch {
          display: flex;
          gap: 8px;
        }

        .lang-btn {
          border-radius: 999px;
          border: none;
          padding: 6px 14px;
          font-size: 0.8rem;
          background: #ffe3c7;
          color: #7b5434;
          cursor: pointer;
        }

        .lang-btn--active {
          background: #ff9a66;
          color: #fffdf8;
        }

        .main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 48px;
        }

        .step1 {
          margin-top: 12px;
          padding: 32px 32px 40px;
          border-radius: 32px;
          background: #fbdcb5;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.12);
        }

        .step-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #5a3319;
          margin-bottom: 6px;
        }

        .step-desc {
          font-size: 0.95rem;
          color: #8b674a;
          margin-bottom: 12px;
        }

        .word-input-section {
          margin-top: 40px;
        }

        .sub-title {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .word-input-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .word-input {
          flex: 1;
          padding: 12px 16px;
          border-radius: 999px;
          border: none;
          outline: none;
          background: #fff6ea;
          font-size: 0.95rem;
        }

        .word-input:focus {
          box-shadow: 0 0 0 2px rgba(255, 153, 102, 0.9);
        }

        .add-btn {
          flex-shrink: 0;
          border-radius: 999px;
          border: none;
          padding: 10px 18px;
          background: #ff9a66;
          color: #fffdf8;
          font-weight: 700;
          cursor: pointer;
        }

        .chips-help {
          margin-top: 8px;
          font-size: 0.86rem;
          color: #9a7b63;
        }

        .chips-row {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chips-empty {
          font-size: 0.9rem;
          color: #9a7b63;
        }

        .chip {
          border-radius: 999px;
          border: none;
          padding: 6px 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffe3c7;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .chip-star {
          font-size: 0.9rem;
        }

        .chip-label {
          font-weight: 600;
        }

        .chip-remove {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .chip-remove:hover {
          opacity: 1;
        }

        .info-text {
          margin-top: 16px;
          font-size: 0.9rem;
          color: #8b674a;
        }

        .error-text {
          margin-top: 16px;
          font-size: 0.9rem;
          color: #c0392b;
        }

        .step2-error {
          margin-top: 16px;
        }

        .result-section {
          margin-top: 32px;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .step1 {
            padding: 24px 20px 28px;
          }
        }
      `}</style>
    </div>
  );
}
