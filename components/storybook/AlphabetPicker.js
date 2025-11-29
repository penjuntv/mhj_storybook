// components/storybook/AlphabetPicker.js
// 알파벳 버튼 선택 컴포넌트 (A ~ Z)
// props: selectedLetter, onSelectLetter (pages/index.js 에서 이미 사용 중인 이름 유지)

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AlphabetPicker({ selectedLetter, onSelectLetter }) {
  const upperSelected = (selectedLetter || "A").toString().toUpperCase();
  const activeLetter = LETTERS.includes(upperSelected) ? upperSelected : "A";

  const handleClick = (letter) => {
    if (typeof onSelectLetter === "function") {
      onSelectLetter(letter);
    }
  };

  return (
    <div className="alphabet-picker">
      {LETTERS.map((letter) => {
        const isActive = letter === activeLetter;
        return (
          <button
            key={letter}
            type="button"
            className={`alphabet-button${isActive ? " active" : ""}`}
            onClick={() => handleClick(letter)}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
