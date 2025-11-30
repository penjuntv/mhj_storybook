// pages/index.js
import { useState, useMemo } from "react";
import AlphabetPicker from "../components/storybook/AlphabetPicker";
import { WORD_CARDS } from "../data/wordCards";

// 언어 옵션
const LANGUAGE_OPTIONS = [
  { id: "en", label: "EN" },
  { id: "ko", label: "KO" },
  { id: "zh", label: "中文" },
];

// 텍스트 리소스
const LOCALES = {
  ko: {
    title: "AI Storybook – 오늘 배운 단어로 영어 동화 만들기",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "오늘 수업·숙제·책에서 등장한 영어 단어를 적거나, 아래 카드에서 골라 보세요.",
    noCardsForLetter: "아직 이 알파벳에는 카드가 없습니다.",
    writeWordsLabel: "오늘 배운 영어 단어 적기",
    writeWordsPlaceholder:
      "apple, banana, mom 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요.",
    chipsLabel:
      "Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는 단어로 표시됩니다. ✕로 삭제할 수 있습니다.",
    storyOptionsTitle: "STEP 2 · 동화 옵션 정하기",
    storyOptionsSubtitle: "동화 길이와 아이 이름을 선택해 주세요.",
    storyLengthLabel: "동화 길이",
    lengthShort: "짧게",
    lengthMedium: "보통",
    lengthLong: "길게",
    childNameLabel: "아이 이름 (이야기 주인공)",
    generateButton: "AI에게 영어 동화 만들기 요청하기",
    storyTitle: "AI가 만든 오늘의 영어 동화",
    storyPlaceholder: "단어와 옵션을 선택한 뒤 버튼을 눌러 동화를 만들어 보세요.",
    selectedWordsInfoPrefix: "선택한 단어",
    selectedWordsInfoSuffix: "개 / 최대 8개",
    themeTitle: "이야기 테마 고르기",
  },
  en: {
    title: "AI Storybook – Make an English story with today's words",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "Type the English words from today's class / homework / book, or pick from the cards below.",
    noCardsForLetter: "No cards for this alphabet yet.",
    writeWordsLabel: "Write today's English words",
    writeWordsPlaceholder:
      "apple, banana, mom ... type words separated by commas or line breaks.",
    chipsLabel:
      "Word chips · Click a chip to toggle ★ (must appear in the story). Click ✕ to remove.",
    storyOptionsTitle: "STEP 2 · Story options",
    storyOptionsSubtitle: "Choose the story length and your child's name.",
    storyLengthLabel: "Story length",
    lengthShort: "Short",
    lengthMedium: "Normal",
    lengthLong: "Long",
    childNameLabel: "Child's name (main character)",
    generateButton: "Ask AI to make an English story",
    storyTitle: "Today's English story made by AI",
    storyPlaceholder:
      "Pick some words and options, then press the button to create a story.",
    selectedWordsInfoPrefix: "Selected words",
    selectedWordsInfoSuffix: "/ max 8",
    themeTitle: "Choose a story theme",
  },
  zh: {
    title: "AI 故事书 – 用今天学的单词编英文故事",
    step1Title: "STEP 1 · 今天的单词",
    step1Subtitle:
      "输入今天上课·作业·书里出现的英文单词，或者从下面的卡片中选择。",
    noCardsForLetter: "这个字母暂时没有卡片。",
    writeWordsLabel: "写下今天学到的英文单词",
    writeWordsPlaceholder: "apple, banana, mom … 用逗号或换行分开。",
    chipsLabel:
      "单词筹码 · 点击筹码会出现 ★，表示一定要出现在故事里。点击 ✕ 删除。",
    storyOptionsTitle: "STEP 2 · 故事选项",
    storyOptionsSubtitle: "选择故事长度和孩子的名字。",
    storyLengthLabel: "故事长度",
    lengthShort: "短",
    lengthMedium: "一般",
    lengthLong: "长",
    childNameLabel: "孩子的名字（主角）",
    generateButton: "让 AI 编一个英文故事",
    storyTitle: "AI 写的今天的英文故事",
    storyPlaceholder: "先选择单词和选项，然后点击按钮生成故事。",
    selectedWordsInfoPrefix: "已选单词",
    selectedWordsInfoSuffix: "/ 最多 8 个",
    themeTitle: "选择故事主题",
  },
};

