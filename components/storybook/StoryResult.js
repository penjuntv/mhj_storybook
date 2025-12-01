// components/storybook/StoryResult.js
// STEP 2: 생성된 동화 보여주는 영역 + 색칠 놀이로 보내는 버튼

import { useRouter } from "next/router";
import { saveLastStoryToStorage } from "../../lib/storyStorage";

export default function StoryResult({ story, error, title }) {
  const router = useRouter();

  const hasStory = typeof story === "string" && story.trim().length > 0;

  const safeTitle = title || "AI가 만든 오늘의 영어 동화";
  const placeholder =
    "단어와 테마를 선택한 뒤, AI에게 동화를 요청해 보세요.";

  const handleGoToColoring = () => {
    if (!hasStory) return;

    // 1) 로컬스토리지에 마지막 동화 저장
    saveLastStoryToStorage(story);

    // 2) 색칠 놀이 페이지로 이동
    router.push("/coloring");
  };

  return (
    <div className="story-result">
      <h2 className="section-title">{safeTitle}</h2>

      {error && <p className="error-text">{error}</p>}

      <div className="story-box">
        {hasStory ? (
          <pre className="story-text">{story}</pre>
        ) : (
          <p className="story-placeholder">{placeholder}</p>
        )}
      </div>

      {/* 동화가 있을 때만 색칠 놀이 버튼 활성화 */}
      <div className="story-actions">
        <button
          type="button"
          className={`primary-button ${
            hasStory ? "" : "primary-button--disabled"
          }`}
          onClick={handleGoToColoring}
          disabled={!hasStory}
        >
          이 동화로 색칠 놀이 하기
        </button>
      </div>
    </div>
  );
}
