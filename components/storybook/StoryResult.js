// components/storybook/StoryResult.js
// STEP 2: 생성된 동화 보여주는 영역 + 색칠 놀이로 보내는 버튼

import { useEffect } from "react";
import { useRouter } from "next/router";
import { saveLastStoryToStorage } from "../../lib/storyStorage";

export default function StoryResult({ story, error, title }) {
  const router = useRouter();

  const hasStory = typeof story === "string" && story.trim().length > 0;

  const safeTitle = title || "AI가 만든 오늘의 영어 동화";
  const placeholder =
    "단어와 테마를 선택한 뒤, AI에게 동화를 요청해 보세요.";

  // 동화 내용이 바뀔 때마다 자동으로 localStorage에 저장
  useEffect(() => {
    if (!hasStory) return;
    console.log(
      "[StoryResult] auto-save story to localStorage, length:",
      story.length
    );
    saveLastStoryToStorage(story);
  }, [hasStory, story]);

  const handleGoToColoring = () => {
    if (!hasStory) {
      console.log("[StoryResult] No story, ignore coloring click");
      return;
    }

    console.log(
      "[StoryResult] Coloring button clicked, story length:",
      story.length
    );

    // 안전하게 한 번 더 저장
    saveLastStoryToStorage(story);

    // 색칠 놀이 페이지로 이동
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
