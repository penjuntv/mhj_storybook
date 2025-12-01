// components/storybook/StoryResult.js
// STEP 2: 생성된 동화 보여주는 영역 + Step3로 넘겨주는 버튼

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

    // Step3에서 쓸 수 있도록 "마지막 동화"를 저장
    saveStory({ story });

    // 쿼리스트링 의존 없이 단순히 /coloring 으로 이동
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

      {/* 동화가 있을 때만 색칠 버튼 노출 */}
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
