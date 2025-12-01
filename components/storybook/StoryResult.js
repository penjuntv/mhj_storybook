// components/storybook/StoryResult.js
// STEP 2: 생성된 동화 보여주는 영역 + 색칠 페이지로 이동 + localStorage 저장

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function StoryResult({ story, error, title }) {
  const router = useRouter();

  // 스토리가 실제로 존재하는지 여부
  const hasStory = typeof story === "string" && story.trim().length > 0;

  const safeTitle = title || "AI가 만든 오늘의 영어 동화";
  const placeholder =
    "단어와 테마를 선택한 뒤, AI에게 동화를 요청해 보세요.";

  // 스토리가 생성될 때마다 localStorage에 저장
  useEffect(() => {
    if (!hasStory) return;
    if (typeof window === "undefined") return;

    try {
      const payload = {
        story: story.trim(),
        createdAt: new Date().toISOString(),
      };

      window.localStorage.setItem(
        "mhj_coloring_story_v1",
        JSON.stringify(payload)
      );
    } catch (e) {
      // localStorage 에러가 나더라도 앱 전체가 깨지지 않도록 조용히 처리
      // 필요하면 개발용 콘솔만 사용
      // eslint-disable-next-line no-console
      console.error("Failed to save story for coloring", e);
    }
  }, [hasStory, story]);

  // 색칠 페이지로 이동
  const handleGoColoring = () => {
    if (!hasStory) return;
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

      {/* 스토리가 정상적으로 있을 때만 색칠 버튼 노출 */}
      {hasStory && !error && (
        <div className="story-actions" style={{ marginTop: "16px" }}>
          <button
            type="button"
            className="primary-button"
            onClick={handleGoColoring}
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
              background: "#FF8C41",
              color: "#fff",
              boxShadow: "0 6px 14px rgba(0, 0, 0, 0.12)",
            }}
          >
            이 동화를 색칠 놀이 하기
          </button>
        </div>
      )}
    </div>
  );
}
