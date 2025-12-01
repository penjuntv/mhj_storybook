// components/coloring/Toolbar.js
// 향후 기능 확장을 위한 단순 툴바 뼈대

import React from "react";

export default function Toolbar({ onClear }) {
  return (
    <div className="coloring-toolbar">
      <button
        type="button"
        className="toolbar-button"
        onClick={onClear}
      >
        전체 지우기
      </button>
      {/* 필요하면 여기다 "저장하기", "되돌리기" 같은 버튼을 앞으로 추가 */}
    </div>
  );
}
