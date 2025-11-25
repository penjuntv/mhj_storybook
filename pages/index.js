// pages/index.js
import { useState, useMemo } from "react";

const TEXTS = {
  en: {
    langLabel: "Language",
    langShort: "EN",
    pageTitle: "AI Storybook – Create an English story with today's words",
    pageSubtitle:
      "Type the English words your child learned today and build a fun, very simple story for ages 3–7.",
    step1Tag: "STEP 1 · Today’s words",
    step1Title: "Write today’s English words",
    step1Desc:
      "Type the English words from today’s class / homework / book. Use commas (,) or line breaks. The words will turn into little chips.",
    wordsPlaceholder: "e.g. apple, banana, cat, dog",
    chipsHelpTitle: "Word chips",
    chipsHelpBody:
      "Click a word to mark it as ★ must-use. These words are strongly requested in the story.",
    chipsEmpty: "No words yet. Type above and click outside the box.",
    step2Tag: "STEP 2 · Story idea",
    step2Title: "Create a story idea with your child",
    step2Desc:
      "Ask your child in your own language, then write short English phrases here. The English does not have to be perfect.",
    q1Label: "1) Who is the main character?",
    q1Help: "Name the main character. It can be your child, a pet, or a fun character.",
    q1Placeholder: "e.g. a little girl named Mina",
    q2Label: "2) Where does the story happen?",
    q2Help:
      "Choose a simple place like “in the park”, “in the yard”, or “in the kitchen”.",
    q2Placeholder: "e.g. in a small park near her house",
    q3Label: "3) What happens in the story?",
    q3Help:
      "Describe a small problem or event. For example: a lost toy, a surprise guest, or trying something new.",
    q3Placeholder: "e.g. she loses her red ball and meets a talking cat",
    createButton: "Create story",
    creatingButton: "Creating story...",
    errorNoWords: "Please enter at least one English word in STEP 1.",
    errorNoAnswers: "Please fill all 3 questions in STEP 2 with simple English.",
    resultTag: "STEP 3 · Result",
    resultTitle: "Your child’s own AI story",
    resultPlaceholder:
      'After filling the steps and clicking "Create story", a very simple English story will appear here.',
    adminNoteTitle: "Admin note",
    adminNoteBody:
      "This page is a small Next.js project that exposes only the /api/story endpoint. Later you can connect this API from Framer, Figma, or other apps.",
    errorGeneric: "Failed to create story.",
    lengthHintNormal:
      "Based on the number of words, this story will be about 5–7 short sentences.",
    lengthHintLong:
      "Based on the number of words, this story will be about 9–12 short sentences.",
  },
  ko: {
    langLabel: "언어",
    langShort: "KO",
    pageTitle: "AI Storybook – 오늘 배운 단어로 영어 동화 만들기",
    pageSubtitle:
      "아이와 함께 오늘 배운 영어 단어를 넣고, 3–7세 아이를 위한 아주 쉬운 영어 동화를 만들어 보세요.",
    step1Tag: "STEP 1 · Today’s words",
    step1Title: "오늘 배운 영어 단어 적기",
    step1Desc:
      "오늘 수업·숙제·책에서 등장한 영어 단어를 적어 주세요. 쉼표(,)나 줄바꿈으로 구분하면 단어 칩이 자동으로 만들어집니다.",
    wordsPlaceholder: "예) apple, banana, cat, dog",
    chipsHelpTitle: "Word chips (단어 칩)",
    chipsHelpBody:
      "단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는 단어로 표시됩니다.",
    chipsEmpty: "아직 단어가 없습니다. 위 입력창에 단어를 적고 바깥을 클릭해 보세요.",
    step2Tag: "STEP 2 · Story idea",
    step2Title: "아이와 함께 스토리 아이디어 만들기",
    step2Desc:
      "아이에게 한국어나 모국어로 질문하고, 부모가 간단한 영어 문장으로 대신 적어 줘도 됩니다. 완벽한 문장이 아니어도 괜찮습니다.",
    q1Label: "1) Who is the main character?",
    q1Help: "주인공을 정해 주세요. 아이 이름, 반려동물, 상상 속 캐릭터 모두 괜찮아요.",
    q1Placeholder: "예) a little girl named Mina",
    q2Label: "2) Where does the story happen?",
    q2Help: "“in the park”, “in the yard”, “in the kitchen” 처럼 간단한 장소를 적어 주세요.",
    q2Placeholder: "예) in a small park near her house",
    q3Label: "3) What happens in the story?",
    q3Help:
      "작은 사건이나 문제를 적어 주세요. 예: 잃어버린 장난감, 깜짝 손님, 처음 해보는 도전 등.",
    q3Placeholder: "예) she loses her red ball and meets a talking cat",
    createButton: "Create story",
    creatingButton: "스토리 생성 중...",
    errorNoWords: "STEP 1에 오늘 배운 영어 단어를 한 가지 이상 입력해 주세요.",
    errorNoAnswers: "STEP 2의 세 가지 질문을 모두 간단한 영어로 채워 주세요.",
    resultTag: "STEP 3 · Result",
    resultTitle: "AI가 만든 우리 아이 전용 동화",
    resultPlaceholder:
      '"Create story" 버튼을 누르면, 여기 아주 쉬운 영어 동화가 나타납니다.',
    adminNoteTitle: "Admin note",
    adminNoteBody:
      "이 페이지는 /api/story 엔드포인트 하나만 사용하는 간단한 Next.js 프로젝트입니다. 나중에 Framer, Figma, 다른 앱에서 이 API만 따로 연결해서 써도 됩니다.",
    errorGeneric: "스토리 생성에 실패했습니다.",
    lengthHintNormal: "입력된 단어 개수 기준으로 5–7문장 정도의 짧은 동화가 생성됩니다.",
    lengthHintLong: "입력된 단어 개수 기준으로 9–12문장 정도의 긴 동화가 생성됩니다.",
  },
  zh: {
    langLabel: "语言",
    langShort: "中文",
    pageTitle: "AI Storybook – 用今天学到的单词写英语故事",
    pageSubtitle:
      "输入孩子今天学到的英文单词，为 3–7 岁儿童生成一个非常简单、有趣的英文故事。",
    step1Tag: "STEP 1 · Today’s words",
    step1Title: "写下今天学到的英语单词",
    step1Desc:
      "输入今天在课堂 / 作业 / 书里出现的英语单词。用逗号(,)或换行分隔，系统会自动生成小标签。",
    wordsPlaceholder: "例如：apple, banana, cat, dog",
    chipsHelpTitle: "单词标签",
    chipsHelpBody:
      "点击标签可以标记为★，这些单词会被优先放进故事里。",
    chipsEmpty: "还没有单词。请在上面的输入框里输入单词，然后点击空白处。",
    step2Tag: "STEP 2 · Story idea",
    step2Title: "和孩子一起想一个故事点子",
    step2Desc:
      "可以用母语和孩子交流，再用简单英文写下来。英文不需要完美，只要意思对就可以。",
    q1Label: "1) Who is the main character?",
    q1Help: "决定主角，可以是孩子、宠物，或一个有趣的角色。",
    q1Placeholder: "例如：a little girl named Mina",
    q2Label: "2) Where does the story happen?",
    q2Help: "选择一个简单的地点，例如 “in the park”, “in the yard”, “in the kitchen”。",
    q2Placeholder: "例如：in a small park near her house",
    q3Label: "3) What happens in the story?",
    q3Help:
      "写一个小事件或问题，例如：丢失的玩具、突然出现的客人、第一次尝试做某件事等。",
    q3Placeholder: "例如：she loses her red ball and meets a talking cat",
    createButton: "生成故事",
    creatingButton: "生成中...",
    errorNoWords: "请在 STEP 1 输入至少一个英文单词。",
    errorNoAnswers: "请在 STEP 2 的三个问题中都写上简单的英文句子。",
    resultTag: "STEP 3 · Result",
    resultTitle: "属于孩子的 AI 英语故事",
    resultPlaceholder:
      "完成上面的步骤并点击“生成故事”后，这里会出现一篇非常简单的英文故事。",
    adminNoteTitle: "Admin note",
    adminNoteBody:
      "此页面是一个只暴露 /api/story 接口的小型 Next.js 项目。以后可以在 Framer、Figma 或其他应用里直接调用这个 API。",
    errorGeneric: "生成故事失败。",
    lengthHintNormal: "根据单词数量，本次故事大约为 5–7 句短句。",
    lengthHintLong: "根据单词数量，本次故事大约为 9–12 句短句。",
  },
};

