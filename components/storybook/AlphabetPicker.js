// components/storybook/AlphabetPicker.js
// 알파벳 버튼 선택 컴포넌트 (A ~ Z, 13개씩 2줄)

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AlphabetPicker({
  selectedLetter,
  onSelectLetter,
  onChange, // 옛 코드 호환
}) {
  const safeSelected = LETTERS.includes(selectedLetter)
    ? selectedLetter
    : "A";

  const handleClick = (letter) => {
    if (typeof onSelectLetter === "function") {
      onSelectLetter(letter);
    } else if (typeof onChange === "function") {
      // 이전 버전 호환용
      onChange(letter);
    }
  };

  const firstRow = LETTERS.slice(0, 13); // A ~ M
  const secondRow = LETTERS.slice(13);   // N ~ Z

  const renderRow = (rowLetters) => (
    <div className="alphabet-row">
      {rowLetters.map((letter) => {
        const isActive = letter === safeSelected;
        return (
          <button
            key={letter}
            type="button"
            className={`alphabet-button ${
              isActive ? "active" : ""
            }`}
            onClick={() => handleClick(letter)}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="alphabet-picker">
      {renderRow(firstRow)}
      {renderRow(secondRow)}
    </div>
  );
}
