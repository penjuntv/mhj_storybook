// components/storybook/WordCardsGrid.js
import React from "react";

function WordCardsGrid({ letter, cards, isLoading, error, onCardClick }) {
  const title = `"${letter}" 로 시작하는 단어 카드`;

  if (error) {
    return (
      <section style={{ marginTop: 32 }}>
        <p style={styles.sectionTitle}>{title}</p>
        <p style={styles.messageText}>카드를 불러오는 중 오류가 발생했습니다.</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section style={{ marginTop: 32 }}>
        <p style={styles.sectionTitle}>{title}</p>
        <p style={styles.messageText}>카드를 불러오는 중입니다…</p>
      </section>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <section style={{ marginTop: 32 }}>
        <p style={styles.sectionTitle}>{title}</p>
        <p style={styles.messageText}>아직 이 알파벳에는 카드가 없습니다.</p>
      </section>
    );
  }

  return (
    <section style={{ marginTop: 32 }}>
      <p style={styles.sectionTitle}>{title}</p>
      <div style={styles.grid}>
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onCardClick && onCardClick(card.word)}
            style={styles.cardButton}
          >
            <div style={styles.imageWrapper}>
              <img
                src={card.imageUrl}
                alt={card.word}
                style={styles.image}
                loading="lazy"
              />
            </div>
            {/* 시각장애인용 숨김 텍스트 (카드에는 글씨 안 보이게 처리) */}
            <span style={styles.visuallyHidden}>{card.word}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

const styles = {
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#5B3C23",
    marginBottom: 16,
  },
  messageText: {
    fontSize: 15,
    color: "#8C6B4A",
  },
  // 3열 고정 그리드 – 카드 6개면 자연스럽게 3×2가 됨
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 24,
  },
  // 카드 전체 스타일
  cardButton: {
    border: "none",
    padding: 0,
    margin: 0,
    cursor: "pointer",
    backgroundColor: "#FFF7EC",
    borderRadius: 28,
    boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  // 이미지가 카드 안을 꽉 채우도록 래퍼 + 비율 고정
  imageWrapper: {
    width: "100%",
    aspectRatio: "4 / 3", // 카드 비율
    borderRadius: 28,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover", // 카드 내부 여백 최소화
  },
  visuallyHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
};

export default WordCardsGrid;
