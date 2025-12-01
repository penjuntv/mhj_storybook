// components/storybook/StoryResult.js
// STEP 2: 생성된 동화 보여주는 영역 + 색칠놀이로 넘어가는 버튼

import { useRouter } from "next/router";
import { saveStory } from "../../utils/storyStorage";

export default function StoryResult({ story, error, title }) {
  const router = useRouter();

  const hasStory = typeof story === "string" && story.trim().length > 0;
  const safeTitle = title || "AI가 만든 오늘의 영어 동화";
  const placeholder =
    "단어와 테마를 선택한 뒤, AI에게 동화를 요청해 보세요.";

  const handleColoringStart = () => {
    if (!hasStory) return;

    // 1) 현재 스토리를 localStorage에 저장
    saveStory({ story });

    // 2) 쿼리 없이 /coloring 으로 이동
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

      {/* 스토리가 있을 때만 색칠 놀이 버튼 노출 */}
      {hasStory && (
        <div className="story-actions">
          <button
            type="button"
            className="primary-button"
            onClick={handleColoringStart}
          >
            이 동화로 색칠 놀이 하기
          </button>
        </div>
      )}
    </div>
  );
}
