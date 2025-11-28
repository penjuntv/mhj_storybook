// components/storybook/WordCardsGrid.js
// STEP 1용 2×3 단어 카드 그리드 (큰 그림 카드)
// 카드 이미지는 Supabase에서 직접 불러오며, 각 카드 클릭 시 단어를 상위로 전달.

import React from "react";

export default function WordCardsGrid({ cards, selectedWords, onCardClick }) {
  const isSelected = (word) =>
    selectedWords.some((w) => w.word.toLowerCase() === word.toLowerCase());

  if (!cards || cards.length === 0) {
    return (
      <p className="empty">
        아직 이 알파벳에는 카드가 없습니다.
        <style jsx>{`
          .empty {
            margin-top: 32px;
            font-size: 0.95rem;
            color: #9a7b63;
          }
        `}</style>
      </p>
    );
  }

  return (
    <>
      <div className="grid">
        {cards.slice(0, 6).map((card) => (
          <button
            key={card.id || card.word}
            type="button"
            className={`card ${isSelected(card.word) ? "card--selected" : ""}`}
            onClick={() => onCardClick(card.word)}
          >
            <div className="card-image-wrap">
              {card.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.imageUrl}
                  alt={card.word}
                  className="card-image"
                />
              )}
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .grid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .card {
          border: none;
          background: #fbe4c6;
          border-radius: 28px;
          padding: 16px;
          cursor: pointer;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.09);
          transition: transform 0.12s ease-out, box-shadow 0.12s ease-out,
            box-shadow 0.12s ease-out;
        }

        .card-image-wrap {
          position: relative;
          width: 100%;
          padding-top: 100%; /* 정사각형 */
          border-radius: 24px;
          overflow: hidden;
          background: #fff8ec;
        }

        .card-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .card--selected {
          box-shadow: 0 0 0 4px rgba(255, 153, 102, 0.9),
            0 16px 34px rgba(0, 0, 0, 0.14);
          transform: translateY(-4px);
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
      `}</style>
    </>
  );
}
