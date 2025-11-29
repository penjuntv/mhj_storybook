// components/storybook/AlphabetPicker.js
// 알파벳 버튼 선택 컴포넌트 (A ~ Z)

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AlphabetPicker({ selectedLetter, onChange }) {
  const safeSelected = LETTERS.includes(selectedLetter)
    ? selectedLetter
    : "A";

  return (
    <div className="alphabet-picker">
      {LETTERS.map((letter) => {
        const isActive = letter === safeSelected;
        return (
          <button
            key={letter}
            type="button"
            className={`alphabet-button ${isActive ? "active" : ""}`}
            onClick={() => {
              if (typeof onChange === "function") {
                onChange(letter);
              }
            }}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
