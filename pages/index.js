// pages/index.js

import { useState, useMemo } from "react";
import Head from "next/head";
import AlphabetPicker from "../components/storybook/AlphabetPicker";
import { useWordCards } from "../hooks/useWordCards";

// 테마 정의 (키는 API와 맞춰 주세요)
const THEMES = [
  {
    key: "everyday",
    emoji: "🏡",
    label: {
      ko: "일상 모험",
      en: "Everyday Adventure",
      zh: "日常冒险",
    },
  },
  {
    key: "school",
    emoji: "🏫",
    label: {
      ko: "학교 이야기",
      en: "School Story",
      zh: "校园故事",
    },
  },
  {
    key: "family",
    emoji: "👨‍👩‍👧‍👧",
    label: {
      ko: "가족",
      en: "Family",
      zh: "家庭",
    },
  },
  {
    key: "friends",
    emoji: "👫",
    label: {
      ko: "친구",
      en: "Friends",
      zh: "朋友",
    },
  },
  {
    key: "animals",
    emoji: "🐶",
    label: {
      ko: "동물",
      en: "Animals",
      zh: "动物",
    },
  },
  {
    key: "princess",
    emoji: "👑",
    label: {
      ko: "공주",
      en: "Princess",
      zh: "公主",
    },
  },
  {
    key: "hero",
    emoji: "🦸‍♀️",
    label: {
      ko: "영웅",
      en: "Hero",
      zh: "英雄",
    },
  },
  {
    key: "classic",
    emoji: "📜",
    label: {
      ko: "전래동화",
      en: "Classic Tale",
      zh: "经典童话",
    },
  },
  {
    key: "animation",
    emoji: "🎬",
    label: {
      ko: "애니메이션 느낌",
      en: "Animation Style",
      zh: "动画风格",
    },
  },
  {
    key: "sf",
    emoji: "🚀",
    label: {
      ko: "우주 / SF",
      en: "Space / Sci-Fi",
      zh: "宇宙 / 科幻",
    },
  },
];

// 다국어 텍스트
const I18N = {
  ko: {
    title: "AI Storybook – 오늘 배운 단어로 영어 동화 만들기",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "오늘 수업·숙제·책에서 등장한 영어 단어를 적거나, 아래 카드에서 골라 보세요.",
    noCardsForLetter: (letter) => `아직 이 알파벳에는 카드가 없습니다.`,
    writeWordsLabel: "오늘 배운 영어 단어 적기",
    writeWordsPlaceholder:
      "apple, banana, mom 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요.",
    chipsLabel:
      "Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는 단어로 표시됩니다. X로 삭제할 수 있습니다. ",
    step2Title: "STEP 2 · 동화 옵션 정하기",
    lengthLabel: "동화 길이",
    lengthShort: "짧게",
    lengthMedium: "보통",
    lengthLong: "길게",
    childNameLabel: "아이 이름 (이야기 주인공)",
    childNamePlaceholder: "아이 이름을 적어 주세요.",
    themeTitle: "이야기 테마 고르기",
    requestButton: "AI에게 영어 동화 만들기 요청하기",
    storyTitle: "AI가 만든 오늘의 영어 동화",
    storyLoading: "AI가 동화를 만드는 중입니다…",
    storyEmpty: "단어와 옵션을 선택한 뒤, AI에게 동화를 요청해 보세요.",
    storyErrorPrefix: "동화를 만드는 중 오류가 발생했습니다: ",
    chipsCountSuffix: (count, max) => ` /${max} 선택됨`,
  },
  en: {
    title: "AI Storybook – Make an English story with today’s words",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "Type the English words from today’s class/homework/books, or pick from the cards below.",
    noCardsForLetter: (letter) =>
      `There are no cards for the letter ${letter} yet.`,
    writeWordsLabel: "Write today’s English words",
    writeWordsPlaceholder:
      "Type words like apple, banana, mom separated by commas or line breaks.",
    chipsLabel:
      "Word chips · Click a chip to toggle ★ (must-include in the story). Click X to remove.",
    step2Title: "STEP 2 · Choose story options",
    lengthLabel: "Story length",
    lengthShort: "Short",
    lengthMedium: "Medium",
    lengthLong: "Long",
    childNameLabel: "Child's name (main character)",
    childNamePlaceholder: "Please enter the child's name.",
    themeTitle: "Choose a story theme",
    requestButton: "Ask AI to create an English story",
    storyTitle: "AI-generated story for today",
    storyLoading: "AI is writing a story…",
    storyEmpty: "Pick some words and options, then ask AI to create a story.",
    storyErrorPrefix: "Error while generating story: ",
    chipsCountSuffix: (count, max) => ` /${max} selected`,
  },
  zh: {
    title: "AI 故事书 – 用今天学的单词写英文故事",
    step1Title: "STEP 1 · 今天的单词",
    step1Subtitle: "输入今天在课堂·作业·书里出现的英文单词，或从下面的卡片中选择。",
    noCardsForLetter: () => "这个字母目前还没有卡片。",
    writeWordsLabel: "写下今天学到的英文单词",
    writeWordsPlaceholder:
      "像 apple, banana, mom 一样，用逗号或换行分隔输入单词。",
    chipsLabel:
      "单词筹码 · 点击筹码可切换 ★（一定要出现在故事里），点击 X 可以删除。",
    step2Title: "STEP 2 · 选择故事选项",
    lengthLabel: "故事长度",
    lengthShort: "短",
    lengthMedium: "普通",
    lengthLong: "长",
    childNameLabel: "孩子的名字（主角）",
    childNamePlaceholder: "请输入孩子的名字。",
    themeTitle: "选择故事主题",
    requestButton: "请 AI 写一个英文故事",
    storyTitle: "AI 写出的今天的英文故事",
    storyLoading: "AI 正在写故事…",
    storyEmpty: "先选择一些单词和选项，然后请 AI 写故事吧。",
    storyErrorPrefix: "生成故事时出错：",
    chipsCountSuffix: (count, max) => ` /${max} 个已选`,
  },
};

