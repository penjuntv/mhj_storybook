// components/coloring/Toolbar.js
// 앞으로 '저장하기', '되돌리기', 'AI 선그림 불러오기' 등을 붙일 툴바의 뼈대

export default function Toolbar() {
  return (
    <div className="coloring-toolbar">
      <button type="button" className="toolbar-button" disabled>
        그림 저장하기 (준비 중)
      </button>
    </div>
  );
}
