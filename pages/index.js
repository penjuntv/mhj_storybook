// pages/index.js
import { useMemo, useState } from "react";
import { WORD_CARDS } from "../data/wordCards";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_WORDS = 8;

// id: "A_airplane" -> "Airplane"
function idToWord(id) {
  if (!id) return "";
  const raw = id.split("_").slice(1).join(" "); // "airplane", "angry", "Astronaut"
  if (!raw) return "";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// Supabase public URL 생성
// word-images/default_en/{letter}/{id}.png
function buildImageUrl(letter, id) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${baseUrl}/storage/v1/object/public/word-images/default_en/${letter}/${id}.png`;
}

// 수동 입력 텍스트 -> 단어 배열
function textToTokens(text) {
  if (!text) return [];
  return text
    .split(/[,;\n]/)
    .map((w) => w.trim())
    .filter(Boolean);
}

// 다국어 UI 텍스트
const UI_TEXT = {
  en: {
    header: "AI Storybook – Make an English story with today's words",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "Write or choose today's English words from class, homework, or books.",
    pickFromCards: "Choose words from alphabet cards:",
    writeWordsLabel: "Write today's English words",
    writeWordsPlaceholder:
      "Type words like apple, banana, mom ... separated by commas or line breaks.",
    chipsLabel:
      "Word chips · Click a chip to toggle ★ (must include in story). Use ✕ to remove. ",
    selectedZero: "No words selected yet. Choose from cards or type words above.",
    countSuffix: "/8",
    step2Title: "STEP 2 · Ask AI to make a story",
    step2Subtitle:
      "AI will make a very easy English story using 2–8 words your child chose.",
    placeLabel: "Story place (optional)",
    actionLabel: "What happened? (optional)",
    endingLabel: "How should it end? (optional)",
    askButton: "Ask AI to make the story",
    loading: "AI is making the story...",
    errorPrefix: "Error: ",
    resultTitle: "AI made this story",
    suggestionsCaption:
      "You can also tap the buttons below to help your child choose.",
  },
  ko: {
    header: "AI Storybook – 오늘 배운 단어로 영어 동화 만들기",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "오늘 수업·숙제·책에서 등장한 영어 단어를 적거나, 아래 카드에서 골라 보세요.",
    pickFromCards: "알파벳 카드에서 단어 고르기:",
    writeWordsLabel: "오늘 배운 영어 단어 적기",
    writeWordsPlaceholder:
      "apple, banana, mom 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요.",
    chipsLabel:
      "Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는 단어로 표시됩니다. ✕로 삭제할 수 있습니다. ",
    selectedZero:
      "아직 선택된 단어가 없습니다. 카드나 입력창으로 단어를 추가해 보세요.",
    countSuffix: "/8",
    step2Title: "STEP 2 · AI에게 영어 동화 만들기 요청하기",
    step2Subtitle:
      "아이가 고른 단어(2~8개)를 바탕으로 AI가 아주 쉬운 영어 동화를 만들어 줍니다.",
    placeLabel: "이야기 장소 (선택)",
    actionLabel: "무엇을 했나요? (선택)",
    endingLabel: "어떻게 끝났으면 좋겠나요? (선택)",
    askButton: "AI에게 영어 동화 만들기 요청하기",
    loading: "AI 동화를 만드는 중입니다...",
    errorPrefix: "오류: ",
    resultTitle: "AI가 만든 영어 동화",
    suggestionsCaption:
      "아이가 고르기 쉽도록 아래 버튼을 눌러 장소·행동·마무리를 선택할 수도 있어요.",
  },
  zh: {
    header: "AI 故事書 – 用今天學到的單字做英文故事",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "請寫下或從卡片中選擇今天在課堂、作業或書裡出現的英文單字。",
    pickFromCards: "從字母卡片選單字：",
    writeWordsLabel: "寫下今天學到的英文單字",
    writeWordsPlaceholder:
      "輸入 apple, banana, mom 等單字，用逗號(,)或換行分開。",
    chipsLabel:
      "Word chips · 點一下單字就會加上 ★（一定要出現在故事裡），按 ✕ 可以刪除。",
    selectedZero: "還沒有選擇任何單字。請從卡片或輸入框中加入單字。",
    countSuffix: "/8",
    step2Title: "STEP 2 · 請 AI 做一個故事",
    step2Subtitle:
      "AI 會用孩子選的 2~8 個單字，做一個非常簡單的英文故事。",
    placeLabel: "故事地點（選填）",
    actionLabel: "發生了什麼事？（選填）",
    endingLabel: "故事怎麼結束？（選填）",
    askButton: "請 AI 做故事",
    loading: "AI 正在做故事…",
    errorPrefix: "錯誤: ",
    resultTitle: "AI 做出的故事",
    suggestionsCaption: "也可以點下面的按鈕，讓孩子自己選地點、行動和結局。",
  },
};

// 아이용 기본 추천 (정적) – storyIdeas API와는 별개로 안전하게 유지
const PLACE_SUGGESTIONS = [
  "at the park",
  "at home",
  "at school",
  "at the playground",
  "at the beach",
  "at grandma's house",
];

const ACTION_SUGGESTIONS = [
  "played together",
  "had a picnic",
  "read a book",
  "built something",
  "went on an adventure",
  "helped someone",
];

const ENDING_SUGGESTIONS = [
  "happy",
  "proud",
  "surprised",
  "sleepy",
  "excited",
  "calm",
];

export default function HomePage() {
  const [language, setLanguage] = useState("ko");
  const [selectedLetter, setSelectedLetter] = useState("A");

  // 카드 목록: WORD_CARDS + buildImageUrl 사용 (이전 버전과 동일 구조)
  const cardsForLetter = useMemo(() => {
    const list = WORD_CARDS[selectedLetter] || [];
    return list.map((card) => {
      const word = idToWord(card.id);
      const imageUrl = card.imageUrl || buildImageUrl(selectedLetter, card.id);
      return { ...card, word, imageUrl };
    });
  }, [selectedLetter]);

  // 단어 칩 상태
  const [selectedWords, setSelectedWords] = useState([]); // [{ word, mustInclude }]
  const [wordInput, setWordInput] = useState("");

  // 장소/행동/엔딩
  const [place, setPlace] = useState("");
  const [action, setAction] = useState("");
  const [ending, setEnding] = useState("");

  // 스토리
  const [story, setStory] = useState("");
  const [storyError, setStoryError] = useState("");
  const [isStoryLoading, setIsStoryLoading] = useState(false);

  const t = UI_TEXT[language] || UI_TEXT.ko;

  // ───────── 단어 칩 관리 ─────────

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

  const removeWordFromChips = (wordToRemove) => {
    setSelectedWords((prev) =>
      prev.filter(
        (w) => w.word.toLowerCase() !== wordToRemove.toLowerCase()
      )
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

  // 카드 클릭 → 칩에 추가
  const handleCardClick = (cardWord) => {
    addWordToChips(cardWord);
  };

  // 수동 입력 처리 (Enter/쉼표/blur 시)
  const processWordInput = () => {
    const tokens = textToTokens(wordInput);
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

  // ───────── 장소/행동/엔딩 추천 버튼 ─────────

  const handlePlaceSuggestionClick = (value) => setPlace(value);
  const handleActionSuggestionClick = (value) => setAction(value);
  const handleEndingSuggestionClick = (value) => setEnding(value);

  // ───────── 스토리 생성 ─────────

  const handleRequestStory = async () => {
    setStory("");
    setStoryError("");

    const wordsForStory = selectedWords.map((w) => w.word);
    if (wordsForStory.length < 2) {
      setStoryError("단어는 최소 2개 이상 선택해 주세요.");
      return;
    }

    setIsStoryLoading(true);
    try {
      const res = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: wordsForStory,
          idea: {
            character: "a child",
            place,
            event: action,
            ending,
          },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to call /api/storybook");
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStory(data.story || "");
    } catch (err) {
      console.error("Error generating story", err);
      setStoryError(err.message || "스토리를 생성하는 중 오류가 발생했습니다.");
    } finally {
      setIsStoryLoading(false);
    }
  };

  // ───────── 스타일 ─────────

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#FFF6EC",
      padding: "24px 12px 48px",
      display: "flex",
      justifyContent: "center",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, system-ui, 'Noto Sans KR', sans-serif",
      color: "#4a2f1a",
    },
    container: {
      maxWidth: "1080px",
      width: "100%",
      background: "#FFEFD9",
      borderRadius: "24px",
      padding: "32px 32px 40px",
      boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
    },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    langButtons: {
      display: "flex",
      gap: "8px",
    },
    langButton: (active) => ({
      padding: "4px 10px",
      borderRadius: "999px",
      border: active ? "0" : "1px solid #d9a36b",
      background: active ? "#FF8C41" : "transparent",
      color: active ? "#fff" : "#7a4c25",
      fontSize: "12px",
      cursor: "pointer",
      fontWeight: 600,
    }),
    stepBox: {
      background: "#FFE3C1",
      borderRadius: "20px",
      padding: "24px 24px 28px",
      marginBottom: "24px",
    },
    stepTitle: {
      fontSize: "16px",
      fontWeight: 700,
      marginBottom: "8px",
    },
    stepSubtitle: {
      fontSize: "13px",
      marginBottom: "16px",
      lineHeight: 1.4,
    },
    alphabetRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "16px",
    },
    alphabetButton: (active) => ({
      width: "38px",
      height: "38px",
      borderRadius: "999px",
      border: "0",
      background: active ? "#FF8C41" : "#FFF8F0",
      color: active ? "#fff" : "#7a4c25",
      boxShadow: active ? "0 0 0 2px rgba(0,0,0,0.08)" : "none",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "16px",
    }),
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))", // 윗줄3, 아랫줄3
      gap: "18px",
      marginBottom: "20px",
    },
    card: {
      background: "#FFF9F3",
      borderRadius: "24px",
      padding: "14px 14px 18px",
      boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "220px",
    },
    cardImageWrapper: {
      width: "100%",
      borderRadius: "20px",
      background: "#FFEFD9",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    cardImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
    textarea: {
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
    },
    chipsRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginTop: "8px",
    },
    chip: (mustInclude) => ({
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: "999px",
      background: "#FFF9F3",
      border: mustInclude ? "1px solid #FF8C41" : "1px solid #F2C199",
      fontSize: "13px",
      cursor: "pointer",
      boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
    }),
    chipStar: (mustInclude) => ({
      color: mustInclude ? "#FF8C41" : "#d0a17a",
      marginRight: "4px",
      fontSize: "13px",
    }),
    chipRemove: {
      marginLeft: "6px",
      fontSize: "13px",
      cursor: "pointer",
      opacity: 0.7,
    },
    suggestionsRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      margin: "6px 0 10px",
    },
    suggestionButton: {
      padding: "5px 10px",
      borderRadius: "999px",
      border: "0",
      background: "#FFF9F3",
      fontSize: "12px",
      cursor: "pointer",
      boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
    },
    primaryButton: {
      marginTop: "8px",
      padding: "11px 20px",
      borderRadius: "999px",
      border: "0",
      background: "#FF8C41",
      color: "#fff",
      fontSize: "15px",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 14px 26px rgba(0,0,0,0.14)",
    },
    storyBox: {
      marginTop: "18px",
      padding: "16px 18px",
      borderRadius: "16px",
      background: "#FFF9F3",
      whiteSpace: "pre-wrap",
      lineHeight: 1.5,
      fontSize: "14px",
    },
    errorText: {
      color: "#D23B3B",
      fontSize: "13px",
      marginTop: "6px",
    },
    smallCaption: {
      marginTop: "4px",
      fontSize: "12px",
      opacity: 0.8,
    },
  };

  const selectedCount = selectedWords.length;

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        {/* 헤더 + 언어 토글 */}
        <div style={styles.headerRow}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
            {t.header}
          </h1>
          <div style={styles.langButtons}>
            <button
              type="button"
              style={styles.langButton(language === "en")}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <button
              type="button"
              style={styles.langButton(language === "ko")}
              onClick={() => setLanguage("ko")}
            >
              KO
            </button>
            <button
              type="button"
              style={styles.langButton(language === "zh")}
              onClick={() => setLanguage("zh")}
            >
              中文
            </button>
          </div>
        </div>

        {/* STEP 1 */}
        <section style={styles.stepBox}>
          <div style={styles.stepTitle}>{t.step1Title}</div>
          <div style={styles.stepSubtitle}>{t.step1Subtitle}</div>

          <div style={{ fontSize: 13, marginBottom: 6 }}>{t.pickFromCards}</div>

          {/* 알파벳 버튼 */}
          <div style={styles.alphabetRow}>
            {LETTERS.map((letter) => (
              <button
                key={letter}
                type="button"
                style={styles.alphabetButton(letter === selectedLetter)}
                onClick={() => setSelectedLetter(letter)}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* 단어 카드 3x2 그리드 */}
          {cardsForLetter.length === 0 ? (
            <div style={{ fontSize: 13, margin: "8px 0 12px" }}>
              아직 이 알파벳에는 카드가 없습니다.
            </div>
          ) : (
            <div style={styles.cardsGrid}>
              {cardsForLetter.map((card) => (
                <button
                  type="button"
                  key={card.id}
                  style={styles.card}
                  onClick={() => handleCardClick(card.word)}
                >
                  <div style={styles.cardImageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.imageUrl}
                      alt={card.word}
                      style={styles.cardImage}
                    />
                  </div>
                  {/* 텍스트는 이미지 안에 있으니 여기서는 생략 */}
                </button>
              ))}
            </div>
          )}

          {/* 오늘 배운 단어 입력 */}
          <div
            style={{
              marginTop: 8,
              marginBottom: 4,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {t.writeWordsLabel}
          </div>
          <textarea
            style={styles.textarea}
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
            <div style={styles.chipsRow}>
              {selectedWords.map((item) => (
                <div
                  key={item.word}
                  style={styles.chip(item.mustInclude)}
                  onClick={() => toggleMustInclude(item.word)}
                >
                  <span style={styles.chipStar(item.mustInclude)}>★</span>
                  <span>{item.word}</span>
                  <span
                    style={styles.chipRemove}
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

        {/* STEP 2 */}
        <section style={styles.stepBox}>
          <div style={styles.stepTitle}>{t.step2Title}</div>
          <div style={styles.stepSubtitle}>{t.step2Subtitle}</div>

          {/* 장소 */}
          <label style={{ display: "block", fontSize: 14, fontWeight: 600 }}>
            {t.placeLabel}
          </label>
          <input
            type="text"
            style={{
              ...styles.textarea,
              minHeight: 0,
              height: 40,
              paddingTop: 6,
              paddingBottom: 6,
            }}
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />
          <div style={styles.suggestionsRow}>
            {PLACE_SUGGESTIONS.map((p) => (
              <button
                key={p}
                type="button"
                style={styles.suggestionButton}
                onClick={() => handlePlaceSuggestionClick(p)}
              >
                {p}
              </button>
            ))}
          </div>

          {/* 행동 */}
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              marginTop: 10,
            }}
          >
            {t.actionLabel}
          </label>
          <input
            type="text"
            style={{
              ...styles.textarea,
              minHeight: 0,
              height: 40,
              paddingTop: 6,
              paddingBottom: 6,
            }}
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
          <div style={styles.suggestionsRow}>
            {ACTION_SUGGESTIONS.map((a) => (
              <button
                key={a}
                type="button"
                style={styles.suggestionButton}
                onClick={() => handleActionSuggestionClick(a)}
              >
                {a}
              </button>
            ))}
          </div>

          {/* 엔딩 */}
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              marginTop: 10,
            }}
          >
            {t.endingLabel}
          </label>
          <input
            type="text"
            style={{
              ...styles.textarea,
              minHeight: 0,
              height: 40,
              paddingTop: 6,
              paddingBottom: 6,
            }}
            value={ending}
            onChange={(e) => setEnding(e.target.value)}
          />
          <div style={styles.suggestionsRow}>
            {ENDING_SUGGESTIONS.map((eText) => (
              <button
                key={eText}
                type="button"
                style={styles.suggestionButton}
                onClick={() => handleEndingSuggestionClick(eText)}
              >
                {eText}
              </button>
            ))}
          </div>

          <div style={styles.smallCaption}>{t.suggestionsCaption}</div>

          {/* 스토리 요청 버튼 */}
          <button
            type="button"
            style={styles.primaryButton}
            onClick={handleRequestStory}
            disabled={isStoryLoading}
          >
            {isStoryLoading ? t.loading : t.askButton}
          </button>

          {storyError && (
            <div style={styles.errorText}>
              {t.errorPrefix}
              {storyError}
            </div>
          )}

          {story && (
            <div style={styles.storyBox}>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 6,
                  fontSize: 15,
                }}
              >
                {t.resultTitle}
              </div>
              {story}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
