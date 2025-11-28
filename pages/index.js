// pages/index.js
import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";

// Supabase storage 설정
const BUCKET_NAME = "word-images";
const BASE_FOLDER = "default_en";

// 알파벳 상수
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LETTER_ROWS = [LETTERS.slice(0, 13), LETTERS.slice(13)];
const MAX_WORDS = 8;

// 다국어 UI 텍스트
const UI_TEXT = {
  en: {
    appTitle: "AI Storybook – Make an English story with today's words",
    appSubtitle:
      "Together with your child, put in today's English words and create a very easy English story for 3–7 year olds.",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "Write today's English words from class, homework, or books, or choose from the alphabet cards below.",
    pickFromCards: "Choose words from alphabet cards:",
    cardTitle: (letter) => `Cards starting with “${letter}”`,
    noCards: "There are no cards for this alphabet yet.",
    writeWordsLabel: "Write today's English words",
    writeWordsPlaceholder:
      "Type words like apple, banana, mom ... separated by commas or line breaks.",
    chipsLabel:
      "Word chips · Click a chip to toggle ★ (must include in the story). Use ✕ to remove. ",
    selectedZero:
      "No words selected yet. Add words from the cards or the text box above.",
    countSuffix: "/8",

    step2Title: "STEP 2 · Ask AI to make a story",
    step2Subtitle:
      "AI will make a very easy English story using 2–8 of the words your child chose. You can leave the options empty or fill them in together.",
    childInfoTitle: "Information about the child who will hear the story",
    childNameLabel: "Name (example: Yujin)",
    childAgeLabel: "Age",
    perspectiveLabel: "Story perspective",
    perspectiveFirstPerson: 'Tell the story as "I"',
    perspectiveThirdPerson: "Tell the story about the child",

    ideasTitle: "Get AI suggestions for place & action",
    ideasHelper: "(Select at least 2 words, then tap the button.)",
    placeLabel: "Story place (optional)",
    actionLabel: "What happened? (optional)",
    endingLabel: "How should it end? (optional)",
    suggestionsCaption:
      "You can tap the buttons below so your child can choose a place and an action.",
    askIdeasButton: "Ask AI for place & action ideas",

    askStoryButton: "Ask AI to make the story",
    loadingStory: "AI is making the story...",
    loadingIdeas: "AI is thinking of ideas...",
    errorPrefix: "Error: ",
    ideasErrorPrefix: "Ideas error: ",
    storyResultTitle: "AI made this story",
    needWordsForIdeas:
      "Please choose at least 2 words before asking for ideas.",
    needWordsForStory: "Please select at least 2 words for the story.",
  },
  ko: {
    appTitle: "AI Storybook – 오늘 배운 단어로 영어 동화 만들기",
    appSubtitle:
      "아이와 함께 오늘 배운 영어 단어를 넣고, 3~7세 아이를 위한 아주 쉬운 영어 동화를 만들어 보세요.",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "오늘 수업·숙제·책에서 등장한 영어 단어를 적거나, 아래 카드에서 골라 보세요.",
    pickFromCards: "알파벳 카드에서 단어 고르기:",
    cardTitle: (letter) => `"${letter}" 로 시작하는 단어 카드`,
    noCards: "아직 이 알파벳에는 카드가 없습니다.",
    writeWordsLabel: "오늘 배운 영어 단어 적기",
    writeWordsPlaceholder:
      "apple, banana, mom 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요.",
    chipsLabel:
      "Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는 단어로 표시됩니다. ✕로 삭제할 수 있습니다. ",
    selectedZero:
      "아직 선택된 단어가 없습니다. 카드나 입력창으로 단어를 추가해 보세요.",
    countSuffix: "/8",

    step2Title: "STEP 2 · AI가 만든 영어 동화",
    step2Subtitle:
      "아이가 고른 단어(2~8개)를 바탕으로 AI가 아주 쉬운 영어 동화를 만들어 줍니다. 아래 옵션은 비워 둬도 괜찮고, 아이와 함께 간단히 적어 봐도 좋습니다.",
    childInfoTitle: "이야기를 들려줄 아이 정보",
    childNameLabel: "이름 (예: Yujin)",
    childAgeLabel: "나이",
    perspectiveLabel: "이야기 방식",
    perspectiveFirstPerson: '아이가 "나(I)"로 이야기하기',
    perspectiveThirdPerson: "아이 이야기를 밖에서 들려주기",

    ideasTitle: "AI에게 장소·행동 아이디어 추천받기",
    ideasHelper: "(단어를 2개 이상 고른 뒤 눌러 주세요.)",
    placeLabel: "이야기 장소 (선택)",
    actionLabel: "무엇을 했나요? (선택)",
    endingLabel: "어떻게 끝났으면 좋겠나요? (선택)",
    suggestionsCaption:
      "아이가 고르기 쉽도록 아래 버튼을 눌러 장소·행동을 선택할 수도 있어요.",
    askIdeasButton: "AI에게 장소·행동 아이디어 추천받기",

    askStoryButton: "AI에게 영어 동화 만들기 요청하기",
    loadingStory: "AI 동화를 만드는 중입니다...",
    loadingIdeas: "AI가 아이디어를 생각하는 중입니다...",
    errorPrefix: "오류: ",
    ideasErrorPrefix: "아이디어 오류: ",
    storyResultTitle: "AI가 만든 영어 동화",
    needWordsForIdeas: "아이디어를 받기 전에 단어를 최소 2개 이상 골라 주세요.",
    needWordsForStory: "동화를 만들기 위해 단어를 최소 2개 이상 선택해 주세요.",
  },
  zh: {
    appTitle: "AI 故事書 – 用今天學到的單字做英文故事",
    appSubtitle:
      "和孩子一起把今天學到的英文單字放進去，為 3–7 歲孩子做一個非常簡單的英文故事。",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "寫下今天在課堂、作業或書裡出現的英文單字，或從下面的字母卡片中選擇。",
    pickFromCards: "從字母卡片選單字：",
    cardTitle: (letter) => `以「${letter}」開頭的單字卡片`,
    noCards: "這個字母還沒有卡片。",
    writeWordsLabel: "寫下今天學到的英文單字",
    writeWordsPlaceholder:
      "輸入 apple, banana, mom 等單字，用逗號(,)或換行分開。",
    chipsLabel:
      "Word chips · 點一下單字就會加上 ★（一定要出現在故事裡），按 ✕ 可以刪除。",
    selectedZero: "還沒有選擇任何單字。請從卡片或輸入框中加入單字。",
    countSuffix: "/8",

    step2Title: "STEP 2 · 請 AI 做一個故事",
    step2Subtitle:
      "AI 會用孩子選的 2–8 個單字，做一個非常簡單的英文故事。下面的選項可以空著，也可以和孩子一起填寫。",
    childInfoTitle: "要聽故事的孩子",
    childNameLabel: "名字（例：Yujin）",
    childAgeLabel: "年齡",
    perspectiveLabel: "敘述方式",
    perspectiveFirstPerson: "用「我(I)」說故事",
    perspectiveThirdPerson: "用孩子的名字說故事",

    ideasTitle: "請 AI 提供地點與行動的點子",
    ideasHelper: "（先選至少 2 個單字再按。）",
    placeLabel: "故事地點（選填）",
    actionLabel: "發生了什麼事？（選填）",
    endingLabel: "故事怎麼結束？（選填）",
    suggestionsCaption: "也可以點下面的按鈕，讓孩子自己選地點和行動。",
    askIdeasButton: "請 AI 提供地點與行動的點子",

    askStoryButton: "請 AI 做故事",
    loadingStory: "AI 正在做故事…",
    loadingIdeas: "AI 正在想點子…",
    errorPrefix: "錯誤: ",
    ideasErrorPrefix: "點子錯誤: ",
    storyResultTitle: "AI 做出的故事",
    needWordsForIdeas: "請先選至少 2 個單字再請 AI 提供點子。",
    needWordsForStory: "要做故事請先選至少 2 個單字。",
  },
};

