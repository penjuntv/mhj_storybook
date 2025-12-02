// components/coloring/Toolbar.js
// 지금은 "앞으로 넣을 기능"의 자리를 잡는 수준의 툴바
// 나중에: 장면별 캡처 저장, 되돌리기/다시하기, 선 두께 변경 등 추가 예정.

export default function Toolbar() {
  return (
    <div className="coloring-toolbar">
      <button
        type="button"
        className="secondary-button"
        onClick={() =>
          alert("나중에 '장면별 그림 저장하기' 기능이 여기에 들어갈 예정입니다.")
        }
      >
        그림 저장하기 (준비 중)
      </button>
    </div>
  );
}
