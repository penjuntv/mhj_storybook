// components/coloring/Toolbar.js
// 아직 기능은 최소한으로 두고, 나중에 "페이지 저장 / 불러오기" 등을 붙이기 위한 자리만 마련.

export default function Toolbar() {
  return (
    <div className="coloring-toolbar">
      <button
        type="button"
        className="secondary-button"
        onClick={() => alert("나중에 '그림 저장하기' 기능을 여기에 붙일 예정입니다.")}
      >
        그림 저장하기 (준비 중)
      </button>
    </div>
  );
}
