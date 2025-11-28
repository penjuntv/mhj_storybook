// pages/index.js
import { useState } from "react";
import { UI_TEXT } from "../lib/uiText";
import LanguageToggle from "../components/storybook/LanguageToggle";
import Step1Words from "../components/storybook/Step1Words";
import Step2Story from "../components/storybook/Step2Story";
import StoryResult from "../components/storybook/StoryResult";

export default function HomePage() {
  const [language, setLanguage] = useState("ko"); // "en" | "ko" | "zh"
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [selectedWords, setSelectedWords] = useState([]); // [{ word, mustInclude }]
  const [story, setStory] = useState("");

  const t = UI_TEXT[language] || UI_TEXT.ko;

  const pageStyle = {
    minHeight: "100vh",
    background: "#FFF6EC",
    padding: "24px 12px 48px",
    display: "flex",
    justifyContent: "center",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, system-ui, 'Noto Sans KR', sans-serif",
    color: "#4a2f1a",
  };

  const containerStyle = {
    maxWidth: 1080,
    width: "100%",
    background: "#FFEFD9",
    borderRadius: 24,
    padding: "32px 32px 40px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
  };

  const headerRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  };

  return (
    <div style={pageStyle}>
      <main style={containerStyle}>
        {/* 헤더 + 언어 토글 */}
        <div style={headerRowStyle}>
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                margin: 0,
                marginBottom: 6,
              }}
            >
              {t.header}
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.5,
                opacity: 0.9,
              }}
            >
              {t.subtitle}
            </p>
          </div>
          <LanguageToggle language={language} onChange={setLanguage} />
        </div>

        {/* STEP 1 – 카드 + 단어 칩 */}
        <Step1Words
          t={t}
          selectedLetter={selectedLetter}
          onChangeLetter={setSelectedLetter}
          selectedWords={selectedWords}
          onChangeSelectedWords={setSelectedWords}
        />

        {/* STEP 2 – 아이 프로필 + 아이디어 + 동화 생성 */}
        <Step2Story
          t={t}
          language={language}
          selectedWords={selectedWords}
          onStoryGenerated={setStory}
        />

        {/* 결과 동화 */}
        <StoryResult t={t} story={story} />
      </main>
    </div>
  );
}
