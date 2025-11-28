// components/storybook/WordCardsGrid.js
import React from "react";

export default function WordCardsGrid({
  letter,
  cards,
  isLoading,
  error,
  t,
  onCardClick,
}) {
  const hasCards = cards && cards.length > 0;

  return (
    <section style={{ marginTop: "32px" }}>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 700,
          marginBottom: "16px",
          color: "#5b3b28",
        }}
      >
        {letter
          ? `"${letter}" ${t.cardsTitleSuffix || t.cardsTitle || "로 시작하는 단어 카드"}`
          : t.cardsTitle || "단어 카드"}
      </h3>

      {isLoading && (
        <p
          style={{
            fontSize: "15px",
            color: "#8b6b4a",
            margin: "8px 0 0",
          }}
        >
          {t.loadingCards || "카드를 불러오는 중입니다..."}
        </p>
      )}

      {error && (
        <p
          style={{
            fontSize: "14px",
            color: "#b03a3a",
            margin: "8px 0 0",
          }}
        >
          {t.cardError || "카드를 불러오는 중 오류가 발생했습니다."}
        </p>
      )}

      {!isLoading && !error && !hasCards && (
        <p
          style={{
            fontSize: "15px",
            color: "#8b6b4a",
            marginTop: "12px",
          }}
        >
          {t.noCardsForLetter ||
            "아직 이 알파벳에는 카드가 없습니다."}
        </p>
      )}

      {hasCards && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "24px",
            marginTop: "16px",
          }}
        >
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => onCardClick && onCardClick(card)}
              style={{
                cursor: "pointer",
                border: "none",
                padding: 0,
                background: "transparent",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4 / 3",
                  borderRadius: "24px",
                  overflow: "hidden",
                  backgroundColor: "#fff8f0",
                  boxShadow:
                    "0 8px 18px rgba(0, 0, 0, 0.06)",
                }}
              >
                <img
                  src={card.imageUrl}
                  alt={card.label}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // 여백 최소화
                  }}
                  loading="lazy"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