export default function HomePage() {
  const [language, setLanguage] = useState("ko"); // "en" | "ko" | "zh"
  const t = UI_TEXT[language] || UI_TEXT.ko;

  const [selectedLetter, setSelectedLetter] = useState("A");

  const [cards, setCards] = useState([]); // [{ id, word, imageUrl }]
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [cardsError, setCardsError] = useState("");

  const [selectedWords, setSelectedWords] = useState([]); // [{ word, mustInclude }]
  const [wordInput, setWordInput] = useState("");

  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [perspective, setPerspective] = useState("firstPerson"); // "firstPerson" | "thirdPerson"

  const [place, setPlace] = useState("");
  const [action, setAction] = useState("");
  const [ending, setEnding] = useState("");

  const [placeIdeas, setPlaceIdeas] = useState([]);
  const [actionIdeas, setActionIdeas] = useState([]);
  const [ideasError, setIdeasError] = useState("");
  const [isIdeasLoading, setIsIdeasLoading] = useState(false);

  const [story, setStory] = useState("");
  const [storyError, setStoryError] = useState("");
  const [isStoryLoading, setIsStoryLoading] = useState(false);

  const selectedCount = selectedWords.length;

  // ──────────────────────────────
  // 1) Supabase에서 알파벳별 카드 로딩
  // ──────────────────────────────
  useEffect(() => {
    let isCancelled = false;

    async function loadCards() {
      setIsLoadingCards(true);
      setCardsError("");
      try {
        const folderPath = `${BASE_FOLDER}/${selectedLetter}`;

        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .list(folderPath, {
            limit: 50,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
          });

        if (error) throw error;

        if (!data) {
          if (!isCancelled) setCards([]);
          return;
        }

        const imageFiles = data.filter((file) =>
          file.name.toLowerCase().match(/\.(png|jpg|jpeg|webp)$/)
        );

        const newCards = imageFiles.map((file) => {
          const fullPath = `${folderPath}/${file.name}`;
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fullPath);

          // 예: "A_airplane.png" → "airplane" → "Airplane"
          let word = file.name;
          if (word.includes("_")) {
            const parts = word.split("_");
            parts.shift();
            word = parts.join("_");
          }
          word = word.replace(/\.[^/.]+$/, "");
          if (word.length > 0) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
          }

          return {
            id: fullPath,
            word,
            imageUrl: publicUrlData?.publicUrl || "",
          };
        });

        if (!isCancelled) {
          setCards(newCards);
        }
      } catch (err) {
        console.error("Failed to load cards", err);
        if (!isCancelled) {
          setCardsError("카드를 불러오는 중 문제가 발생했습니다.");
          setCards([]);
        }
      } finally {
        if (!isCancelled) setIsLoadingCards(false);
      }
    }

    loadCards();

    return () => {
      isCancelled = true;
    };
  }, [selectedLetter]);

  // ──────────────────────────────
  // 2) 단어 칩 관리
  // ──────────────────────────────
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

  const handleCardClick = (cardWord) => {
    addWordToChips(cardWord);
  };

  // 수동 입력 처리: 쉼표 / 엔터 / blur 시 반영
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

  // ──────────────────────────────
  // 3) AI에게 장소·행동 아이디어 요청 (/api/storyIdeas)
  // ──────────────────────────────
  const handleAskIdeas = async () => {
    setIdeasError("");
    setPlaceIdeas([]);
    setActionIdeas([]);

    const wordsForStory = selectedWords.map((w) => w.word);
    if (wordsForStory.length < 2) {
      setIdeasError(t.needWordsForIdeas);
      return;
    }

    setIsIdeasLoading(true);
    try {
      const res = await fetch("/api/storyIdeas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: wordsForStory }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to call /api/storyIdeas");
      }

      const data = await res.json();
      setPlaceIdeas(Array.isArray(data.places) ? data.places : []);
      setActionIdeas(Array.isArray(data.actions) ? data.actions : []);
      // 첫 번째 제안을 자동으로 채워 줄 수도 있음
      if (data.places?.[0]) setPlace(data.places[0]);
      if (data.actions?.[0]) setAction(data.actions[0]);
    } catch (err) {
      console.error("Error getting story ideas", err);
      setIdeasError(
        err.message || "장소·행동 아이디어를 가져오는 중 오류가 발생했습니다."
      );
    } finally {
      setIsIdeasLoading(false);
    }
  };

  // ──────────────────────────────
  // 4) 동화 생성 요청 (/api/storybook)
  // ──────────────────────────────
  const handleRequestStory = async () => {
    setStory("");
    setStoryError("");

    const wordsForStory = selectedWords.map((w) => w.word);
    if (wordsForStory.length < 2) {
      setStoryError(t.needWordsForStory);
      return;
    }

    setIsStoryLoading(true);
    try {
      const res = await fetch("/api/storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: wordsForStory,
          mustIncludeWords: selectedWords
            .filter((w) => w.mustInclude)
            .map((w) => w.word),
          childName,
          childAge,
          perspective, // "firstPerson" | "thirdPerson"
          place,
          action,
          ending,
          language,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to call /api/storybook");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setStory(data.story || "");
    } catch (err) {
      console.error("Error generating story", err);
      setStoryError(
        err.message || "스토리를 생성하는 중 오류가 발생했습니다."
      );
    } finally {
      setIsStoryLoading(false);
    }
  };

  // ──────────────────────────────
  // 스타일
  // ──────────────────────────────
  const styles = useMemo(
    () => ({
      page: {
        minHeight: "100vh",
        background: "#FFF6EC",
        padding: "24px 12px 48px",
        display: "flex",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, system-ui, "Noto Sans KR", sans-serif',
        color: "#4a2f1a",
      },
      container: {
        maxWidth: "1120px",
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
        marginBottom: "16px",
        gap: "8px",
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
      appSubtitle: {
        fontSize: 13,
        marginBottom: 18,
        lineHeight: 1.4,
      },
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
      alphabetRowsWrapper: {
        marginBottom: "10px",
      },
      alphabetRow: {
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "8px",
      },
      alphabetButton: (active) => ({
        width: "40px",
        height: "40px",
        borderRadius: "999px",
        border: "0",
        background: active ? "#FF8C41" : "#FFF8F0",
        color: active ? "#fff" : "#7a4c25",
        boxShadow: active ? "0 0 0 2px rgba(0,0,0,0.08)" : "none",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 16,
      }),
      cardSectionTitle: {
        fontSize: 14,
        fontWeight: 600,
        margin: "12px 0 8px",
      },
      cardsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
        gap: "16px",
        marginBottom: "12px",
      },
      cardButton: {
        border: "none",
        padding: 0,
        background: "transparent",
        cursor: "pointer",
      },
      card: (isSelected) => ({
        background: "#FFFDF8",
        borderRadius: "24px",
        padding: "10px",
        boxShadow: isSelected
          ? "0 0 0 2px #FF8C41, 0 12px 26px rgba(0,0,0,0.10)"
          : "0 12px 26px rgba(0,0,0,0.08)",
        minHeight: "220px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }),
      cardImageWrapper: {
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        overflow: "hidden",
        background: "#FFF4E6",
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
        marginBottom: "8px",
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
      smallCaption: {
        marginTop: "4px",
        fontSize: "12px",
        opacity: 0.8,
      },
      sectionLabel: {
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 6,
      },
      childInfoBox: {
        background: "#F3F5FF",
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
      },
      childInfoRow: {
        display: "grid",
        gridTemplateColumns: "minmax(0, 2.5fr) minmax(0, 1fr)",
        gap: 12,
        marginTop: 10,
      },
      textInput: {
        width: "100%",
        borderRadius: 999,
        border: "1px solid rgba(0,0,0,0.12)",
        padding: "8px 12px",
        fontSize: 13,
        background: "#FFFDF8",
        boxSizing: "border-box",
      },
      perspectiveRow: {
        display: "flex",
        gap: 8,
        marginTop: 8,
        flexWrap: "wrap",
      },
      perspectiveButton: (active) => ({
        flex: "0 0 auto",
        padding: "6px 10px",
        borderRadius: 999,
        border: active ? "0" : "1px solid rgba(0,0,0,0.12)",
        background: active ? "#FF8C41" : "#FFFDF8",
        color: active ? "#fff" : "#7a4c25",
        fontSize: 12,
        cursor: "pointer",
        fontWeight: 600,
        boxShadow: active ? "0 8px 18px rgba(0,0,0,0.16)" : "none",
      }),
      ideasHeaderRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 4,
        marginBottom: 6,
      },
      ideasButton: {
        padding: "7px 12px",
        borderRadius: 999,
        border: "0",
        background: "#FFB061",
        color: "#fff",
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
      },
      suggestionsRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        margin: "6px 0 10px",
      },
      suggestionChip: {
        padding: "5px 10px",
        borderRadius: "999px",
        border: "0",
        background: "#FFF9F3",
        fontSize: "12px",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
      },
      primaryButton: {
        marginTop: "12px",
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
      errorText: {
        color: "#D23B3B",
        fontSize: "13px",
        marginTop: "6px",
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
    }),
    [language]
  );

  // ──────────────────────────────
  // 렌더링
  // ──────────────────────────────
  return (
    <div style={styles.page}>
      <main style={styles.container}>
        {/* 헤더 + 언어 토글 */}
        <div style={styles.headerRow}>
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                margin: 0,
                marginBottom: 4,
              }}
            >
              {t.appTitle}
            </h1>
            <div style={styles.appSubtitle}>{t.appSubtitle}</div>
          </div>
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

          {/* 알파벳 버튼 13/13 두 줄 */}
          <div style={styles.alphabetRowsWrapper}>
            {LETTER_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} style={styles.alphabetRow}>
                {row.map((letter) => (
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
            ))}
          </div>

          {/* 단어 카드 그리드 */}
          <div style={styles.cardSectionTitle}>{t.cardTitle(selectedLetter)}</div>

          {isLoadingCards ? (
            <div style={{ fontSize: 13, margin: "8px 0 12px" }}>
              카드 이미지를 불러오는 중입니다…
            </div>
          ) : cardsError ? (
            <div style={styles.errorText}>{cardsError}</div>
          ) : cards.length === 0 ? (
            <div style={{ fontSize: 13, margin: "8px 0 12px" }}>
              {t.noCards}
            </div>
          ) : (
            <div style={styles.cardsGrid}>
              {cards.map((card) => {
                const isSelected = selectedWords.some(
                  (w) =>
                    w.word.toLowerCase() === card.word.toLowerCase()
                );
                return (
                  <button
                    type="button"
                    key={card.id}
                    style={styles.cardButton}
                    onClick={() => handleCardClick(card.word)}
                  >
                    <div style={styles.card(isSelected)}>
                      <div style={styles.cardImageWrapper}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={card.imageUrl}
                          alt={card.word}
                          style={styles.cardImage}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 오늘 배운 단어 입력 */}
          <div
            style={{
              marginTop: 10,
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

          {/* 아이 정보 박스 */}
          <div style={styles.childInfoBox}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {t.childInfoTitle}
            </div>
            <div style={styles.childInfoRow}>
              <div>
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  {t.childNameLabel}
                </div>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  style={styles.textInput}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  {t.childAgeLabel}
                </div>
                <input
                  type="number"
                  min="0"
                  max="18"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  style={styles.textInput}
                />
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, fontWeight: 600 }}>
              {t.perspectiveLabel}
            </div>
            <div style={styles.perspectiveRow}>
              <button
                type="button"
                style={styles.perspectiveButton(
                  perspective === "firstPerson"
                )}
                onClick={() => setPerspective("firstPerson")}
              >
                {t.perspectiveFirstPerson}
              </button>
              <button
                type="button"
                style={styles.perspectiveButton(
                  perspective === "thirdPerson"
                )}
                onClick={() => setPerspective("thirdPerson")}
              >
                {t.perspectiveThirdPerson}
              </button>
            </div>
          </div>

          {/* 아이디어 요청 영역 */}
          <div style={styles.ideasHeaderRow}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {t.ideasTitle}
            </div>
            <button
              type="button"
              style={styles.ideasButton}
              onClick={handleAskIdeas}
              disabled={isIdeasLoading}
            >
              {isIdeasLoading ? t.loadingIdeas : t.askIdeasButton}
            </button>
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
            {t.ideasHelper}
          </div>
          {ideasError && (
            <div style={styles.errorText}>
              {t.ideasErrorPrefix}
              {ideasError}
            </div>
          )}

          {/* 장소 / 행동 / 엔딩 입력 + 추천 칩 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              marginTop: 10,
            }}
          >
            {/* 장소 */}
            <div>
              <div style={styles.sectionLabel}>{t.placeLabel}</div>
              <input
                type="text"
                style={{
                  ...styles.textInput,
                  borderRadius: 999,
                }}
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
              {placeIdeas.length > 0 && (
                <div style={styles.suggestionsRow}>
                  {placeIdeas.map((p) => (
                    <button
                      key={p}
                      type="button"
                      style={styles.suggestionChip}
                      onClick={() => setPlace(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 행동 */}
            <div>
              <div style={styles.sectionLabel}>{t.actionLabel}</div>
              <input
                type="text"
                style={{
                  ...styles.textInput,
                  borderRadius: 999,
                }}
                value={action}
                onChange={(e) => setAction(e.target.value)}
              />
              {actionIdeas.length > 0 && (
                <div style={styles.suggestionsRow}>
                  {actionIdeas.map((a) => (
                    <button
                      key={a}
                      type="button"
                      style={styles.suggestionChip}
                      onClick={() => setAction(a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 엔딩 */}
            <div>
              <div style={styles.sectionLabel}>{t.endingLabel}</div>
              <input
                type="text"
                style={{
                  ...styles.textInput,
                  borderRadius: 999,
                }}
                value={ending}
                onChange={(e) => setEnding(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.smallCaption}>{t.suggestionsCaption}</div>

          {/* 스토리 생성 버튼 */}
          <button
            type="button"
            style={styles.primaryButton}
            onClick={handleRequestStory}
            disabled={isStoryLoading}
          >
            {isStoryLoading ? t.loadingStory : t.askStoryButton}
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
                {t.storyResultTitle}
              </div>
              {story}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
