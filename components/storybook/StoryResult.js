// components/storybook/StoryResult.js
// STEP 2: 생성된 동화 보여주는 영역

export default function StoryResult({
  story,
  error,
  title,
  warningFewWords,
  ideasFewWords,
}) {
  const hasStory = typeof story === "string" && story.trim().length > 0;

  const safeTitle =
    title || "AI가 만든 오늘의 영어 동화";

  const placeholder =
    ideasFewWords ||
    "단어와 테마를 선택한 뒤, AI에게 동화를 요청해 보세요.";

  return (
    <div className="story-result">
      <h2 className="section-title">{safeTitle}</h2>

      {warningFewWords && !hasStory && (
        <p className="warning-text">{warningFewWords}</p>
      )}

      {error && <p className="error-text">{error}</p>}

      <div className="story-box">
        {hasStory ? (
          <pre className="story-text">{story}</pre>
        ) : (
          <p className="story-placeholder">{placeholder}</p>
        )}
      </div>
    </div>
  );
}
