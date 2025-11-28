// pages/index.js

import { useState } from "react";
import { getUIText } from "../lib/uiText"; // 있어도 안 써도 무방. 호출만 함.
import useWordCards from "../hooks/useWordCards";
import AlphabetPicker from "../components/storybook/AlphabetPicker";
import WordCardsGrid from "../components/storybook/WordCardsGrid";
import Step2Story from "../components/storybook/Step2Story";
import StoryResult from "../components/storybook/StoryResult";

const MAX_WORDS = 8;

export default function HomePage() {
  const [language, setLanguage] = useState("ko"); // "en" | "ko" | "zh"
  const [selectedLetter, setSelectedLetter] = useState("A");

  const { cards } = useWordCards(selectedLetter);

  const [selectedWords, setSelectedWords] = useState([]); // [{ word, mustInclude }]
  const [wordInput, setWordInput] = useState("");

  // STEP 2 state
  const [kidName, setKidName] = useState("");
  const [pov, setPov] = useState("first"); // "first" | "third"
  const [themeId, setThemeId] = useState("everyday");
  const [length, setLength] = useState("normal");
  const [isRequesting, setIsRequesting] = useState(false);
  const [story, setStory] = useState("");
  const [storyError, setStoryError] = useState(null);

  // 일단 t는 호출만 하고, 실제 UI는 우리가 직접 작성
  const t = getUIText(language);

  // 단어 chip 추가
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

  // 입력창 -> 엔터/버튼
  const handleAddFromInput = () => {
    addWordToChips(wordInput);
    setWordInput("");
  };

  // chip 클릭 시 mustInclude 토글
  const toggleMustInclude = (word) => {
    setSelectedWords((prev) =>
      prev.map((item) =>
        item.word === word ? { ...item, mustInclude: !item.mustInclude } : item
      )
    );
  };

  // chip 삭제
  const removeWord = (word) => {
    setSelectedWords((prev) => prev.filter((item) => item.word !== word));
  };

  // "AI에게 영어 동화 만들기 요청하기"
  // 외부 API 없이, 프론트에서 간단한 영어 동화 문자열을 만들어 줌
  const handleRequestStory = async () => {
    if (!selectedWords.length) return;

    setIsRequesting(true);
    setStoryError(null);

    try {
      const name = kidName || "the child";
      const wordsList = selectedWords.map((w) => w.word).join(", ");

      const povText =
        pov === "first"
          ? "I am telling the story as the main character."
          : "The story is told about the child in third person.";

      const lengthSentences = length === "short" ? 4 : length === "normal" ? 7 : 10;

      const baseIntro =
        pov === "first"
          ? `My name is ${name}, and today is a very special day.`
          : `${name} is a curious child who loves learning new English words.`;

      const themeLineMap = {
        everyday: "It is an ordinary day that slowly turns into a small adventure.",
        school: "Everything happens around school, friends, and lessons.",
        family: "The family appears in the story and helps with kind support.",
        friends: "Friends play, talk, and help each other in this story.",
        animals: "Cute animals appear and talk, move, and play together.",
        princess: "A gentle, fairy-tale princess mood fills the story.",
        hero: "Brave, little-hero energy flows through the scenes.",
        fairytale: "The story feels like an old but warm fairytale.",
        animation: "Everything is described like a colourful animation movie.",
        space: "The scenes slowly move into space and stars like a soft SF story.",
      };

      const themeLine =
        themeLineMap[themeId] ||
        "The story feels soft, warm, and a little bit magical.";

      // 아주 단순한 문장 나열
      const bodySentences = [];
      for (let i = 0; i < lengthSentences - 2; i += 1) {
        const idx = i % selectedWords.length;
        const w = selectedWords[idx].word;
        const sentence =
          pov === "first"
            ? `I practise the word "${w}" while I move, look around, and talk.`
            : `${name} practises the word "${w}" while moving, looking around, and talking.`;
        bodySentences.push(sentence);
      }

      const ending =
        pov === "first"
          ? `At the end of the day, I feel proud because I can remember these words: ${wordsList}.`
          : `At the end of the day, ${name} smiles, feeling proud to remember these words: ${wordsList}.`;

      const fullStory =
        baseIntro +
        "\n\n" +
        themeLine +
        "\n\n" +
        povText +
        "\n\n" +
        bodySentences.join(" ") +
        "\n\n" +
        ending;

      setStory(fullStory);
    } catch (err) {
      console.error(err);
      setStoryError("동화를 만드는 중에 오류가 발생했습니다.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 40px 80px",
        background: "#fff7ec",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      }}
    >
      {/* 상단 타이틀 + 언어 선택 */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#4a2d1a",
          }}
        >
          AI Storybook – 오늘 배운 단어로 영어 동화 만들기
        </h1>
        <div
          style={{
            display: "flex",
            gap: 8,
            background: "#ffe7c6",
            padding: 4,
            borderRadius: 999,
          }}
        >
          {["en", "ko", "zh"].map((lang) => {
            const active = language === lang;
            const label = lang === "en" ? "EN" : lang === "ko" ? "KO" : "中文";
            return (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                style={{
                  border: "none",
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: 13,
                  cursor: "pointer",
                  background: active ? "#ff9a4b" : "transparent",
                  color: active ? "#fff" : "#7a5b3c",
                  fontWeight: active ? 700 : 500,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </header>

      {/* STEP 1 */}
      <section
        style={{
          padding: 32,
          borderRadius: 36,
          background: "#ffe0b8",
          boxShadow: "0 16px 40px rgba(214, 150, 90, 0.22)",
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#4a2d1a",
            marginBottom: 8,
          }}
        >
          STEP 1 · Today&apos;s words
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "#7a5b3c",
            marginBottom: 20,
          }}
        >
          오늘 수업·숙제·책에서 등장한 영어 단어를 적거나, 아래 카드에서 골라 보세요.
        </p>

        {/* 알파벳 선택 */}
        <AlphabetPicker
          selected={selectedLetter}
          onSelect={setSelectedLetter}
        />

        {/* 카드 그리드 */}
        <WordCardsGrid cards={cards} onCardClick={handleCardClick} />

        {/* 단어 입력 */}
        <div style={{ marginTop: 32 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#4a2d1a",
              marginBottom: 10,
            }}
          >
            오늘 배운 영어 단어 적기
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <input
              type="text"
              placeholder='apple, banana, mom 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요.'
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddFromInput();
                }
              }}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 999,
                border: "1px solid #e1c8aa",
                fontSize: 15,
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={handleAddFromInput}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                border: "none",
                background: "#ff9a4b",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              추가
            </button>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#8b6a4d",
              marginBottom: 6,
            }}
          >
            Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면
            하는 단어로 표시됩니다. X로 삭제할 수 있습니다. {selectedWords.length}/
            {MAX_WORDS}
          </p>

          {/* 선택된 단어 칩 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {selectedWords.length === 0 ? (
              <span
                style={{
                  fontSize: 13,
                  color: "#a07349",
                }}
              >
                아직 선택된 단어가 없습니다. 카드나 입력창으로 단어를 추가해 보세요.
              </span>
            ) : (
              selectedWords.map((item) => (
                <div
                  key={item.word}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: item.mustInclude ? "#ffd79b" : "#fff2da",
                    border: item.mustInclude
                      ? "1px solid #ff9a4b"
                      : "1px solid #e1c8aa",
                    fontSize: 13,
                    color: "#5d4631",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleMustInclude(item.word)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    {item.mustInclude ? "★" : "☆"}
                  </button>
                  <span>{item.word}</span>
                  <button
                    type="button"
                    onClick={() => removeWord(item.word)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* STEP 2 */}
      <Step2Story
        kidName={kidName}
        setKidName={setKidName}
        pov={pov}
        setPov={setPov}
        themeId={themeId}
        setThemeId={setThemeId}
        length={length}
        setLength={setLength}
        selectedWords={selectedWords}
        onRequestStory={handleRequestStory}
        isRequesting={isRequesting}
      />

      {/* 결과 동화 */}
      {storyError && (
        <p
          style={{
            marginTop: 16,
            color: "#c0392b",
            fontSize: 14,
          }}
        >
          {storyError}
        </p>
      )}
      <StoryResult story={story} />
    </main>
  );
}
