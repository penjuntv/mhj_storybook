// components/storybook/WordCardsGrid.js
import React from "react";

export default function WordCardsGrid({ cards, onCardClick, letter, noCardsText }) {
  if (!cards || cards.length === 0) {
    return (
      <div
        style={{
          padding: 24,
          borderRadius: 18,
          background: "#FFF4E6",
          fontSize: 14,
          color: "#8A6A46",
          marginTop: 16,
        }}
      >
        {noCardsText || "아직 이 알파벳에는 카드가 없습니다."}
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          marginBottom: 10,
          color: "#7A5A3A",
        }}
      >
        “{letter}” 로 시작하는 단어 카드
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onCardClick(card.word)}
            style={{
              border: "none",
              padding: 0,
              textAlign: "left",
              cursor: "pointer",
              background: "transparent",
            }}
          >
            <div
              style={{
                borderRadius: 24,
                background: "#FFFDF8",
                boxShadow: "0 14px 30px rgba(0,0,0,0.06)",
                padding: 18,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 240,
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  borderRadius: 18,
                  background: "#FFF4E8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  marginBottom: 12,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.imageUrl}
                  alt={card.word}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#3D2A1B",
                }}
              >
                {card.word}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
