// components/coloring/SceneSidebar.js
// 왼쪽 사이드바: 장면 리스트 + 간단한 안내

export default function SceneSidebar({
  scenes,
  selectedIndex,
  onSelectScene,
  fullStory,
}) {
  const safeScenes = Array.isArray(scenes) ? scenes : [];

  if (safeScenes.length === 0) {
    return (
      <aside className="coloring-sidebar">
        <h2 className="sidebar-title">장면 선택</h2>
        <p className="sidebar-helper">
          아직 장면을 나누지 못했어요. 동화 내용이 너무 짧거나, 문장이 적으면
          한 장면으로만 표시됩니다.
        </p>
      </aside>
    );
  }

  // 전체 동화 첫 문장을 간단 요약으로 사용
  const summary =
    typeof fullStory === "string"
      ? fullStory.split(/(?<=[.!?])\s+/)[0]
      : "";

  return (
    <aside className="coloring-sidebar">
      <h2 className="sidebar-title">장면 선택</h2>
      {summary && (
        <p className="sidebar-summary">오늘 동화: {summary}</p>
      )}

      <ul className="scene-list">
        {safeScenes.map((scene, index) => {
          const isActive = index === selectedIndex;
          const preview =
            typeof scene === "string"
              ? scene.length > 80
                ? scene.slice(0, 80) + "…"
                : scene
              : "";

          return (
            <li key={index} className="scene-list-item">
              <button
                type="button"
                className={
                  "scene-chip" + (isActive ? " scene-chip--active" : "")
                }
                onClick={() => onSelectScene(index)}
              >
                <span className="scene-chip-label">Scene {index + 1}</span>
                <span className="scene-chip-preview">{preview}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
