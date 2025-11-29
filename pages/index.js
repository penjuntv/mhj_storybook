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

// STEP 2에서 선택한 옵션과 단어들로 로컬 스토리 생성
function buildLocalStory({ language, kidName, pov, themes, length, words }) {
  const safeLang = language === "ko" || language === "zh" ? language : "en";
  const trimmedName = (kidName || "").trim();
  const displayName =
    trimmedName ||
    (safeLang === "ko"
      ? "한 아이"
      : safeLang === "zh"
      ? "一个孩子"
      : "a child");

  const subject =
    pov === "first"
      ? safeLang === "ko"
        ? "나는"
        : "I"
      : displayName;

  const subjectCap =
    subject.charAt(0).toUpperCase() + subject.slice(1);

  const possessive =
    pov === "first"
      ? safeLang === "ko"
        ? "나의"
        : "my"
      : safeLang === "ko"
      ? `${displayName}의`
      : `${displayName}'s`;

  const mainTheme = Array.isArray(themes) && themes.length > 0
    ? themes[0]
    : "everyday";

  const themeTextMap = {
    everyday:
      safeLang === "ko"
        ? "일상 속에서 펼쳐지는 작은 모험"
        : "a small adventure in an ordinary day",
    school:
      safeLang === "ko"
        ? "학교에서 벌어지는 이야기"
        : "a story that happens at school",
    family:
      safeLang === "ko"
        ? "따뜻한 가족 이야기"
        : "a warm family story",
    friends:
      safeLang === "ko"
        ? "친구들과 함께하는 시간"
        : "time spent with friends",
    animals:
      safeLang === "ko"
        ? "동물 친구들이 나오는 모험"
        : "an adventure with animal friends",
    princess:
      safeLang === "ko"
        ? "공주가 등장하는 동화"
        : "a fairy tale with a princess",
    hero:
      safeLang === "ko"
        ? "용감한 영웅 이야기"
        : "a brave hero story",
    fairytale:
      safeLang === "ko"
        ? "전래동화 느낌의 이야기"
        : "a classic fairy-tale style story",
    animation:
      safeLang === "ko"
        ? "애니메이션 같은 톤의 이야기"
        : "a story that feels like an animation",
    space:
      safeLang === "ko"
        ? "우주를 여행하는 모험"
        : "an adventure in space",
  };

  const themeSentence =
    themeTextMap[mainTheme] || themeTextMap.everyday;

  const wordsList = words.join(", ");

  const lengthHint =
    length === "short"
      ? safeLang === "ko"
        ? "아주 짧은 이야기"
        : "a very short story"
      : length === "long"
      ? safeLang === "ko"
        ? "조금 더 긴 이야기"
        : "a longer adventure"
      : safeLang === "ko"
      ? "보통 길이의 이야기"
      : "a normal-length story";

  const paragraphs = [];

  if (safeLang === "ko") {
    paragraphs.push(
      `${subjectCap} 오늘 ${wordsList} 라는 영어 단어들을 배웠다. 이 단어들이 어떻게 이야기 속에서 쓰일지 궁금해졌다.`
    );
    paragraphs.push(
      `${possessive} 이야기는 ${themeSentence}이고, 전체 분위기는 ${lengthHint}로 정해 보았다.`
    );
    paragraphs.push(
      `이야기 속에서 ${subject} ${wordsList} 같은 단어들을 한 번씩 꼭 사용해 본다. 단어들이 문장 안에서 반짝이며 살아 움직인다.`
    );
    if (length === "long") {
      paragraphs.push(
        `이야기가 계속될수록 단어들은 단순한 시험 문제가 아니라, 하루를 기억하게 해 주는 작은 조각들처럼 느껴진다.`
      );
    }
    paragraphs.push(
      `이렇게 만들어진 동화를 여러 번 읽다 보면, ${wordsList} 같은 단어들이 더 이상 낯설지 않고, ${subject} 일상에 자연스럽게 스며들게 될 것이다.`
    );
  } else {
    // 기본: 영어 버전
    paragraphs.push(
      `${subjectCap} learned some new English words today: ${wordsList}. I wondered how these words could live inside a story.`
    );
    paragraphs.push(
      `${possessive} story was set as ${themeSentence}, and we decided to make it ${lengthHint}.`
    );
    paragraphs.push(
      `Inside the story, ${subject} tries to use each word, like ${wordsList}, in a natural sentence so the words start to shine.`
    );
    if (length === "long") {
      paragraphs.push(
        `As the adventure continues, the words stop feeling like test questions and start to feel like little pieces of real life.`
      );
    }
    paragraphs.push(
      `By reading this story again and again, those words — ${wordsList} — will feel friendlier and become part of everyday language.`
    );
  }

  return paragraphs.join("\n\n");
}