// 테마 정의 (옵션 B, 강도 7/10 정도로 프롬프트에 녹여 둠)
const THEMES = [
  {
    id: "everyday",
    emoji: "🏠",
    label: "일상 모험",
    prompt:
      "따뜻한 일상 속에서 작은 사건이 크게 느껴지는 모험 이야기입니다. 집과 동네, 익숙한 장소들을 배경으로 아이가 새로운 발견을 하는 느낌을 살려 주세요. 테마의 느낌은 분명히 존재하지만, 단어들 자체도 충분히 돋보여야 합니다.",
  },
  {
    id: "school",
    emoji: "🏫",
    label: "학교 이야기",
    prompt:
      "학교를 배경으로 한 이야기입니다. 교실, 급식실, 운동장, 친구들과 선생님이 자연스럽게 등장하고, 유머와 작은 감동이 섞인 동화처럼 써 주세요.",
  },
  {
    id: "family",
    emoji: "👨‍👩‍👧",
    label: "가족",
    prompt:
      "가족과 함께 보내는 따뜻한 하루를 그리는 이야기입니다. 부모, 형제자매와의 대화와 감정 표현이 충분히 드러나도록 써 주세요.",
  },
  {
    id: "friends",
    emoji: "🧑‍🤝‍🧑",
    label: "친구",
    prompt:
      "친구와의 우정과 작은 갈등, 그리고 화해가 담긴 이야기입니다. 말다툼이 있더라도 결국 서로를 이해하게 되는 흐름을 넣어 주세요.",
  },
  {
    id: "animals",
    emoji: "🐶",
    label: "동물",
    prompt:
      "동물 친구들이 등장하는 이야기입니다. 동물들의 개성이 살아 있고, 아이와 동물이 함께 모험하거나 서로를 도와주는 장면을 넣어 주세요.",
  },
  {
    id: "princess",
    emoji: "👑",
    label: "공주",
    prompt:
      "공주와 왕국, 성, 마법 요소가 살짝 들어간 이야기입니다. 전형적인 동화 느낌을 내되, 너무 과장되기보다는 아이가 공감할 수 있는 감정을 중심에 두어 주세요.",
  },
  {
    id: "hero",
    emoji: "🦸‍♀️",
    label: "영웅",
    prompt:
      "아이 또는 아이의 친구가 작은 영웅이 되는 이야기입니다. 세상을 구하는 거대한 영웅담보다는, 주변 사람을 도와주는 용기 있는 행동이 강조되면 좋습니다.",
  },
  {
    id: "classic",
    emoji: "📜",
    label: "전래동화",
    prompt:
      "옛날 옛적에… 로 시작해도 어색하지 않은 전래동화 스타일입니다. 간단한 교훈이 담기되, 너무 무겁지 않게 따뜻한 결말로 마무리해 주세요.",
  },
  {
    id: "sf",
    emoji: "🚀",
    label: "우주 / SF",
    prompt:
      "우주, 미래 도시, 로봇, UFO 같은 요소가 자연스럽게 들어가는 SF 스타일입니다. 하지만 공포스럽지 않고, 아이의 호기심과 상상력을 자극하는 방향으로 써 주세요.",
  },
];

const MAX_WORDS = 8;

