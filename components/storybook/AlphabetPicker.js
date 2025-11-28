// components/storybook/AlphabetPicker.js
import React from "react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AlphabetPicker({ selectedLetter, onSelect }) {
  const row1 = LETTERS.slice(0, 13); // A–M
  const row2 = LETTERS.slice(13); // N–Z

  const baseButtonStyle = {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "0",
    margin: 4,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
    background: "#FFF8F0",
    color: "#7a4c25",
  };

  const activeStyle = {
    background: "#FF8C41",
    color: "#fff",
    boxShadow: "0 0 0 3px rgba(0,0,0,0.06)",
  };

  const renderRow = (rowLetters) => (
    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
      {rowLetters.map((ch) => {
        const active = selectedLetter === ch;
        return (
          <button
            key={ch}
            type="button"
            onClick={() => onSelect(ch)}
            style={active ? { ...baseButtonStyle, ...activeStyle } : baseButtonStyle}
          >
            {ch}
          </button>
        );
      })}
    </div>
  );

  return (
    <div>
      {renderRow(row1)}
      {renderRow(row2)}
    </div>
  );
}
