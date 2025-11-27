// pages/index.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_WORDS = 8;

function toTitleCase(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export default function HomePage() {
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [wordCards, setWordCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(false);

  // 오늘 배운 단어들 (칩 + 텍스트 영역)
  const [selectedWords, setSelectedWords] = useState([]); // ["apple", ...]
  const [wordsInput, setWordsInput] = useState(""); // "apple, banana"
  const [wordError, setWordError] = useState("");

  // STEP 2 – 장소/행동/스토리
  const [placeOptions, setPlaceOptions] = useState([]); // ["at the playground", ...]
  const [selectedPlace, setSelectedPlace] = useState("");
  const [eventOptions, setEventOptions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [story, setStory] = useState("");
  const [step2Error, setStep2Error] = useState("");
  const [loadingStage, setLoadingStage] = useState(null); // "places" | "events" | "story" | null

  // 공통 에러 표시 (API 등)
  const [globalError, setGlobalError] = useState("");

  // ---------- Supabase에서 알파벳별 카드 이미지 불러오기 ----------
  useEffect(() => {
    async function loadCards(letter) {
      try {
        setCardsLoading(true);
        setGlobalError("");

        const folderPath = `default_en/${letter}`;
        const { data, error } = await supabase.storage
          .from("word-images")
          .list(folderPath, { sortBy: { column: "name", order: "asc" } });

        if (error) {
          console.error("Supabase list error:", error);
          setGlobalError("단어 카드를 불러오는 중 문제가 발생했습니다.");
          setWordCards([]);
          return;
        }

        const files = data || [];
        const cards = files
          .filter((file) => {
            // 알파벳 대표 카드(예: M.png)는 제외
            const lower = file.name.toLowerCase();
            return !lower.startsWith(`${letter.toLowerCase()}.`);
          })
          .map((file) => {
            const nameWithoutExt = file.name.replace(/\.png$/i, "");
            // 예: "M_Moon" -> "Moon"
            const parts = nameWithoutExt.split("_");
            const rawWord = parts.length > 1 ? parts.slice(1).join("_") : parts[0];
            const displayWord = rawWord.replace(/_/g, " ");
            const word = toTitleCase(displayWord.trim());

            const path = `${folderPath}/${file.name}`;
            const { data: publicUrlData } = supabase.storage
              .from("word-images")
              .getPublicUrl(path);

            return {
              id: nameWithoutExt,
              word,
              imageUrl: publicUrlData?.publicUrl || "",
            };
          });

        setWordCards(cards);
      } catch (e) {
        console.error("loadCards error:", e);
        setGlobalError("단어 카드를 불러오는 중 문제가 발생했습니다.");
        setWordCards([]);
      } finally {
        setCardsLoading(false);
      }
    }

    loadCards(selectedLetter);
  }, [selectedLetter]);

  // ---------- 단어 선택/입력 관련 ----------

  // selectedWords -> wordsInput 동기화
  useEffect(() => {
    if (selectedWords.length === 0) {
      setWordsInput("");
    } else {
      setWordsInput(selectedWords.join(", "));
    }
  }, [selectedWords]);

  function addWord(word) {
    setWordError("");
    setStep2Error("");
    setGlobalError("");

    if (!word) return;

    // 이미 선택된 단어면 무시 (중복 방지)
    if (selectedWords.includes(word)) return;

    if (selectedWords.length >= MAX_WORDS) {
      setWordError(`단어는 최대 ${MAX_WORDS}개까지 선택할 수 있어요.`);
      return;
    }

    setSelectedWords([...selectedWords, word]);
  }

  function removeWord(word) {
    setSelectedWords(selectedWords.filter((w) => w !== word));
    // 장소/행동 추천은 단어 목록이 바뀌면 무효화
    resetStep2();
  }

  function handleCardClick(cardWord) {
    addWord(cardWord);
  }

  function handleWordsInputChange(e) {
    const value = e.target.value;
    setWordsInput(value);
    setWordError("");
    setStep2Error("");
    setGlobalError("");

    // 쉼표 기준으로 잘라서 단어 배열 만들기
    const rawPieces = value
      .split(",")
      .map((piece) => piece.trim())
      .filter((piece) => piece.length > 0);

    // 최대 8개까지만 사용
    if (rawPieces.length > MAX_WORDS) {
      setWordError(`단어는 최대 ${MAX_WORDS}개까지 사용할 수 있어요.`);
    }

    const limited = rawPieces.slice(0, MAX_WORDS).map((w) => toTitleCase(w));
    // 중복 제거
    const unique = Array.from(new Set(limited));

    setSelectedWords(unique);
    resetStep2();
  }

  // ---------- STEP 2 관련 상태 리셋 ----------

  function resetStep2() {
    setPlaceOptions([]);
    setSelectedPlace("");
    setEventOptions([]);
    setSelectedEvent("");
    setStory("");
    setStep2Error("");
    setLoadingStage(null);
  }

  // ---------- STEP 2: 장소 추천 요청 ----------

  async function handleSuggestPlaces() {
    setStep2Error("");
    setGlobalError("");
    setPlaceOptions([]);
    setSelectedPlace("");
    setEventOptions([]);
    setSelectedEvent("");
    setStory("");

    if (selectedWords.length < 2) {
      setStep2Error("단어는 최소 2개 이상 선택해 주세요.");
      return;
    }

    setLoadingStage("places");
    try {
      const response = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "suggestPlaces",
          words: selectedWords,
        }),
      });

      if (!response.ok) {
        throw new Error("장소 추천 API 오류");
      }

      const data = await response.json();
      const places = Array.isArray(data.places) ? data.places : [];
      setPlaceOptions(places);
      if (places.length === 0) {
        setStep2Error("장소를 만들지 못했어요. 단어를 조금 바꿔서 다시 시도해 주세요.");
      }
    } catch (e) {
      console.error("handleSuggestPlaces error:", e);
      setGlobalError("장소를 추천받는 중 문제가 발생했습니다.");
    } finally {
      setLoadingStage(null);
    }
  }

  // ---------- STEP 2: 행동(무엇을 했는지) 추천 ----------

  async function handleSuggestEvents() {
    setStep2Error("");
    setGlobalError("");
    setEventOptions([]);
    setSelectedEvent("");
    setStory("");

    if (!selectedPlace) {
      setStep2Error("먼저 장소를 하나 선택해 주세요.");
      return;
    }

    setLoadingStage("events");
    try {
      const response = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "suggestEvents",
          words: selectedWords,
          place: selectedPlace,
        }),
      });

      if (!response.ok) {
        throw new Error("행동 추천 API 오류");
      }

      const data = await response.json();
      const events = Array.isArray(data.events) ? data.events : [];
      setEventOptions(events);
      if (events.length === 0) {
        setStep2Error("무엇을 했는지 아이디어를 만들지 못했어요. 다시 시도해 주세요.");
      }
    } catch (e) {
      console.error("handleSuggestEvents error:", e);
      setGlobalError("무엇을 했는지 아이디어를 만드는 중 문제가 발생했습니다.");
    } finally {
      setLoadingStage(null);
    }
  }

  // ---------- STEP 2: 최종 동화 생성 ----------

  async function handleCreateStory() {
    setStep2Error("");
    setGlobalError("");
    setStory("");

    if (!selectedPlace) {
      setStep2Error("장소를 먼저 선택해 주세요.");
      return;
    }
    if (!selectedEvent) {
      setStep2Error("무엇을 했는지 아이디어를 하나 골라 주세요.");
      return;
    }

    setLoadingStage("story");
    try {
      const response = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "createStory",
          words: selectedWords,
          place: selectedPlace,
          event: selectedEvent,
        }),
      });

      if (!response.ok) {
        throw new Error("스토리 생성 API 오류");
      }

      const data = await response.json();
      if (data.story) {
        setStory(data.story);
      } else {
        setStep2Error("동화를 만들지 못했어요. 다시 시도해 주세요.");
      }
    } catch (e) {
      console.error("handleCreateStory error:", e);
      setGlobalError("동화를 만드는 중 문제가 발생했습니다.");
    } finally {
      setLoadingStage(null);
    }
  }

  // ---------- 렌더링 ----------

  return (
    <main className="page">
      <header className="page-header">
        <div className="logo">MHJ STORYBOOK</div>
        <div className="lang-switch">
          <button className="lang-btn">EN</button>
          <button className="lang-btn lang-btn-active">KO</button>
          <button className="lang-btn">中文</button>
        </div>
      </header>

      <section className="page-hero">
        <h1 className="page-title">
          AI Storybook – 오늘 배운 단어로 영어 동화 만들기
        </h1>
        <p className="page-subtitle">
          아이와 함께 오늘 배운 영어 단어를 넣고, 3–7세 아이를 위한 아주 쉬운 영어
          동화를 만들어 보세요.
        </p>
      </section>

      {globalError && (
        <div className="alert alert-error" style={{ marginBottom: "16px" }}>
          {globalError}
        </div>
      )}

      {/* STEP 1 */}
      <section className="step-box">
        <div className="step-header">
          <span className="step-label">STEP 1 · Today&apos;s words</span>
          <h2 className="step-title">오늘 배운 영어 단어 적기</h2>
          <p className="step-desc">
            오늘 수업·숙제·책에서 등장한 영어 단어를 적어 주세요. 쉼표(,)나 줄바꿈으로
            구분하면 단어 칩이 자동으로 만들어집니다.
          </p>
        </div>

        {/* 알파벳 선택 */}
        <div className="alphabet-box">
          <p className="alphabet-caption">알파벳 카드에서 단어 고르기:</p>
          <div className="alphabet-row">
            {LETTERS.map((letter) => (
              <button
                key={letter}
                type="button"
                className={
                  "alphabet-btn" +
                  (letter === selectedLetter ? " alphabet-btn-active" : "")
                }
                onClick={() => {
                  setSelectedLetter(letter);
                }}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* 단어 카드 영역 */}
        <div className="cards-section">
          <p className="cards-caption">
            &quot;{selectedLetter}&quot; 로 시작하는 단어 카드
          </p>

          {cardsLoading ? (
            <p className="helper-text">단어 카드를 불러오는 중입니다…</p>
          ) : (
            <div className="word-card-grid">
              {wordCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className="word-card"
                  onClick={() => handleCardClick(card.word)}
                >
                  <div className="word-card-image-wrap">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.word}
                        className="word-card-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="word-card-image word-card-image-placeholder" />
                    )}
                  </div>
                  <div className="word-card-label">{card.word}</div>
                </button>
              ))}

              {!cardsLoading && wordCards.length === 0 && (
                <p className="helper-text">이 알파벳에는 아직 카드가 없습니다.</p>
              )}
            </div>
          )}
        </div>

        {/* 오늘 배운 단어 입력 + 칩 */}
        <div className="words-input-section">
          <h3 className="sub-title">오늘 배운 영어 단어 적기</h3>
          <textarea
            className="words-textarea"
            rows={3}
            placeholder="apple, banana 처럼 입력한 뒤 빈칸을 클릭해 보세요."
            value={wordsInput}
            onChange={handleWordsInputChange}
          />
          {wordError && <p className="helper-text helper-text-error">{wordError}</p>}

          <div className="chips-wrapper">
            <div className="chips-header">
              <span className="chips-title">
                Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭
                들어갔으면 하는 단어로 표시됩니다.
              </span>
              <span className="chips-count">
                {selectedWords.length}/{MAX_WORDS}
              </span>
            </div>
            <div className="chips-row">
              {selectedWords.length === 0 && (
                <span className="helper-text small">
                  아직 선택된 단어가 없습니다. 카드나 텍스트로 단어를 추가해 보세요.
                </span>
              )}
              {selectedWords.map((word) => (
                <div key={word} className="chip">
                  <span className="chip-star">★</span>
                  <span className="chip-label">{word}</span>
                  <button
                    type="button"
                    className="chip-remove"
                    onClick={() => removeWord(word)}
                    aria-label={`${word} 삭제`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2 */}
      <section className="step-box">
        <div className="step-header">
          <span className="step-label">STEP 2 · AI가 만든 영어 동화</span>
          <h2 className="step-title">AI에게 영어 동화 만들기 요청하기</h2>
          <p className="step-desc">
            아이가 고른 단어(2–8개)를 바탕으로 AI가 장소를 6개 추천해 주고, 선택한
            장소를 기준으로 또 6개의 &quot;무엇을 했는지&quot; 아이디어를 제안합니다.
            마지막으로 단어 + 장소 + 행동을 바탕으로 아주 쉬운 영어 동화를 만들어 줍니다.
          </p>
        </div>

        {/* 장소 추천 버튼 */}
        <div className="step2-section">
          <button
            type="button"
            className="primary-btn"
            onClick={handleSuggestPlaces}
            disabled={loadingStage === "places" || selectedWords.length === 0}
          >
            {loadingStage === "places"
              ? "AI가 장소를 떠올리는 중…"
              : "AI에게 장소 추천 받기"}
          </button>
          <p className="helper-text small">
            단어를 2개 이상 선택하면 AI가 동화에 어울리는 장소 6개를 만들어 줍니다.
          </p>
        </div>

        {/* 장소 옵션 */}
        {placeOptions.length > 0 && (
          <div className="step2-section">
            <h3 className="sub-title">장소 고르기</h3>
            <div className="option-grid">
              {placeOptions.map((place) => (
                <button
                  key={place}
                  type="button"
                  className={
                    "option-btn" +
                    (place === selectedPlace ? " option-btn-active" : "")
                  }
                  onClick={() => {
                    setSelectedPlace(place);
                    // 장소 바꾸면 이벤트/스토리 리셋
                    setEventOptions([]);
                    setSelectedEvent("");
                    setStory("");
                  }}
                >
                  {place}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="secondary-btn"
              onClick={handleSuggestEvents}
              disabled={
                !selectedPlace ||
                loadingStage === "events" ||
                selectedWords.length === 0
              }
            >
              {loadingStage === "events"
                ? "AI가 무엇을 했는지 떠올리는 중…"
                : "이 장소에서 무엇을 했는지 아이디어 보기"}
            </button>
          </div>
        )}

        {/* 행동 옵션 */}
        {eventOptions.length > 0 && (
          <div className="step2-section">
            <h3 className="sub-title">이 장소에서 무엇을 했을까요?</h3>
            <div className="option-grid">
              {eventOptions.map((ev) => (
                <button
                  key={ev}
                  type="button"
                  className={
                    "option-btn" +
                    (ev === selectedEvent ? " option-btn-active" : "")
                  }
                  onClick={() => {
                    setSelectedEvent(ev);
                    setStory("");
                  }}
                >
                  {ev}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 동화 만들기 버튼 */}
        <div className="step2-section">
          <button
            type="button"
            className="primary-btn"
            onClick={handleCreateStory}
            disabled={
              loadingStage === "story" ||
              selectedWords.length === 0 ||
              !selectedPlace ||
              !selectedEvent
            }
          >
            {loadingStage === "story"
              ? "AI가 동화를 만드는 중…"
              : "AI에게 영어 동화 만들기"}
          </button>
        </div>

        {(step2Error || story) && (
          <div className="step2-result">
            {step2Error && (
              <div className="alert alert-error">{step2Error}</div>
            )}
            {story && (
              <div className="story-box">
                <h3 className="sub-title">AI가 만든 영어 동화</h3>
                <div className="story-text">
                  {story.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
