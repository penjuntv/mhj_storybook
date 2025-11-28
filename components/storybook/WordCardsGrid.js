// components/storybook/WordCardsGrid.js
// STEP 1 단어 카드 격자 (2행 × 3열, 총 6장)

import React from "react";

export default function WordCardsGrid({ cards, onCardClick }) {
  const visibleCards = (cards || []).slice(0, 6);

  if (!visibleCards.length) {
    return (
      <p
        style={{
          marginTop: 24,
          fontSize: 16,
          color: "#8b6a4d",
        }}
      >
        아직 이 알파벳에는 카드가 없습니다.
      </p>
    );
  }

  return (
    <div
      style={{
        marginTop: 32,
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 24,
      }}
    >
      {visibleCards.map((card) => (
        <button
          key={card.id}
          type="button"
          onClick={() => onCardClick && onCardClick(card.word)}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              borderRadius: 32,
              backgroundColor: "#ffe7c6",
              boxShadow: "0 14px 30px rgba(214, 150, 90, 0.24)",
              padding: 18, // 15% 정도 줄인 느낌
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={card.imageUrl}
              alt={card.word}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: 24,
              }}
            />
          </div>
        </button>
      ))}
    </div>
  );
}
