// components/storybook/AlphabetPicker.js

import React from "react";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AlphabetPicker({ selectedLetter, onSelect }) {
  const handleClick = (letter) => {
    if (typeof onSelect === "function") {
      onSelect(letter);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "center",
        marginBottom: 24,
      }}
    >
      {ALPHABETS.map((letter) => {
        const isActive =
          (selectedLetter || "A").toUpperCase() === letter.toUpperCase();

        return (
          <button
            key={letter}
            type="button"
            onClick={() => handleClick(letter)}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 16,
              boxShadow: isActive
                ? "0 0 0 3px rgba(255, 153, 102, 0.7)"
                : "0 2px 6px rgba(0, 0, 0, 0.08)",
              backgroundColor: isActive ? "#ff914d" : "#fff7ef",
              color: isActive ? "#ffffff" : "#92562a",
              transition: "all 0.15s ease-out",
            }}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
