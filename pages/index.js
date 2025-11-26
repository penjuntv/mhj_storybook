// pages/index.js
import { useState } from "react";
import { LETTER_IMAGES, WORD_CARDS } from "../data/wordCards";

// 언어별 텍스트
const TEXTS = {
  en: {
    langLabel: "EN",
    appTitle: "AI Storybook – Create an English story with today's words",
    appSubtitle:
      "Type the English words your child learned today and build a fun, very simple story for ages 3–7.",
    step1Tag: "STEP 1 · Today’s words",
    step1Title: "Write today’s English words",
    step1Intro:
      "Choose words from the alphabet cards below, or type English words from today’s class / homework / book.",
    step1FromCardsLabel: "Pick words from alphabet cards:",
    step1LetterHelp: "Tap a letter to see word cards that start with that letter.",
    step1LetterWordsPrefix: 'Word cards that start with',
    step1LetterWordsSuffix: "",
    step1TextareaTitle: "Write today’s English words",
    step1TextareaDescription:
      "You can also type English words here. Use commas (,) or line breaks. The words will turn into little chips.",
    chipsLabel:
      "Word chips · Click a chip to mark it as ★ must-use. These words are strongly requested in the story.",
    lengthHintPrefix: "Based on the number of words, this story will be about",
    lengthHintNormalSuffix: "5–7 short sentences.",
    lengthHintLongSuffix: "9–12 short sentences.",
    step2Tag: "STEP 2 · Story idea",
    step2Title: "Create a story idea with your child",
    step2Description:
      "Ask your child in your own language, then write short English phrases here. The English does not have to be perfect.",
    q1Label: "1) Who is the main character?",
    q1Help:
      "Name the main character. It can be your child, a pet, or a fun character.",
    q1Placeholder: "e.g. a brave girl named Yujin",
    q2Label: "2) Where does the story happen?",
    q2Help:
      "Choose a simple place like “in the park”, “in the yard”, or “in the kitchen”.",
    q2Placeholder: "e.g. in the yard with a cat and a dog",
    q3Label: "3) What happens in the story?",
    q3Help:
      "Describe a small problem or event. For example: a lost toy, a surprise guest, or trying something new.",
    q3Placeholder: "e.g. they find a magic ship and go on a short trip",
    createButton: "Create story",
    step3Tag: "STEP 3 · Result",
    step3Title: "Generated story for your child",
    step3Empty:
      'Fill in the steps above and press "Create story". A very simple English story will appear here.',
    errorPrefix: "",
    wordCountLabel: (count) =>
      count === 0
        ? "No words yet."
        : `You added ${count} word${count > 1 ? "s" : ""}.`,
  },
  ko: {
    langLabel: "KO",
    appTitle: "AI Storybook – 오늘 배운 단어로 영어 동화 만들기",
    appSubtitle:
      "아이와 함께 오늘 배운 영어 단어를 넣고, 3–7세 아이를 위한 아주 쉬운 영어 동화를 만들어 보세요.",
    step1Tag: "STEP 1 · Today’s words",
    step1Title: "오늘 배운 영어 단어 적기",
    step1Intro:
      "아래 알파벳 카드에서 단어를 고르거나, 오늘 수업·숙제·책에서 등장한 영어 단어를 직접 적어 주세요.",
    step1FromCardsLabel: "알파벳 카드에서 단어 고르기:",
    step1LetterHelp:
      "알파벳 버튼을 누르면, 그 알파벳으로 시작하는 단어 카드가 나옵니다.",
    step1LetterWordsPrefix: "“",
    step1LetterWordsSuffix: "” 로 시작하는 단어 카드",
    step1TextareaTitle: "오늘 배운 영어 단어 적기",
    step1TextareaDescription:
      "쉼표(,)나 줄바꿈으로 구분하면 단어 칩이 자동으로 만들어집니다.",
    chipsLabel:
      "Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는 단어로 표시됩니다.",
    lengthHintPrefix: "입력된 단어 개수 기준으로",
    lengthHintNormalSuffix: "5–7문장 정도의 짧은 동화가 생성됩니다.",
    lengthHintLongSuffix: "9–12문장 정도의 조금 긴 동화가 생성됩니다.",
    step2Tag: "STEP 2 · Story idea",
    step2Title: "아이와 함께 스토리 아이디어 만들기",
    step2Description:
      "아이에게 한국어로 물어보고, 부모가 간단한 영어 문장으로 대신 적어 줘도 됩니다. 완벽한 문장이 아니어도 괜찮습니다.",
    q1Label: "1) Who is the main character?",
    q1Help:
      "주인공을 정해 주세요. 아이 이름, 반려동물, 상상 속 캐릭터 모두 괜찮아요.",
    q1Placeholder: "예: a brave girl named Yujin",
    q2Label: "2) Where does the story happen?",
    q2Help:
      "“in the park”, “in the yard”, “in the kitchen” 처럼 간단한 장소를 적어 주세요.",
    q2Placeholder: "예: in the yard with a cat and a dog",
    q3Label: "3) What happens in the story?",
    q3Help:
      "작은 사건이나 문제를 적어 주세요. 예: 잃어버린 장난감, 깜짝 손님, 처음 해보는 도전 등.",
    q3Placeholder: "예: they find a magic ship and go on a short trip",
    createButton: "Create story",
    step3Tag: "STEP 3 · Result",
    step3Title: "AI가 만든 우리 아이 전용 동화",
    step3Empty:
      '"Create story" 버튼을 누르면, 여기 아주 쉬운 영어 동화가 나타납니다.',
    errorPrefix: "",
    wordCountLabel: (count) =>
      count === 0
        ? "아직 입력된 단어가 없습니다."
        : `지금까지 ${count}개의 단어가 들어갔어요.`,
  },
  zh: {
    langLabel: "中文",
    appTitle: "AI Storybook – 用今天学到的单词写一个英文故事",
    appSubtitle:
      "输入孩子今天学到的英文单词，为 3–7 岁孩子生成一个简单、有趣的英文故事。",
    step1Tag: "STEP 1 · Today’s words",
    step1Title: "写下今天学到的英文单词",
    step1Intro:
      "可以从下面的字母卡片中选择单词，或自己输入今天在课堂 / 作业 / 书里出现的英文单词。",
    step1FromCardsLabel: "从字母卡片中选择单词：",
    step1LetterHelp: "点击字母按钮，可以看到以该字母开头的单词卡片。",
    step1LetterWordsPrefix: "以 “",
    step1LetterWordsSuffix: "” 开头的单词卡片",
    step1TextareaTitle: "写下今天学到的英文单词",
    step1TextareaDescription:
      "使用逗号(,) 或换行分隔，单词会自动变成小标签。",
    chipsLabel:
      "Word chips · 点击单词可以标记为 ★ 必须使用，在故事中会尽量包含这些单词。",
    lengthHintPrefix: "根据单词数量，本故事大约会有",
    lengthHintNormalSuffix: "5–7 句短句。",
    lengthHintLongSuffix: "9–12 句较长的故事。",
    step2Tag: "STEP 2 · Story idea",
    step2Title: "和孩子一起想一个故事点子",
    step2Description:
      "可以先用母语和孩子聊天，然后用简单英文写在这里。句子不需要完美。",
    q1Label: "1) Who is the main character?",
    q1Help: "写出主角，可以是孩子自己、宠物，或有趣的角色。",
    q1Placeholder: "e.g. a brave girl named Yujin",
    q2Label: "2) Where does the story happen?",
    q2Help: "写一个简单的地点，例如 “in the park”“in the yard”“in the kitchen”。",
    q2Placeholder: "e.g. in the yard with a cat and a dog",
    q3Label: "3) What happens in the story?",
    q3Help:
      "写一个小事件，例如：丢失的玩具、突然来访的客人、尝试新事情等。",
    q3Placeholder: "e.g. they find a magic ship and go on a short trip",
    createButton: "Create story",
    step3Tag: "STEP 3 · Result",
    step3Title: "为孩子生成的英文故事",
    step3Empty:
      '完成上面的内容后点击 “Create story”，故事就会显示在这里。',
    errorPrefix: "",
    wordCountLabel: (count) =>
      count === 0
        ? "还没有单词。"
        : `你已经输入了 ${count} 个单词。`,
  },
};