export default function Home() {
  const [language, setLanguage] = useState("en");
  const t = useMemo(() => TEXTS[language], [language]);

  const [wordsInput, setWordsInput] = useState("");
  const [words, setWords] = useState([]);
  const [mustUse, setMustUse] = useState([]);
  const [answers, setAnswers] = useState({
    mainCharacter: "",
    place: "",
    event: "",
  });
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // STEP 1: parse words into chips
  const handleWordsBlur = () => {
    const parts = wordsInput
      .split(/[,|\n]/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    setWords(parts);
    setMustUse((prev) => prev.filter((w) => parts.includes(w)));
  };

  const toggleMustUse = (word) => {
    setMustUse((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  // STEP 2: answers
  const handleAnswerChange = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  // length hint (normal / long) based on words count
  const lengthHint = useMemo(() => {
    if (words.length === 0) return "";
    if (words.length <= 5) return t.lengthHintNormal;
    return t.lengthHintLong;
  }, [words.length, t]);

  // Create story
  const handleCreateStory = async () => {
    setErrorMsg("");
    setStory("");

    const trimmedWords = words.map((w) => w.trim()).filter(Boolean);

    if (trimmedWords.length === 0) {
      setErrorMsg(t.errorNoWords);
      return;
    }

    if (
      !answers.mainCharacter.trim() ||
      !answers.place.trim() ||
      !answers.event.trim()
    ) {
      setErrorMsg(t.errorNoAnswers);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: trimmedWords,
          mustUse,
          answers,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t.errorGeneric);
      }

      const data = await res.json();
      setStory(data.story || "");
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message || t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <div className="app-card">
        {/* Language switcher */}
        <div className="app-top-bar">
          <div className="app-brand">MHJ Storybook</div>
          <div className="lang-switcher" aria-label={t.langLabel}>
            <button
              type="button"
              className={language === "en" ? "lang-btn active" : "lang-btn"}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={language === "ko" ? "lang-btn active" : "lang-btn"}
              onClick={() => setLanguage("ko")}
            >
              KO
            </button>
            <button
              type="button"
              className={language === "zh" ? "lang-btn active" : "lang-btn"}
              onClick={() => setLanguage("zh")}
            >
              中文
            </button>
          </div>
        </div>

        {/* Header */}
        <header className="app-header">
          <span className="app-tag">AI Storybook</span>
          <h1 className="app-title">{t.pageTitle}</h1>
          <p className="app-sub">{t.pageSubtitle}</p>
        </header>

        {/* STEP 1 */}
        <section className="step-card step-card-words">
          <div className="step-header">
            <span className="step-label">{t.step1Tag}</span>
            <h2 className="step-title">{t.step1Title}</h2>
            <p className="step-desc">{t.step1Desc}</p>
          </div>

          <label className="field-label" htmlFor="words-area">
            {t.step1Title}
          </label>
          <textarea
            id="words-area"
            className="textarea"
            value={wordsInput}
            onChange={(e) => setWordsInput(e.target.value)}
            onBlur={handleWordsBlur}
            placeholder={t.wordsPlaceholder}
          />

          <div className="chips-section">
            <div className="chips-help">
              {t.chipsHelpTitle}
              <span className="chips-help-sub"> · {t.chipsHelpBody}</span>
            </div>
            {lengthHint && (
              <div className="chips-note">
                <span className="star">●</span> {lengthHint}
              </div>
            )}
            <div className="chips-row">
              {words.length === 0 && (
                <span className="chips-empty">{t.chipsEmpty}</span>
              )}
              {words.map((w) => {
                const isMust = mustUse.includes(w);
                return (
                  <button
                    type="button"
                    key={w}
                    className={
                      isMust ? "chip chip-selected" : "chip chip-normal"
                    }
                    onClick={() => toggleMustUse(w)}
                  >
                    {isMust && <span className="chip-star">★</span>}
                    <span className="chip-text">{w}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* STEP 2 */}
        <section className="step-card step-card-story">
          <div className="step-header">
            <span className="step-label">{t.step2Tag}</span>
            <h2 className="step-title">{t.step2Title}</h2>
            <p className="step-desc">{t.step2Desc}</p>
          </div>

          <div className="field-group">
            <label className="field-label">{t.q1Label}</label>
            <p className="field-help">{t.q1Help}</p>
            <input
              type="text"
              className="input"
              value={answers.mainCharacter}
              onChange={(e) =>
                handleAnswerChange("mainCharacter", e.target.value)
              }
              placeholder={t.q1Placeholder}
            />
          </div>

          <div className="field-group">
            <label className="field-label">{t.q2Label}</label>
            <p className="field-help">{t.q2Help}</p>
            <input
              type="text"
              className="input"
              value={answers.place}
              onChange={(e) => handleAnswerChange("place", e.target.value)}
              placeholder={t.q2Placeholder}
            />
          </div>

          <div className="field-group">
            <label className="field-label">{t.q3Label}</label>
            <p className="field-help">{t.q3Help}</p>
            <input
              type="text"
              className="input"
              value={answers.event}
              onChange={(e) => handleAnswerChange("event", e.target.value)}
              placeholder={t.q3Placeholder}
            />
          </div>

          <div className="button-row">
            <button
              type="button"
              className="btn primary"
              onClick={handleCreateStory}
              disabled={loading}
            >
              {loading ? t.creatingButton : t.createButton}
            </button>
          </div>

          {errorMsg && <div className="error-msg">{errorMsg}</div>}
        </section>

        {/* STEP 3: Result */}
        <section className="step-card step-card-result">
          <div className="step-header">
            <span className="step-label">{t.resultTag}</span>
            <h2 className="step-title">{t.resultTitle}</h2>
          </div>

          {!story && !loading && (
            <p className="placeholder">{t.resultPlaceholder}</p>
          )}

          {story && (
            <div className="story-box">
              <div className="story-tag">Generated story</div>
              <p className="story-text">{story}</p>
            </div>
          )}
        </section>

        {/* Admin note */}
        <section className="admin-section">
          <h3 className="admin-title">{t.adminNoteTitle}</h3>
          <p className="admin-text">{t.adminNoteBody}</p>
        </section>
      </div>
    </div>
  );
}
