// components/coloring/SceneSidebar.js
// 왼쪽 사이드바: 장면 리스트 + 썸네일 + 간단한 안내

export default function SceneSidebar({
  scenes,
  templates,
  selectedIndex,
  onSelectScene,
  fullStory,
  childName,
  locale,
}) {
  const safeScenes = Array.isArray(scenes) ? scenes : [];
  const safeTemplates = Array.isArray(templates) ? templates : [];

  // 전체 동화 첫 문장을 간단 요약으로 사용
  const summary =
    typeof fullStory === "string"
      ? fullStory.split(/(?<=[.!?])\s+/)[0]
      : "";

  // 장면/템플릿 둘 다 없으면 단순 안내만
  if (safeScenes.length === 0 && safeTemplates.length === 0) {
    return (
      <aside className="coloring-sidebar">
        <h2 className="sidebar-title">장면 선택</h2>
        <p className="sidebar-helper">
          아직 장면을 나누지 못했어요. 동화 내용이 너무 짧거나 문장이 적으면
          한 장면만 표시될 수 있습니다.
        </p>
      </aside>
    );
  }

  // 실제로 렌더링할 항목 수 (장면/템플릿 중 더 큰 쪽 기준)
  const itemCount = Math.max(safeScenes.length, safeTemplates.length);

  return (
    <aside className="coloring-sidebar">
      <h2 className="sidebar-title">장면 선택</h2>
      {summary && (
        <p className="sidebar-summary">오늘 동화: {summary}</p>
      )}
      {childName && (
        <p className="sidebar-summary">
          주인공 이름: <strong>{childName}</strong>
        </p>
      )}

      <ul className="scene-list">
        {Array.from({ length: itemCount }).map((_, index) => {
          const isActive = index === selectedIndex;
          const sceneText =
            typeof safeScenes[index] === "string"
              ? safeScenes[index]
              : "";
          const preview =
            sceneText.length > 80
              ? sceneText.slice(0, 80) + "…"
              : sceneText;

          const template = safeTemplates[index] || null;
          const thumbSrc = template?.imageSrc || null;
          const thumbTitle =
            template?.title || `Scene ${index + 1}`;

          return (
            <li key={index} className="scene-list-item">
              <button
                type="button"
                className={
                  "scene-chip" + (isActive ? " scene-chip--active" : "")
                }
                onClick={() => onSelectScene?.(index)}
              >
                {/* 썸네일 영역 */}
                {thumbSrc && (
                  <div className="scene-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbSrc}
                      alt={thumbTitle}
                      className="scene-thumb-image"
                    />
                  </div>
                )}

                {/* 텍스트 영역 */}
                <div className="scene-chip-text">
                  <span className="scene-chip-label">
                    Scene {index + 1}
                  </span>
                  {preview && (
                    <span className="scene-chip-preview">
                      {preview}
                    </span>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