export default function HomePage() {
  const [lang, setLang] = useState("ko");
  const t = LOCALES[lang] || LOCALES.ko;

  // STEP 1 상태
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [wordInput, setWordInput] = useState("");
  const [selectedWords, setSelectedWords] = useState([]); // { word, mustInclude }

  // STEP 2 상태
  const [storyLength, setStoryLength] = useState("medium"); // short / medium / long
  const [childName, setChildName] = useState("yujin");
  const [selectedThemeId, setSelectedThemeId] = useState("everyday");

  // 스토리 결과
  const [storyText, setStoryText] = useState("");
  const [storyError, setStoryError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 현재 선택된 알파벳 카드 목록 (data/wordCards 기반)
  const currentCards = useMemo(() => {
    const list = WORD_CARDS[selectedLetter] || [];
    // WORD_CARDS 구조가 { id, word, imageUrl } 형태라고 가정
    return list;
  }, [selectedLetter]);

  // 단어 칩 추가
  const addWordChip = (rawWord) => {
    const word = (rawWord || "").trim();
    if (!word) return;

    setSelectedWords((prev) => {
      if (
        prev.some(
          (w) => w.word.toLowerCase() === word.toLowerCase()
        )
      ) {
        return prev;
      }
      if (prev.length >= MAX_WORDS) return prev;

      return [...prev, { word, mustInclude: false }];
    });
  };

  // 카드 클릭 시 단어 추가
  const handleCardClick = (card) => {
    if (!card || !card.word) return;
    addWordChip(card.word);
  };

  // 수동 입력 처리
  const processWordInput = () => {
    const tokens = wordInput
      .split(/[,;\n]/)
      .map((w) => w.trim())
      .filter(Boolean);

    tokens.forEach(addWordChip);
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

  const removeWordChip = (wordToRemove) => {
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

  // 스토리 생성 요청
  const handleGenerateStory = async () => {
    if (!childName.trim()) {
      alert("아이 이름을 입력해 주세요.");
      return;
    }

    const theme = THEMES.find((t) => t.id === selectedThemeId);

    setIsGenerating(true);
    setStoryError("");

    try {
      const res = await fetch("/api/generateStory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang,
          length: storyLength, // "short" | "medium" | "long"
          childName: childName.trim(),
          themeId: theme?.id,
          themePrompt: theme?.prompt,
          words: selectedWords.map((w) => w.word),
          mustIncludeWords: selectedWords
            .filter((w) => w.mustInclude)
            .map((w) => w.word),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate story.");
      }

      // API가 { story } 형태로 응답한다고 가정
      setStoryText(data.story || "");
    } catch (err) {
      console.error(err);
      setStoryError(
        err.message ||
          "스토리를 생성하는 중 오류가 발생했습니다."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedWordsInfo = `${t.selectedWordsInfoPrefix} ${selectedWords.length}${t.selectedWordsInfoSuffix}`;

  const currentTheme = THEMES.find((th) => th.id === selectedThemeId);

  return (
    <div className="page-root">
      {/* 헤더 */}
      <header className="page-header">
        <h1>{t.title}</h1>
        <div className="lang-switch">
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={
                lang === opt.id ? "active" : undefined
              }
              onClick={() => setLang(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      {/* STEP 1 */}
      <section className="step-section">
        <h2>{t.step1Title}</h2>
        <p>{t.step1Subtitle}</p>

        {/* 알파벳 선택 */}
        <AlphabetPicker
          selectedLetter={selectedLetter}
          onSelectLetter={setSelectedLetter}
        />

        {/* 카드 그리드 */}
        {currentCards.length === 0 ? (
          <div className="word-grid-empty">
            {t.noCardsForLetter}
          </div>
        ) : (
          <div className="word-grid">
            {currentCards.map((card) => (
              <button
                key={card.id}
                type="button"
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
                  {/* 접근성용 텍스트 레이블 (이미지에 글자가 있지만 스크린리더를 위해 유지) */}
                  <div className="word-card-label">
                    {card.word}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 단어 입력 & 칩 */}
        <div className="word-input-block">
          <label htmlFor="word-input">
            {t.writeWordsLabel}
          </label>
          <div className="word-input-row">
            <input
              id="word-input"
              type="text"
              placeholder={t.writeWordsPlaceholder}
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              onKeyDown={handleWordInputKeyDown}
              onBlur={handleWordInputBlur}
            />
          </div>
          <div className="chips-hint">{t.chipsLabel}</div>
          <div className="chips-hint">{selectedWordsInfo}</div>
          <div className="chips-row">
            {selectedWords.map((item) => (
              <button
                key={item.word}
                type="button"
                className={
                  "chip" + (item.mustInclude ? " must" : "")
                }
                onClick={() => toggleMustInclude(item.word)}
              >
                <span>
                  {item.mustInclude ? "★ " : "☆ "}
                  {item.word}
                </span>
                <span
                  className="chip-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWordChip(item.word);
                  }}
                >
                  ✕
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STEP 2 */}
      <section className="step-section">
        <h2>{t.storyOptionsTitle}</h2>
        <p>{t.storyOptionsSubtitle}</p>

        {/* 길이 선택 */}
        <div className="step2-row">
          <label className="input-label">
            {t.storyLengthLabel}
          </label>
          <div className="button-group">
            <button
              type="button"
              className={
                "pill-button" +
                (storyLength === "short" ? " active" : "")
              }
              onClick={() => setStoryLength("short")}
            >
              {t.lengthShort}
            </button>
            <button
              type="button"
              className={
                "pill-button" +
                (storyLength === "medium" ? " active" : "")
              }
              onClick={() => setStoryLength("medium")}
            >
              {t.lengthMedium}
            </button>
            <button
              type="button"
              className={
                "pill-button" +
                (storyLength === "long" ? " active" : "")
              }
              onClick={() => setStoryLength("long")}
            >
              {t.lengthLong}
            </button>
          </div>
        </div>

        {/* 테마 선택 */}
        <div className="step2-row">
          <label className="input-label">
            {t.themeTitle}
          </label>
          <div className="button-group theme-group">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={
                  "pill-button" +
                  (theme.id === selectedThemeId
                    ? " active"
                    : "")
                }
                onClick={() => setSelectedThemeId(theme.id)}
              >
                <span aria-hidden="true">
                  {theme.emoji}&nbsp;
                </span>
                <span>{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 아이 이름 */}
        <div className="step2-row">
          <label
            htmlFor="child-name"
            className="input-label"
          >
            {t.childNameLabel}
          </label>
          <input
            id="child-name"
            type="text"
            className="text-input"
            value={childName}
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
            {isGenerating
              ? "AI가 동화를 만드는 중..."
              : t.generateButton}
          </button>
        </div>

        {/* 테마 설명을 살짝 보여 줄 수도 있음 (선택 사항) */}
        {currentTheme && (
          <p
            style={{
              marginTop: 12,
              fontSize: "0.85rem",
              color: "#8a6a4a",
              maxWidth: 720,
            }}
          >
            선택한 테마: {currentTheme.emoji} {currentTheme.label}
          </p>
        )}

        {/* 스토리 결과 */}
        <div className="story-result">
          <h3 className="section-title">
            {t.storyTitle}
          </h3>
          <div className="story-box">
            {storyError ? (
              <p className="error-text">{storyError}</p>
            ) : storyText ? (
              <p className="story-text">{storyText}</p>
            ) : (
              <p className="story-placeholder">
                {t.storyPlaceholder}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
