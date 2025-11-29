// components/storybook/WordCardsGrid.js
// STEP 1: 선택된 알파벳에 대한 단어 카드 6장 (3 x 2) 그리드

export default function WordCardsGrid({
  cards,
  isLoading,
  error,
  onSelectWord,
  emptyMessage,
}) {
  const safeCards = Array.isArray(cards) ? cards : [];

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="word-grid-empty">
        카드를 불러오는 중입니다...
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="word-grid-empty">
        단어 카드를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  // 데이터 없음
  if (safeCards.length === 0) {
    return (
      <div className="word-grid-empty">
        {emptyMessage || "아직 이 알파벳에는 카드가 없습니다."}
      </div>
    );
  }

  // 3x2 레이아웃을 위해 최대 6장만 사용
  const visibleCards = safeCards.slice(0, 6);

  return (
    <div className="word-grid">
      {visibleCards.map((card) => {
        if (!card) return null;

        const label =
          card.word || card.en || card.text || card.label || "Word";
        const imageUrl =
          card.imageUrl || card.imageURL || card.image || card.url || "";

        // SSR에서도 항상 동일하게 나오는 결정적 key
        const id = String(card.id || label);

        return (
          <button
            key={id}
            type="button"
            className="word-card"
            onClick={() => {
              if (typeof onSelectWord === "function") {
                onSelectWord(label);
              }
            }}
          >
            <div className="word-card-image-wrapper">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={label}
                  className="word-card-image"
                />
              ) : (
                <div className="word-card-image" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