// 색상 테마
const theme = {
  bg: "#FFF7ED",
  card: "#FFFFFF",
  step1Card: "#FFEFD9",
  step2Card: "#E6F7FB",
  step3Card: "#F5ECFF",
  accent: "#FF8A3C",
  accentSoft: "#FFE1C4",
  borderSoft: "#F1E0D1",
  textMain: "#32261A",
  textSub: "#6B6158",
  chipBg: "#FFF9F3",
  chipBorder: "#F0C9A8",
  chipActiveBg: "#FFE4BF",
  chipActiveBorder: "#FF9F42",
};

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// 단어 개수에 따라 스토리 길이 추론
function computeLengthFromWords(words) {
  const count = words.length;
  if (count === 0) return "normal";
  if (count <= 5) return "normal";
  return "long"; // 6개 이상이면 long
}

// 공통 입력 스타일
const inputStyle = {
  width: "100%",
  padding: 11,
  borderRadius: 14,
  border: "1px solid #D6C7B8",
  fontSize: 15,
  boxSizing: "border-box",
};

export default function Home() {
  const [lang, setLang] = useState("ko"); // 기본 KO
  const t = TEXTS[lang];

  const [wordsInput, setWordsInput] = useState("");
  const [words, setWords] = useState([]);
  const [mustUse, setMustUse] = useState([]);

  const [answers, setAnswers] = useState({
    mainCharacter: "",
    place: "",
    problem: "",
  });

  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 새로 추가: 현재 선택된 알파벳
  const [selectedLetter, setSelectedLetter] = useState("M");

  // 공통: 문자열에서 단어 배열로 파싱
  const parseWordsFromInput = (raw) => {
    return raw
      .split(/[,\\n]/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);
  };

  const syncWordsFromInput = (raw) => {
    const parts = parseWordsFromInput(raw);
    setWords(parts);
    setMustUse((prev) => prev.filter((w) => parts.includes(w)));
  };

  // 텍스트 영역 blur 시 단어 칩 동기화
  const handleWordsBlur = () => {
    syncWordsFromInput(wordsInput);
  };

  // 알파벳 카드의 단어 버튼을 눌렀을 때: wordsInput에 단어 추가 + 칩 동기화
  const handleAddWordFromCard = (wordText) => {
    const cleanWord = wordText.trim();
    if (!cleanWord) return;

    setWordsInput((prev) => {
      const prevTrimmed = prev.trim();

      // 기존 단어들
      const existingTokens = parseWordsFromInput(prevTrimmed).map((w) =>
        w.toLowerCase()
      );

      // 중복 방지
      if (existingTokens.includes(cleanWord.toLowerCase())) {
        return prev; // 그대로
      }

      const next =
        prevTrimmed.length === 0
          ? cleanWord
          : prevTrimmed + ", " + cleanWord;

      // 단어 배열도 함께 업데이트
      syncWordsFromInput(next);

      return next;
    });
  };

  const toggleMustUse = (word) => {
    setMustUse((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const handleAnswerChange = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateStory = async () => {
    setErrorMsg("");
    setStory("");

    const trimmedWords = words.map((w) => w.trim()).filter(Boolean);

    if (trimmedWords.length === 0) {
      setErrorMsg(
        lang === "ko"
          ? "먼저 오늘 배운 영어 단어를 입력해 주세요."
          : lang === "zh"
          ? "请先输入今天学到的英文单词。"
          : "Please enter today’s English words first."
      );
      return;
    }

    if (
      !answers.mainCharacter.trim() ||
      !answers.place.trim() ||
      !answers.problem.trim()
    ) {
      setErrorMsg(
        lang === "ko"
          ? "STEP 2의 세 가지 질문을 모두 간단히 채워 주세요."
          : lang === "zh"
          ? "请先填写完 STEP 2 里的三个问题。"
          : "Please answer all three questions in STEP 2."
      );
      return;
    }

    const inferredLength = computeLengthFromWords(trimmedWords);

    try {
      setLoading(true);

      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: trimmedWords,
          mustUse,
          answers,
          length: inferredLength,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create story.");
      }

      setStory(data.story || "");
    } catch (e) {
      console.error(e);
      setErrorMsg(
        (t.errorPrefix || "") +
          (e.message ||
            (lang === "ko"
              ? "알 수 없는 오류가 발생했습니다."
              : lang === "zh"
              ? "发生未知错误。"
              : "Unknown error occurred."))
      );
    } finally {
      setLoading(false);
    }
  };

  const wordCount = words.length;
  const inferredLength = computeLengthFromWords(words);

  // 현재 선택된 알파벳의 단어 카드 목록
  const currentLetterCards = WORD_CARDS[selectedLetter] || [];
  const currentLetterDisplay = selectedLetter;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        padding: "32px 16px 40px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 880,
          background: theme.card,
          borderRadius: 24,
          boxShadow: "0 18px 55px rgba(0,0,0,0.08)",
          padding: 28,
        }}
      >
        {/* 헤더 */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: theme.accent,
                marginBottom: 6,
              }}
            >
              MHJ STORYBOOK
            </div>
            <h1
              style={{
                fontSize: 26,
                lineHeight: 1.3,
                margin: 0,
                color: theme.textMain,
              }}
            >
              {t.appTitle}
            </h1>
            <p
              style={{
                marginTop: 6,
                fontSize: 15,
                lineHeight: 1.5,
                color: theme.textSub,
                maxWidth: 640,
              }}
            >
              {t.appSubtitle}
            </p>
          </div>

          {/* 언어 토글 */}
          <div
            style={{
              display: "inline-flex",
              borderRadius: 999,
              border: "1px solid #E3D3C3",
              padding: 3,
              background: "#FFF9F3",
              gap: 3,
              alignSelf: "flex-start",
            }}
          >
            {["en", "ko", "zh"].map((code) => {
              const active = lang === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  style={{
                    minWidth: 40,
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: active ? theme.accent : "transparent",
                    color: active ? "#FFFFFF" : "#7A6755",
                    boxShadow: active
                      ? "0 2px 6px rgba(0,0,0,0.15)"
                      : "none",
                  }}
                >
                  {TEXTS[code].langLabel}
                </button>
              );
            })}
          </div>
        </header>

        {/* STEP 1 */}
        <section
          style={{
            borderRadius: 20,
            padding: 20,
            background: theme.step1Card,
            border: `1px solid ${theme.borderSoft}`,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "5px 10px",
              borderRadius: 999,
              background: theme.accentSoft,
              color: theme.accent,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {t.step1Tag}
          </div>
          <h2
            style={{
              fontSize: 20,
              margin: "0 0 4px",
              color: theme.textMain,
            }}
          >
            {t.step1Title}
          </h2>
          <p
            style={{
              margin: "0 0 16px",
              fontSize: 15,
              lineHeight: 1.5,
              color: theme.textSub,
            }}
          >
            {t.step1Intro}
          </p>

          {/* 알파벳 선택 */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 6,
                color: theme.textMain,
              }}
            >
              {t.step1FromCardsLabel}
            </div>
            <div
              style={{
                fontSize: 13,
                color: theme.textSub,
                marginBottom: 8,
              }}
            >
              {t.step1LetterHelp}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 10,
              }}
            >
              {LETTERS.map((letter) => {
                const active = selectedLetter === letter;
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => setSelectedLetter(letter)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      border: active
                        ? `2px solid ${theme.accent}`
                        : "1px solid #E3D3C3",
                      background: active ? "#FFE7CC" : "#FFFDF9",
                      fontSize: 18,
                      fontWeight: 700,
                      cursor: "pointer",
                      color: theme.textMain,
                    }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* 선택된 알파벳의 단어 카드 리스트 */}
            <div style={{ marginTop: 4 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: theme.textMain,
                }}
              >
                {t.step1LetterWordsPrefix}
                {currentLetterDisplay}
                {t.step1LetterWordsSuffix}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {currentLetterCards.length === 0 && (
                  <span
                    style={{
                      fontSize: 13,
                      color: "#B0A49A",
                    }}
                  >
                    No cards for this letter yet.
                  </span>
                )}

                {currentLetterCards.map((card) => {
                  const wordText =
                    card.id.split("_")[1] || card.id; // "M_Milk" → "Milk"
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleAddWordFromCard(wordText)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 90,
                        padding: "8px 6px",
                        borderRadius: 14,
                        border: "1px solid #E3D3C3",
                        background: "#FFFDF9",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 12,
                          overflow: "hidden",
                          marginBottom: 4,
                          background: "#FFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={card.imageUrl}
                          alt={wordText}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            display: "block",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: theme.textMain,
                        }}
                      >
                        {wordText}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 텍스트 입력 영역 + 칩 */}
          <div style={{ marginTop: 20 }}>
            <h3
              style={{
                fontSize: 16,
                margin: "0 0 6px",
                color: theme.textMain,
              }}
            >
              {t.step1TextareaTitle}
            </h3>
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 14,
                color: theme.textSub,
              }}
            >
              {t.step1TextareaDescription}
            </p>

            <textarea
              value={wordsInput}
              onChange={(e) => setWordsInput(e.target.value)}
              onBlur={handleWordsBlur}
              rows={4}
              placeholder="apple, banana, princess, ship"
              style={{
                width: "100%",
                resize: "vertical",
                padding: 12,
                borderRadius: 14,
                border: "1px solid #E3D3C3",
                fontSize: 15,
                lineHeight: 1.5,
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            {/* 칩 & 길이 힌트 */}
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  fontSize: 14,
                  color: theme.textMain,
                  marginBottom: 4,
                }}
              >
                {t.chipsLabel}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: theme.textSub,
                  marginBottom: 6,
                }}
              >
                {t.wordCountLabel(wordCount)}{" "}
                {wordCount > 0 && (
                  <>
                    · {t.lengthHintPrefix}{" "}
                    <strong>
                      {inferredLength === "normal"
                        ? t.lengthHintNormalSuffix
                        : t.lengthHintLongSuffix}
                    </strong>
                  </>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  minHeight: 32,
                  alignItems: "center",
                }}
              >
                {words.length === 0 && (
                  <span style={{ fontSize: 13, color: "#B0A49A" }}>
                    apple, banana 처럼 입력한 뒤 바깥을 클릭해 보세요.
                  </span>
                )}
                {words.map((w) => {
                  const isMust = mustUse.includes(w);
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => toggleMustUse(w)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        border: `1px solid ${
                          isMust ? theme.chipActiveBorder : theme.chipBorder
                        }`,
                        background: isMust
                          ? theme.chipActiveBg
                          : theme.chipBg,
                        fontSize: 14,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {isMust && <span>★</span>}
                      <span>{w}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2 */}
        <section
          style={{
            borderRadius: 20,
            padding: 20,
            background: theme.step2Card,
            border: "1px solid #D2E7F1",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "5px 10px",
              borderRadius: 999,
              background: "#D3F0F9",
              color: "#2883A8",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {t.step2Tag}
          </div>
          <h2
            style={{
              fontSize: 20,
              margin: "0 0 4px",
              color: theme.textMain,
            }}
          >
            {t.step2Title}
          </h2>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 15,
              lineHeight: 1.5,
              color: theme.textSub,
            }}
          >
            {t.step2Description}
          </p>

          {/* Q1 */}
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 4,
                color: theme.textMain,
              }}
            >
              {t.q1Label}
            </label>
            <div
              style={{
                fontSize: 13,
                color: theme.textSub,
                marginBottom: 4,
              }}
            >
              {t.q1Help}
            </div>
            <input
              type="text"
              value={answers.mainCharacter}
              onChange={(e) =>
                handleAnswerChange("mainCharacter", e.target.value)
              }
              placeholder={t.q1Placeholder}
              style={inputStyle}
            />
          </div>

          {/* Q2 */}
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 4,
                color: theme.textMain,
              }}
            >
              {t.q2Label}
            </label>
            <div
              style={{
                fontSize: 13,
                color: theme.textSub,
                marginBottom: 4,
              }}
            >
              {t.q2Help}
            </div>
            <input
              type="text"
              value={answers.place}
              onChange={(e) => handleAnswerChange("place", e.target.value)}
              placeholder={t.q2Placeholder}
              style={inputStyle}
            />
          </div>

          {/* Q3 */}
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 4,
                color: theme.textMain,
              }}
            >
              {t.q3Label}
            </label>
            <div
              style={{
                fontSize: 13,
                color: theme.textSub,
                marginBottom: 4,
              }}
            >
              {t.q3Help}
            </div>
            <input
              type="text"
              value={answers.problem}
              onChange={(e) => handleAnswerChange("problem", e.target.value)}
              placeholder={t.q3Placeholder}
              style={inputStyle}
            />
          </div>

          {/* 버튼 + 에러 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={handleCreateStory}
              disabled={loading}
              style={{
                padding: "10px 22px",
                borderRadius: 999,
                border: "none",
                background: theme.accent,
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? "Creating..." : t.createButton}
            </button>
            {errorMsg && (
              <div
                style={{
                  fontSize: 13,
                  color: "#C62828",
                  maxWidth: 420,
                }}
              >
                {errorMsg}
              </div>
            )}
          </div>
        </section>

        {/* STEP 3 */}
        <section
          style={{
            borderRadius: 20,
            padding: 20,
            background: theme.step3Card,
            border: "1px solid #E0D4FF",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "5px 10px",
              borderRadius: 999,
              background: "#E3D6FF",
              color: "#5A3AC2",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {t.step3Tag}
          </div>
          <h2
            style={{
              fontSize: 20,
              margin: "0 0 10px",
              color: theme.textMain,
            }}
          >
            {t.step3Title}
          </h2>

          {!story && (
            <p
              style={{
                fontSize: 15,
                color: theme.textSub,
                margin: 0,
              }}
            >
              {t.step3Empty}
            </p>
          )}

          {story && (
            <div
              style={{
                marginTop: 6,
                padding: 16,
                borderRadius: 16,
                background: "#FFFFFF",
                fontSize: 16,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                border: "1px solid #E2D8FF",
              }}
            >
              {story}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
