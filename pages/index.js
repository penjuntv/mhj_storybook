// pages/index.js
import { useState, useMemo } from "react";
import { WORD_CARDS } from "../data/wordCards";

// Supabase 이미지 URL 헬퍼 ------------------------------
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const WORD_IMAGES_BUCKET = "word-images";
const DEFAULT_SET = "default_en";

function getWordImageUrl(alphabet, id) {
  // 예: alphabet = "M", id = "M_Milk"
  if (!SUPABASE_URL) return "";
  return `${SUPABASE_URL}/storage/v1/object/public/${WORD_IMAGES_BUCKET}/${DEFAULT_SET}/${alphabet}/${id}.png`;
}

// 공통 유틸 ---------------------------------------------
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function extractWordFromId(id) {
  // "M_Milk" -> "Milk"
  if (!id) return "";
  const parts = id.split("_");
  return (parts[1] || "").trim();
}

function parseWords(text) {
  // textarea 내용에서 칩용 단어 배열 만들기
  return text
    .split(/[,;\n]/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
}

// 메인 컴포넌트 -----------------------------------------
export default function HomePage() {
  const [selectedLetter, setSelectedLetter] = useState("A");

  // Step 1: 오늘 단어들
  const [todayWordsText, setTodayWordsText] = useState("");
  const wordChips = useMemo(() => parseWords(todayWordsText), [todayWordsText]);
  const [requiredWords, setRequiredWords] = useState([]); // ★ 표시된 단어들

  // Step 2: 아이디어
  const [idea, setIdea] = useState({
    character: "",
    place: "",
    event: "",
    ending: "",
  });

  // Step 3: 생성된 동화
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 현재 선택된 알파벳의 카드 목록
  const currentCards = WORD_CARDS[selectedLetter] || [];

  // 알파벳 버튼 클릭
  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
  };

  // 카드 클릭 → textarea에 단어 추가
  const handleWordCardClick = (card) => {
    const word = extractWordFromId(card.id);
    if (!word) return;

    setTodayWordsText((prev) => {
      if (!prev.trim()) return word;
      // 이미 들어있으면 중복 추가 안 함
      const existing = parseWords(prev);
      if (existing.includes(word)) return prev;
      return `${prev}, ${word}`;
    });
  };

  // 칩 클릭 → 필수 단어 토글 (★)
  const handleChipClick = (word) => {
    setRequiredWords((prev) => {
      if (prev.includes(word)) {
        return prev.filter((w) => w !== word);
      }
      return [...prev, word];
    });
  };

  // Step 3: 동화 생성 API 호출
  const handleGenerateStory = async () => {
    setIsLoading(true);
    setErrorMsg("");
    setStory("");

    try, {
      const response = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: wordChips,
          idea,
          requiredWords,
        }),
      });

      if (!response.ok) {
        throw new Error("Story API error");
      }

      const data = await response.json();
      setStory(data.story || "");
    } catch (err) {
      console.error(err);
      setErrorMsg("동화를 만드는 동안 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 스타일 (레이아웃용, CSS 안 건드리고 여기에서 처리)
  const cardsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))", // 항상 3열 → 최대 3+3
    gap: "24px",
    marginTop: "24px",
  };

  const wordCardStyle = {
    borderRadius: "24px",
    padding: "12px 12px 16px 12px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    border: "0",
    width: "100%",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const wordImageWrapperStyle = {
    width: "100%",
    aspectRatio: "4 / 3", // 가로 4 : 세로 3 비율로 조금 크게
    borderRadius: "20px",
    overflow: "hidden",
    backgroundColor: "#FFF7EC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
  };

  const wordImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const wordLabelStyle = {
    fontSize: "18px",
    fontWeight: 700,
    color: "#4A321A",
    marginTop: "4px",
  };

  return (
    <div className="page-root">
      <main className="page-main">
        <header className="page-header">
          <h1 className="page-title">
            AI Storybook – 오늘 배운 단어로 영어 동화 만들기
          </h1>
          <p className="page-subtitle">
            아이와 함께 오늘 배운 영어 단어를 넣고, 3–7세 아이를 위한 아주 쉬운 영어 동화를 만들어 보세요.
          </p>
        </header>

        {/* STEP 1 --------------------------------------------------- */}
        <section className="step-section">
          <h2 className="step-title">STEP 1 · Today&apos;s words</h2>

          <div className="step-card">
            <h3 className="block-title">오늘 배운 영어 단어 적기</h3>
            <p className="block-desc">
              오늘 수업·숙제·책에서 등장한 영어 단어를 적어 주세요. 쉼표(,)나 줄바꿈으로 구분하면 단어 칩이 자동으로 만들어집니다.
            </p>

            {/* 알파벳 선택 */}
            <div className="alphabet-picker">
              <p className="alphabet-label">알파벳 카드에서 단어 고르기:</p>
              <div className="alphabet-buttons">
                {LETTERS.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => handleLetterClick(letter)}
                    className={
                      letter === selectedLetter
                        ? "alphabet-button alphabet-button--active"
                        : "alphabet-button"
                    }
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {/* 단어 카드 그리드 (3 + 3, 이미지 확대) */}
            <div className="word-cards-block">
              <p className="block-subtitle">
                &quot;{selectedLetter}&quot; 로 시작하는 단어 카드
              </p>

              <div style={cardsGridStyle}>
                {currentCards.map((card) => {
                  const word = extractWordFromId(card.id);
                  const imgSrc = getWordImageUrl(selectedLetter, card.id);

                  return (
                    <button
                      key={card.id}
                      type="button"
                      style={wordCardStyle}
                      onClick={() => handleWordCardClick(card)}
                    >
                      <div style={wordImageWrapperStyle}>
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={word || card.id}
                            style={wordImageStyle}
                          />
                        ) : null}
                      </div>
                      <div style={wordLabelStyle}>{word}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 오늘 단어 입력 textarea */}
            <div className="today-words-input-block">
              <h4 className="block-subtitle">오늘 배운 영어 단어 적기</h4>
              <textarea
                className="today-words-textarea"
                value={todayWordsText}
                onChange={(e) => setTodayWordsText(e.target.value)}
                placeholder="apple, banana 처럼 입력한 뒤 바깥을 클릭해 보세요."
                rows={4}
              />
            </div>

            {/* 단어 칩 */}
            <div className="word-chips-block">
              <p className="chips-title">
                Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는 단어로 표시됩니다.
              </p>
              <div className="chips-row">
                {wordChips.length === 0 && (
                  <span className="chips-empty">
                    아직 입력된 단어가 없습니다.
                  </span>
                )}
                {wordChips.map((word) => {
                  const isRequired = requiredWords.includes(word);
                  return (
                    <button
                      key={word}
                      type="button"
                      className={
                        isRequired
                          ? "chip chip--required"
                          : "chip"
                      }
                      onClick={() => handleChipClick(word)}
                    >
                      {word}
                      {isRequired && <span className="chip-star">★</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2 --------------------------------------------------- */}
        <section className="step-section">
          <h2 className="step-title">STEP 2 · 아이가 원하는 이야기 설정</h2>

          <div className="step-card">
            <p className="block-desc">
              아이에게 물어보거나, 아이가 스스로 적게 해 주세요. 모두 간단한 한국어로 적어도 괜찮습니다.
            </p>

            <div className="idea-grid">
              <div className="idea-field">
                <label className="idea-label">주인공은 누구인가요?</label>
                <textarea
                  className="idea-textarea"
                  rows={2}
                  value={idea.character}
                  onChange={(e) =>
                    setIdea((prev) => ({ ...prev, character: e.target.value }))
                  }
                />
              </div>
              <div className="idea-field">
                <label className="idea-label">어디에서 벌어지는 이야기인가요?</label>
                <textarea
                  className="idea-textarea"
                  rows={2}
                  value={idea.place}
                  onChange={(e) =>
                    setIdea((prev) => ({ ...prev, place: e.target.value }))
                  }
                />
              </div>
              <div className="idea-field">
                <label className="idea-label">어떤 일이 일어나나요?</label>
                <textarea
                  className="idea-textarea"
                  rows={3}
                  value={idea.event}
                  onChange={(e) =>
                    setIdea((prev) => ({ ...prev, event: e.target.value }))
                  }
                />
              </div>
              <div className="idea-field">
                <label className="idea-label">이야기가 어떻게 끝나면 좋을까요?</label>
                <textarea
                  className="idea-textarea"
                  rows={3}
                  value={idea.ending}
                  onChange={(e) =>
                    setIdea((prev) => ({ ...prev, ending: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* STEP 3 --------------------------------------------------- */}
        <section className="step-section">
          <h2 className="step-title">STEP 3 · 영어 동화 만들기</h2>

          <div className="step-card">
            <p className="block-desc">
              위에서 적은 오늘의 단어들과 아이의 아이디어를 바탕으로, 아주 쉬운 영어 동화를 만듭니다.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={handleGenerateStory}
              disabled={isLoading || wordChips.length === 0}
            >
              {isLoading ? "동화 만드는 중..." : "영어 동화 만들기"}
            </button>

            {errorMsg && (
              <p className="error-text" style={{ marginTop: "12px" }}>
                {errorMsg}
              </p>
            )}

            {story && (
              <div className="story-output">
                <h3 className="block-subtitle">생성된 영어 동화</h3>
                <pre className="story-text">{story}</pre>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
