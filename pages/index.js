// pages/index.js
import { useEffect, useMemo, useState } from "react";
import { WORD_CARDS } from "../data/wordCards";

// 알파벳 버튼용 배열
const ALPHABETS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const MAX_WORDS = 8;

// WORD_CARDS에서 특정 알파벳에 해당하는 단어 카드만 추출
// WORD_CARDS 구조: { id: "M_Milk", imageUrl: "..." } 라고 가정
function getCardsByLetter(letter) {
  if (!Array.isArray(WORD_CARDS)) return [];

  return WORD_CARDS
    .filter(
      (card) =>
        card &&
        typeof card.id === "string" &&
        card.id.startsWith(`${letter}_`)
    )
    .map((card) => {
      const parts = card.id.split("_");
      const raw = parts[1] || "";
      const word =
        raw.length > 0
          ? raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
          : raw;
      return {
        id: card.id,
        word,
        imageUrl: card.imageUrl,
      };
    });
}

// 단어 비교용(대소문자 무시)
function normalizeWord(word) {
  return (word || "").trim().toLowerCase();
}

export default function HomePage() {
  const [selectedLetter, setSelectedLetter] = useState("A");

  // 오늘 선택된 단어들(진짜 상태)
  const [selectedWords, setSelectedWords] = useState([]);

  // textarea에 표시되는 문자열(= selectedWords를 보여주는 창)
  const [manualInput, setManualInput] = useState("");

  // Step 2 : 장소 / 행동 / 마무리
  const [storyPlace, setStoryPlace] = useState("");
  const [storyAction, setStoryAction] = useState("");
  const [storyEnding, setStoryEnding] = useState("");

  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 선택된 알파벳에 해당하는 카드 목록
  const wordCardsForLetter = useMemo(
    () => getCardsByLetter(selectedLetter),
    [selectedLetter]
  );

  // selectedWords 상태가 바뀔 때마다 textarea 내용도 동기화
  useEffect(() => {
    if (selectedWords.length === 0) {
      setManualInput("");
    } else {
      setManualInput(selectedWords.join(", "));
    }
  }, [selectedWords]);

  // 문자열을 단어 배열로 파싱
  const parseWordsFromText = (text) => {
    if (!text) return [];

    const roughTokens = text
      .split(/[\n,]/) // 쉼표, 줄바꿈 기준 분리
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const unique = [];
    for (const token of roughTokens) {
      const normalized = normalizeWord(token);
      if (!normalized) continue;

      // 이미 포함돼 있으면 스킵(대소문자 무시)
      if (
        !unique.some(
          (w) => normalizeWord(w) === normalized
        )
      ) {
        unique.push(token);
      }

      if (unique.length >= MAX_WORDS) break;
    }

    return unique;
  };

  // textarea에 타이핑할 때
  const handleManualInputChange = (e) => {
    const text = e.target.value;
    setManualInput(text);

    const parsed = parseWordsFromText(text);
    setSelectedWords(parsed);
  };

  // 카드 클릭 시 단어 토글
  const handleCardClick = (word) => {
    setSelectedWords((prev) => {
      const normalized = normalizeWord(word);
      const exists = prev.some(
        (w) => normalizeWord(w) === normalized
      );

      if (exists) {
        // 이미 있으면 제거
        return prev.filter(
          (w) => normalizeWord(w) !== normalized
        );
      }

      // 새로 추가
      if (prev.length >= MAX_WORDS) {
        // 더 이상 추가 불가
        return prev;
      }
      return [...prev, word];
    });
  };

  // chip 클릭: 제거
  const handleChipClick = (wordToRemove) => {
    setSelectedWords((prev) =>
      prev.filter(
        (w) =>
          normalizeWord(w) !== normalizeWord(wordToRemove)
      )
    );
  };

  // AI에게 동화 만들기 요청
  const handleCreateStory = async () => {
    setErrorMsg("");
    setStory("");

    if (selectedWords.length === 0) {
      setErrorMsg("먼저 오늘 배운 단어를 1개 이상 선택해 주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/storybook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          words: selectedWords,
          place: storyPlace,
          action: storyAction,
          ending: storyEnding,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error || "AI 동화 생성 중 오류가 발생했습니다."
        );
      }

      const data = await res.json();
      setStory(data.story || "");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.message ||
          "AI 동화 생성 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <main className="page-inner">
        {/* 제목 영역 */}
        <header className="page-header">
          <h1 className="page-title">
            AI Storybook – 오늘 배운 단어로 영어 동화 만들기
          </h1>
          <p className="page-subtitle">
            아이와 함께 오늘 배운 영어 단어를 넣고, 3~7세 아이를 위한
            아주 쉬운 영어 동화를 만들어 보세요.
          </p>
        </header>

        {/* STEP 1 */}
        <section className="step-section">
          <h2 className="step-title">
            STEP 1 · Today&apos;s words
          </h2>

          {/* 알파벳 선택 + 카드 리스트 */}
          <div className="card-section">
            <p className="section-label">
              알파벳 카드에서 단어 고르기:
            </p>

            {/* 알파벳 버튼들 */}
            <div className="alphabet-row">
              {ALPHABETS.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  className={
                    "alphabet-button" +
                    (letter === selectedLetter
                      ? " alphabet-button--active"
                      : "")
                  }
                  onClick={() => setSelectedLetter(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>

            <p className="section-hint">
              &quot;{selectedLetter}
              &quot; 로 시작하는 단어 카드
            </p>

            {/* 단어 카드: 3 x 2 그리드 */}
            <div className="word-card-grid">
              {wordCardsForLetter.length === 0 && (
                <p className="empty-message">
                  이 알파벳에는 아직 카드가 없습니다.
                </p>
              )}

              {wordCardsForLetter.map((card) => {
                const isSelected = selectedWords.some(
                  (w) =>
                    normalizeWord(w) ===
                    normalizeWord(card.word)
                );

                return (
                  <button
                    key={card.id}
                    type="button"
                    className={
                      "word-card" +
                      (isSelected
                        ? " word-card--selected"
                        : "")
                    }
                    onClick={() =>
                      handleCardClick(card.word)
                    }
                  >
                    {card.imageUrl && (
                      <div className="word-card-image-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={card.imageUrl}
                          alt={card.word}
                          className="word-card-image"
                        />
                      </div>
                    )}
                    <div className="word-card-label">
                      {card.word}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 오늘 배운 영어 단어 적기 (입력 + Word chips 출력) */}
          <div className="today-words-section">
            <label className="section-label">
              오늘 배운 영어 단어 적기
            </label>
            <textarea
              className="today-words-input"
              placeholder="apple, banana 처럼 쉼표(,)나 줄바꿈으로 단어를 구분해서 적어 주세요."
              value={manualInput}
              onChange={handleManualInputChange}
              rows={2}
            />

            <div className="chips-header-row">
              <p className="chips-label">
                Word chips (단어 칩) · 아래 단어 칩이
                오늘 동화에 꼭 들어갔으면 하는 단어입니다.
              </p>
              <p className="chips-count">
                {selectedWords.length}/{MAX_WORDS}
              </p>
            </div>

            <div className="chips-row">
              {selectedWords.length === 0 && (
                <span className="chips-empty-text">
                  아직 선택된 단어가 없습니다. 카드나
                  입력창으로 단어를 추가해 보세요.
                </span>
              )}

              {selectedWords.map((word) => (
                <button
                  key={word}
                  type="button"
                  className="word-chip"
                  onClick={() => handleChipClick(word)}
                >
                  <span className="word-chip-star">★</span>
                  <span className="word-chip-text">
                    {word}
                  </span>
                  <span className="word-chip-remove">
                    ×
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* STEP 2 : AI 동화 만들기 */}
        <section className="step-section">
          <h2 className="step-title">
            STEP 2 · AI에게 영어 동화 만들기 요청하기
          </h2>

          <p className="section-summary">
            아이가 고른 단어(2~8개)를 바탕으로 AI가 아주
            쉬운 영어 동화를 만들어 줍니다. 아래 옵션은
            비워 둬도 괜찮고, 아이와 함께 간단히 적어 봐도
            좋습니다.
          </p>

          <div className="story-options-grid">
            <div className="story-option">
              <label className="option-label">
                이야기 장소 (선택)
              </label>
              <input
                type="text"
                className="option-input"
                placeholder="at the park, at home, at the zoo..."
                value={storyPlace}
                onChange={(e) =>
                  setStoryPlace(e.target.value)
                }
              />
            </div>

            <div className="story-option">
              <label className="option-label">
                무엇을 했나요? (선택)
              </label>
              <input
                type="text"
                className="option-input"
                placeholder="picnic, birthday party, reading books..."
                value={storyAction}
                onChange={(e) =>
                  setStoryAction(e.target.value)
                }
              />
            </div>

            <div className="story-option">
              <label className="option-label">
                어떻게 끝났으면 좋겠나요? (선택)
              </label>
              <input
                type="text"
                className="option-input"
                placeholder="happy, funny, surprising..."
                value={storyEnding}
                onChange={(e) =>
                  setStoryEnding(e.target.value)
                }
              />
            </div>
          </div>

          <div className="story-button-row">
            <button
              type="button"
              className="primary-button"
              onClick={handleCreateStory}
              disabled={isLoading}
            >
              {isLoading
                ? "AI가 동화를 만드는 중..."
                : "AI에게 영어 동화 만들기 요청하기"}
            </button>
          </div>

          {errorMsg && (
            <p className="error-message">{errorMsg}</p>
          )}

          {story && (
            <article className="story-result">
              <h3 className="story-title">
                오늘의 AI 영어 동화
              </h3>
              <p className="story-text">
                {story.split("\n").map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </article>
          )}
        </section>
      </main>
    </div>
  );
}
