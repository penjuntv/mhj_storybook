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
  // 언어 상태
  const [language, setLanguage] = useState("ko"); // "en" | "ko" | "zh"

  // STEP1 – 알파벳 / 카드
  const [selectedLetter, setSelectedLetter] = useState("A");
  const { cards, isLoading: cardsLoading, error: cardsError } =
    useWordCards(selectedLetter);

  // STEP1 – 오늘 배운 단어
  const [selectedWords, setSelectedWords] = useState([]); // [{ word, mustInclude }]
  const [wordInput, setWordInput] = useState("");

  // STEP2 – 상태
  const [kidName, setKidName] = useState("");
  const [pov, setPov] = useState("first"); // "first" | "third"
  const [themeId, setThemeId] = useState([]); // ["everyday", "family", ...]
  const [length, setLength] = useState("normal"); // "short" | "normal" | "long"
  const [isRequesting, setIsRequesting] = useState(false);
  const [story, setStory] = useState("");
  const [storyError, setStoryError] = useState(null);

  // UI 텍스트 (항상 안전하게 폴백)
  const t = getUIText?.(language) || {};

  const {
    pageTitle = "AI Storybook - 오늘 배운 단어로 영어 동화 만들기",
    step1Title = "STEP 1 · Today's words",
    step1Description = "오늘 수업·숙제·책에서 등장한 영어 단어를 적거나, 아래 카드에서 골라 보세요.",
    step1InputLabel = "오늘 배운 영어 단어 적기",
    step1InputPlaceholder =
      "apple, banana, mom 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요.",
    chipsHint =
      "Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는 단어로 표시됩니다. X로 삭제할 수 있습니다.",
    step1NoCards = "아직 이 알파벳에는 카드가 없습니다.",

    step2Title = "STEP 2 · AI가 만든 영어 동화",
    step2Intro =
      "아이 이름과 이야기 방식을 고르고, 동화의 테마와 길이를 선택해 주세요. 단어 2~8개를 고르면, AI가 아이 눈높이에 맞춰 동화를 만들어 줍니다.",

    step2NameLabel = "이름 (예: Yujin) (선택)",
    step2WayLabel = "이야기 방식",
    step2WayFirst = "내가 이야기의 주인공 (1인칭)",
    step2WayThird = "내가 들려주는 이야기 (3인칭)",

    step2ThemeLabel = "이야기 테마 고르기",
    step2LengthLabel = "이야기 길이",
    step2LengthShort = "숏 (아주 짧게)",
    step2LengthNormal = "노멀 (보통 길이)",
    step2LengthLong = "롱 (조금 길게)",

    requestButtonLabel = "AI에게 영어 동화 만들기 요청하기",
  } = t;

  // STEP1 – 카드에서 단어 추가
  const handleSelectCardWord = (word) => {
    if (!word) return;
    if (selectedWords.length >= MAX_WORDS) return;
    if (selectedWords.some((w) => w.word === word)) return;

    setSelectedWords((prev) => [...prev, { word, mustInclude: false }]);
  };

  // STEP1 – 입력 창에서 단어 추가
  const handleAddWordsFromInput = () => {
    if (!wordInput.trim()) return;
    const rawWords = wordInput
      .split(/[\n,]/)
      .map((w) => w.trim())
      .filter(Boolean);

    if (!rawWords.length) return;

    setSelectedWords((prev) => {
      const exist = new Set(prev.map((w) => w.word.toLowerCase()));
      const next = [...prev];

      for (const w of rawWords) {
        if (next.length >= MAX_WORDS) break;
        const lower = w.toLowerCase();
        if (!exist.has(lower)) {
          exist.add(lower);
          next.push({ word: w, mustInclude: false });
        }
      }
      return next;
    });

    setWordInput("");
  };

  // STEP1 – 칩 클릭(★ 토글)
  const toggleMustInclude = (word) => {
    setSelectedWords((prev) =>
      prev.map((w) =>
        w.word === word ? { ...w, mustInclude: !w.mustInclude } : w
      )
    );
  };

  // STEP1 – 칩 삭제
  const removeWordChip = (word) => {
    setSelectedWords((prev) => prev.filter((w) => w.word !== word));
  };

  // STEP2 – 테마 토글
  const toggleTheme = (id) => {
    setThemeId((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // STEP2 – 동화 요청
  async function handleRequestStory() {
    setStory("");
    setStoryError(null);

    const coreWords = selectedWords
      .map((w) => (typeof w === "string" ? w : w.word))
      .filter(Boolean);

    if (!coreWords.length) {
      setStoryError("먼저 단어를 1개 이상 선택해 주세요.");
      return;
    }

    setIsRequesting(true);
    try {
      const payload = {
        language,
        kidName: kidName || null,
        pov,
        themes: Array.isArray(themeId) ? themeId : [],
        length,
        words: coreWords,
        mustInclude: selectedWords
          .filter((w) => w.mustInclude)
          .map((w) => w.word),
      };

      // 실제 API 연동 대신, 일단은 임시 더미 스토리
      const fakeStory = `
Once upon a time, ${payload.kidName || "a little child"} went on an adventure
with words like ${payload.words.join(", ")}. (demo text)
      `.trim();

      setStory(fakeStory);
    } catch (err) {
      console.error(err);
      setStoryError("동화를 만드는 중 문제가 발생했습니다.");
    } finally {
      setIsRequesting(false);
    }
  }

  // 언어 토글
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="page-root">
      <header className="page-header">
        <h1>{pageTitle}</h1>
        <div className="lang-switch">
          <button
            className={language === "en" ? "active" : ""}
            onClick={() => handleLanguageChange("en")}
          >
            EN
          </button>
          <button
            className={language === "ko" ? "active" : ""}
            onClick={() => handleLanguageChange("ko")}
          >
            KO
          </button>
          <button
            className={language === "zh" ? "active" : ""}
            onClick={() => handleLanguageChange("zh")}
          >
            中文
          </button>
        </div>
      </header>

      {/* STEP 1 */}
      <section className="step-section step1">
        <h2>{step1Title}</h2>
        <p>{step1Description}</p>

        <AlphabetPicker
          selectedLetter={selectedLetter}
          onSelectLetter={setSelectedLetter}
        />

        <WordCardsGrid
          cards={cards}
          isLoading={cardsLoading}
          error={cardsError}
          onSelectWord={handleSelectCardWord}
          emptyMessage={step1NoCards}
        />

        <div className="word-input-block">
          <label>{step1InputLabel}</label>
          <div className="word-input-row">
            <input
              type="text"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              placeholder={step1InputPlaceholder}
            />
            <button type="button" onClick={handleAddWordsFromInput}>
              추가
            </button>
          </div>

          <p className="chips-hint">
            {chipsHint} {selectedWords.length}/{MAX_WORDS}
          </p>

          <div className="chips-row">
            {selectedWords.map((w) => (
              <button
                key={w.word}
                type="button"
                className={`chip ${w.mustInclude ? "must" : ""}`}
                onClick={() => toggleMustInclude(w.word)}
              >
                {w.word}
                {w.mustInclude && " ★"}
                <span
                  className="chip-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWordChip(w.word);
                  }}
                >
                  ×
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STEP 2 – 설정 UI */}
      <section className="step-section step2">
        <h2>{step2Title}</h2>
        <p>{step2Intro}</p>

        <Step2Story
          kidName={kidName}
          onChangeKidName={setKidName}
          pov={pov}
          onChangePov={setPov}
          themes={themeId}
          onToggleTheme={toggleTheme}
          length={length}
          onChangeLength={setLength}
          texts={{
            nameLabel: step2NameLabel,
            wayLabel: step2WayLabel,
            wayFirst: step2WayFirst,
            wayThird: step2WayThird,
            themeLabel: step2ThemeLabel,
            lengthLabel: step2LengthLabel,
            lengthShort: step2LengthShort,
            lengthNormal: step2LengthNormal,
            lengthLong: step2LengthLong,
          }}
        />

        <div className="request-row">
          <button
            type="button"
            onClick={handleRequestStory}
            disabled={isRequesting}
          >
            {isRequesting ? "동화 만드는 중..." : requestButtonLabel}
          </button>
        </div>

        <StoryResult story={story} error={storyError} />
      </section>
    </div>
  );
}