export default function HomePage() {
  // 언어 상태 ("ko" | "en" | "zh" 외 값이 들어와도 getUIText 안에서 en으로 폴백)
  const [language, setLanguage] = useState("ko");

  // STEP1 – 알파벳 / 카드
  const [selectedLetter, setSelectedLetter] = useState("A");
  const {
    cards,
    isLoading: cardsLoading,
    error: cardsError,
  } = useWordCards(selectedLetter);

  // STEP1 – 오늘 배운 단어 (칩)
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

  // UI 텍스트: lib/uiText.js에서 가져오되, 절대 undefined 접근이 일어나지 않도록 방어
  const rawText = getUIText(language);
  const t = rawText && typeof rawText === "object" ? rawText : {};

  const get = (key, fallback) =>
    t && Object.prototype.hasOwnProperty.call(t, key) && t[key] != null
      ? t[key]
      : fallback;

  const ui = {
    // STEP 1
    pageTitle: get(
      "appTitle",
      "AI Storybook – 오늘 배운 단어로 영어 동화 만들기"
    ),
    step1Title: get("step1Title", "STEP 1 · Today's words"),
    step1Description: get(
      "step1Subtitle",
      "오늘 수업·숙제·책에서 등장한 영어 단어를 적거나, 아래 카드에서 골라 보세요."
    ),
    step1InputLabel: get(
      "writeWordsLabel",
      "오늘 배운 영어 단어 적기"
    ),
    step1InputPlaceholder: get(
      "writeWordsPlaceholder",
      "apple, banana, mom 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요."
    ),
    chipsHint: get(
      "chipsLabel",
      "Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는 단어로 표시됩니다. X로 삭제할 수 있습니다."
    ),
    step1NoCards: get(
      "noCardsForLetter",
      "아직 이 알파벳에는 카드가 없습니다."
    ),

    // STEP 2
    step2Title: get("step2Title", "STEP 2 · AI가 만든 영어 동화"),
    step2Intro: get(
      "step2Subtitle",
      "아이 이름과 이야기 방식을 고르고, 동화의 테마와 길이를 선택해 주세요. 단어 2~8개를 고르면 AI가 아이 눈높이에 맞춰 동화를 만들어 줍니다."
    ),

    nameLabel: get("kidNameLabel", "이름 (예: Yujin)"),
    wayLabel: get("povLabel", "이야기 방식"),
    wayFirst: get(
      "povFirstPerson",
      "내가 이야기의 주인공 (1인칭)"
    ),
    wayThird: get(
      "povThirdPerson",
      "내가 들려주는 이야기 (3인칭)"
    ),

    themeLabel: get("themeTitle", "이야기 테마 고르기"),
    lengthLabel: get("lengthTitle", "이야기 길이 선택"),
    lengthShort: get("lengthShort", "짧게"),
    lengthNormal: get("lengthNormal", "보통"),
    lengthLong: get("lengthLong", "길게"),

    requestButtonLabel: get(
      "askButton",
      "AI에게 영어 동화 만들기 요청하기"
    ),
    loadingStory: get(
      "loadingStory",
      "AI가 동화를 만드는 중입니다..."
    ),
    mustSelectWordsMsg: get(
      "mustSelectWords",
      "단어를 1개 이상 선택해 주세요."
    ),
    resultTitle: get(
      "resultTitle",
      "AI가 만든 오늘의 영어 동화"
    ),
    resultPlaceholder: get(
      "resultPlaceholder",
      "단어와 테마를 선택한 뒤, AI에게 동화를 요청해 보세요."
    ),
    storyTooFewWords: get("storyTooFewWords", null),
    ideasTooFewWords: get("ideasTooFewWords", null),
  };

  // STEP1 – 카드에서 단어 추가
  const handleSelectCardWord = (word) => {
    if (!word) return;
    if (selectedWords.length >= MAX_WORDS) return;
    if (selectedWords.some((w) => w.word === word)) return;

    setSelectedWords((prev) => [
      ...prev,
      { word, mustInclude: false },
    ]);
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
      const exist = new Set(
        prev.map((w) => w.word.toLowerCase())
      );
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
        w.word === word
          ? { ...w, mustInclude: !w.mustInclude }
          : w
      )
    );
  };

  // STEP1 – 칩 삭제
  const removeWordChip = (word) => {
    setSelectedWords((prev) =>
      prev.filter((w) => w.word !== word)
    );
  };

  // STEP2 – 테마 토글
  const toggleTheme = (id) => {
    setThemeId((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // STEP2 – 동화 요청 (현재는 로컬 스토리 생성)
  async function handleRequestStory() {
    setStory("");
    setStoryError(null);

    const coreWords = selectedWords
      .map((w) =>
        typeof w === "string" ? w : w.word
      )
      .filter(Boolean);

    // 최소 2개 이상 단어 사용
    if (coreWords.length < 2) {
      const msg =
        ui.storyTooFewWords ||
        ui.ideasTooFewWords ||
        ui.mustSelectWordsMsg;
      setStoryError(msg);
      return;
    }

    setIsRequesting(true);
    try {
      const payload = {
        language,
        kidName: kidName || "",
        pov,
        themes: Array.isArray(themeId) ? themeId : [],
        length,
        words: coreWords,
      };

      const localStory = buildLocalStory(payload);
      setStory(localStory);
    } catch (err) {
      console.error(err);
      setStoryError(
        "동화를 만드는 중 문제가 발생했습니다."
      );
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
        <h1>{ui.pageTitle}</h1>
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
        <h2>{ui.step1Title}</h2>
        <p>{ui.step1Description}</p>

        <AlphabetPicker
          selectedLetter={selectedLetter}
          onSelectLetter={setSelectedLetter}
        />

        <WordCardsGrid
          cards={cards}
          isLoading={cardsLoading}
          error={cardsError}
          onSelectWord={handleSelectCardWord}
          emptyMessage={ui.step1NoCards}
        />

        <div className="word-input-block">
          <label>{ui.step1InputLabel}</label>
          <div className="word-input-row">
            <input
              type="text"
              value={wordInput}
              onChange={(e) =>
                setWordInput(e.target.value)
              }
              placeholder={ui.step1InputPlaceholder}
            />
            <button
              type="button"
              onClick={handleAddWordsFromInput}
            >
              추가
            </button>
          </div>

          <p className="chips-hint">
            {ui.chipsHint} {selectedWords.length}/{MAX_WORDS}
          </p>

          <div className="chips-row">
            {selectedWords.map((w) => (
              <button
                key={w.word}
                type="button"
                className={`chip ${
                  w.mustInclude ? "must" : ""
                }`}
                onClick={() =>
                  toggleMustInclude(w.word)
                }
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

      {/* STEP 2 */}
      <section className="step-section step2">
        <h2>{ui.step2Title}</h2>
        <p>{ui.step2Intro}</p>

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
            nameLabel: ui.nameLabel,
            wayLabel: ui.wayLabel,
            wayFirst: ui.wayFirst,
            wayThird: ui.wayThird,
            themeLabel: ui.themeLabel,
            lengthLabel: ui.lengthLabel,
            lengthShort: ui.lengthShort,
            lengthNormal: ui.lengthNormal,
            lengthLong: ui.lengthLong,
          }}
        />

        <div className="request-row">
          <button
            type="button"
            onClick={handleRequestStory}
            disabled={isRequesting}
          >
            {isRequesting
              ? ui.loadingStory
              : ui.requestButtonLabel}
          </button>
        </div>

        <StoryResult
          story={story}
          error={storyError}
          title={ui.resultTitle}
          placeholder={ui.resultPlaceholder}
        />
      </section>
    </div>
  );
}