const MAX_WORDS = 8;

export default function HomePage() {
  // 언어 스위치
  const [locale, setLocale] = useState("ko");
  const t = useMemo(() => I18N[locale], [locale]);

  // STEP1 상태
  const [selectedLetter, setSelectedLetter] = useState("A");
  const { cards, isLoading: cardsLoading, error: cardsError } =
    useWordCards(selectedLetter);
  const [selectedWords, setSelectedWords] = useState([]); // { word, mustInclude }
  const [wordInput, setWordInput] = useState("");

  // STEP2 상태
  const [length, setLength] = useState("medium"); // short | medium | long
  const [childName, setChildName] = useState("");
  const [themeKey, setThemeKey] = useState("everyday");

  // 스토리 상태
  const [story, setStory] = useState("");
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyError, setStoryError] = useState("");

  // ===== Step1: Word chips helpers =====
  const addWordToChips = (raw) => {
    const word = (raw || "").trim();
    if (!word) return;

    setSelectedWords((prev) => {
      if (prev.some((w) => w.word.toLowerCase() === word.toLowerCase())) {
        return prev;
      }
      if (prev.length >= MAX_WORDS) return prev;
      return [...prev, { word, mustInclude: false }];
    });
  };

  const processWordInput = () => {
    const tokens = wordInput
      .split(/[,;\n]/)
      .map((w) => w.trim())
      .filter(Boolean);
    tokens.forEach(addWordToChips);
    setWordInput("");
  };

  const handleWordInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      processWordInput();
    }
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

  const removeWordFromChips = (wordToRemove) => {
    setSelectedWords((prev) =>
      prev.filter(
        (w) => w.word.toLowerCase() !== wordToRemove.toLowerCase()
      )
    );
  };

  const handleCardClick = (card) => {
    // 카드 안에 word가 이미 정제되어 있다고 가정
    if (card && card.word) {
      addWordToChips(card.word);
    }
  };

  // ===== Step2: Call API =====
  const handleRequestStory = async () => {
    setStoryError("");
    setStory("");
    setStoryLoading(true);

    try {
      const mustInclude = selectedWords
        .filter((w) => w.mustInclude)
        .map((w) => w.word);
      const optional = selectedWords
        .filter((w) => !w.mustInclude)
        .map((w) => w.word);

      const res = await fetch("/api/generateStory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale,
          length,
          childName: childName.trim(),
          themeKey,
          words: {
            mustInclude,
            optional,
          },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setStory(data.story || "");
    } catch (err) {
      setStoryError(
        t.storyErrorPrefix +
          (err && err.message ? err.message : "Unknown error")
      );
    } finally {
      setStoryLoading(false);
    }
  };

  // ===== 렌더링 =====
  return (
    <>
      <Head>
        <title>{t.title}</title>
      </Head>
      <div className="page-root">
        {/* 상단 헤더 */}
        <header className="page-header">
          <h1>{t.title}</h1>
          <div className="lang-switch">
            <button
              type="button"
              className={locale === "en" ? "active" : ""}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={locale === "ko" ? "active" : ""}
              onClick={() => setLocale("ko")}
            >
              KO
            </button>
            <button
              type="button"
              className={locale === "zh" ? "active" : ""}
              onClick={() => setLocale("zh")}
            >
              中文
            </button>
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

          {/* 카드 그리드: 6개씩 한 줄, 카드 줄이기 */}
          {cardsLoading ? (
            <div className="word-grid-empty">{t.storyLoading}</div>
          ) : cardsError ? (
            <div className="word-grid-empty">
              {t.storyErrorPrefix}
              {cardsError}
            </div>
          ) : !cards || cards.length === 0 ? (
            <div className="word-grid-empty">
              {t.noCardsForLetter(selectedLetter)}
            </div>
          ) : (
            <div
              className="word-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                gap: 18,
                marginTop: 26,
              }}
            >
              {cards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className="word-card"
                  onClick={() => handleCardClick(card)}
                >
                  <div
                    className="word-card-inner"
                    style={{
                      transform: "scale(0.78)",
                      transformOrigin: "center top",
                    }}
                  >
                    <div className="word-card-image-wrapper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="word-card-image"
                        src={card.imageUrl}
                        alt={card.word}
                      />
                    </div>
                    {/* 이미 카드 안에 스펠링이 그려져 있지만,
                        접근성을 위해 단어를 텍스트로도 남겨 둡니다. */}
                    <div className="word-card-label">{card.word}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 오늘 배운 단어 입력 + 칩 */}
          <div className="word-input-block">
            <label htmlFor="word-input">{t.writeWordsLabel}</label>
            <div className="word-input-row">
              <input
                id="word-input"
                type="text"
                value={wordInput}
                placeholder={t.writeWordsPlaceholder}
                onChange={(e) => setWordInput(e.target.value)}
                onKeyDown={handleWordInputKeyDown}
                onBlur={processWordInput}
              />
            </div>
            <div className="chips-hint">
              {t.chipsLabel}
              {selectedWords.length}
              {t.chipsCountSuffix(selectedWords.length, MAX_WORDS)}
            </div>

            {selectedWords.length > 0 && (
              <div className="chips-row">
                {selectedWords.map((item) => (
                  <button
                    key={item.word}
                    type="button"
                    className={`chip ${item.mustInclude ? "must" : ""}`}
                    onClick={() => toggleMustInclude(item.word)}
                  >
                    <span className="chip-star">
                      {item.mustInclude ? "★" : "☆"}
                    </span>
                    <span>{item.word}</span>
                    <span
                      className="chip-close"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWordFromChips(item.word);
                      }}
                    >
                      ✕
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* STEP 2 */}
        <section className="step-section">
          <h2>{t.step2Title}</h2>

          {/* 길이 선택 */}
          <div className="step2-story">
            <div className="step2-row">
              <div className="input-label">{t.lengthLabel}</div>
              <div className="button-group">
                <button
                  type="button"
                  className={`pill-button ${
                    length === "short" ? "active" : ""
                  }`}
                  onClick={() => setLength("short")}
                >
                  {t.lengthShort}
                </button>
                <button
                  type="button"
                  className={`pill-button ${
                    length === "medium" ? "active" : ""
                  }`}
                  onClick={() => setLength("medium")}
                >
                  {t.lengthMedium}
                </button>
                <button
                  type="button"
                  className={`pill-button ${
                    length === "long" ? "active" : ""
                  }`}
                  onClick={() => setLength("long")}
                >
                  {t.lengthLong}
                </button>
              </div>
            </div>

            {/* 아이 이름 */}
            <div className="step2-row">
              <label className="input-label" htmlFor="child-name">
                {t.childNameLabel}
              </label>
              <input
                id="child-name"
                type="text"
                className="text-input"
                value={childName}
                placeholder={t.childNamePlaceholder}
                onChange={(e) => setChildName(e.target.value)}
              />
            </div>

            {/* 테마 선택 */}
            <div className="step2-row">
              <div className="input-label">{t.themeTitle}</div>
              <div className="button-group theme-group">
                {THEMES.map((theme) => (
                  <button
                    key={theme.key}
                    type="button"
                    className={`pill-button ${
                      themeKey === theme.key ? "active" : ""
                    }`}
                    onClick={() => setThemeKey(theme.key)}
                  >
                    <span>{theme.emoji}</span>
                    <span>
                      {theme.label[locale] || theme.label["en"] || ""}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 요청 버튼 */}
            <div className="request-row">
              <button type="button" onClick={handleRequestStory}>
                {t.requestButton}
              </button>
            </div>

            {/* 결과 영역 */}
            <div className="story-result">
              <div className="section-title">{t.storyTitle}</div>
              <div className="story-box">
                {storyLoading ? (
                  <p className="story-placeholder">{t.storyLoading}</p>
                ) : storyError ? (
                  <p className="story-text">{storyError}</p>
                ) : story ? (
                  <p className="story-text">{story}</p>
                ) : (
                  <p className="story-placeholder">{t.storyEmpty}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
