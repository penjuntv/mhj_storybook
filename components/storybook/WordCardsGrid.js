// components/storybook/WordCardsGrid.js
import React from "react";

export default function WordCardsGrid({ cards, onCardClick }) {
  if (!cards || cards.length === 0) {
    return (
      <p className="word-grid-empty">
        아직 이 알파벳에는 카드가 없습니다.
      </p>
    );
  }

  return (
    <div className="word-grid">
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          className="word-card"
          onClick={() => onCardClick(card.word)}
        >
          <div className="word-card-image-wrapper">
            <img
              src={card.imageUrl}
              alt={card.word}
              className="word-card-image"
            />
          </div>
        </button>
      ))}
    </div>
  );
}
