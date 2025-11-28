// components/storybook/WordCardsGrid.js
import Image from "next/image";

/**
 * 단어 카드 그리드
 * - cards: [{ id, word, imageUrl, ... }]
 * - onCardClick: 카드 클릭 시 콜백
 */
export default function WordCardsGrid({ cards, onCardClick }) {
  if (!cards || cards.length === 0) {
    return (
      <p className="no-cards">
        아직 이 알파벳에는 카드가 없습니다.
      </p>
    );
  }

  return (
    <>
      <div className="cards-grid">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className="card"
            onClick={() => onCardClick && onCardClick(card)}
          >
            <div className="card-inner">
              {card.imageUrl ? (
                <div className="image-wrap">
                  <Image
                    src={card.imageUrl}
                    alt={card.word}
                    fill
                    sizes="(min-width: 1200px) 260px, (min-width: 768px) 33vw, 80vw"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ) : (
                <div className="image-fallback">
                  {card.word}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 32px;
          margin-top: 32px;
        }

        /* 태블릿 이하에서는 2열, 모바일에서는 1열 */
        @media (max-width: 960px) {
          .cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .card {
          border: none;
          padding: 0;
          background: transparent;
          cursor: pointer;
        }

        .card-inner {
          position: relative;
          border-radius: 32px;
          background: #ffe9c9;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.06);
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;

          /* 이전보다 약 15% 축소 + 가운데 정렬 */
          max-width: 280px;
          margin: 0 auto;
        }

        .image-wrap {
          position: relative;
          width: 100%;
          padding-top: 100%; /* 1:1 비율 */
        }

        .image-fallback {
          font-size: 20px;
          font-weight: 600;
          color: #5b3a16;
        }

        .no-cards {
          padding: 40px 0;
          font-size: 16px;
          color: #8a5b3a;
        }
      `}</style>
    </>
  );
}
