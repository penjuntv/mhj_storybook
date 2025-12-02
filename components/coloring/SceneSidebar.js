// components/coloring/SceneSidebar.js
// 왼쪽 장면 선택 영역
// - scenes: 문자열 배열 (각 장면 텍스트)
// - selectedIndex: 현재 선택된 장면 인덱스
// - onSelectScene: 인덱스를 인자로 받는 콜백
// - fullStory: 전체 동화 (프리뷰용)

export default function SceneSidebar({
  scenes,
  selectedIndex = 0,
  onSelectScene,
  fullStory = "",
}) {
  const safeScenes = Array.isArray(scenes) ? scenes : [];

  // 스토리 프리뷰 (처음 2~3문장만 짧게)
  const preview =
    typeof fullStory === "string"
      ? fullStory.split("\n").slice(0, 2).join(" ").slice(0, 250)
      : "";

  return (
    <aside className="coloring-sidebar">
      <h2 className="sidebar-title">장면 선택</h2>
      <p className="sidebar-helper">
        전체 동화를 3~6개의 장면으로 나눠 두었습니다. 아이와 함께 장면을
        고르고, 오른쪽 캔버스에 그 장면을 그려 보세요.
      </p>

      <div className="story-preview-box">
        <p className="story-preview-label">오늘 만든 동화</p>
        <p className="story-preview-text">
          {preview ? `${preview}...` : "동화 프리뷰를 불러오지 못했습니다."}
        </p>
      </div>

      <div className="scene-list">
        {safeScenes.length === 0 && (
          <p className="scene-list-empty">
            장면을 만들 수 없습니다. 동화 내용을 다시 확인해 주세요.
          </p>
        )}

        {safeScenes.map((sceneText, index) => {
          const isActive = index === selectedIndex;
          const shortText = sceneText.replace(/\s+/g, " ").slice(0, 80);

          return (
            <button
              key={`scene-${index}`}
              type="button"
              className={`scene-item ${isActive ? "scene-item--active" : ""}`}
              onClick={() => onSelectScene?.(index)}
            >
              <div className="scene-item-header">
                <span className="scene-index">Scene {index + 1}</span>
              </div>
              <p className="scene-item-text">{shortText}...</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
