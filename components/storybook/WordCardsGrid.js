// components/storybook/WordCardsGrid.js
// STEP 1: 선택된 알파벳에 대한 단어 카드 그리드

export default function WordCardsGrid({
  cards,
  isLoading,
  error,
  onSelectWord,
  emptyMessage,
}) {
  const safeCards = Array.isArray(cards) ? cards : [];

  if (isLoading) {
    return (
      <div className="wordcards-grid wordcards-grid-state">
        <p>카드를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wordcards-grid wordcards-grid-state">
        <p>단어 카드를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  if (safeCards.length === 0) {
    return (
      <div className="wordcards-grid wordcards-grid-state">
        <p>{emptyMessage || "아직 이 알파벳에는 카드가 없습니다."}</p>
      </div>
    );
  }

  const visibleCards = safeCards.slice(0, 6);

  return (
    <div className="wordcards-grid">
      {visibleCards.map((card) => {
        if (!card) return null;

        const id = card.id ?? card.word ?? card.en ?? Math.random().toString();
        const label =
          card.word || card.en || card.text || card.label || "Word";
        const imageUrl =
          card.imageUrl || card.imageURL || card.image || card.url || "";

        return (
          <button
            key={id}
            type="button"
            className="wordcard"
            onClick={() => {
              if (typeof onSelectWord === "function") {
                onSelectWord(label);
              }
            }}
          >
            <div className="wordcard-inner">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={label}
                  className="wordcard-image"
                />
              ) : (
                <div className="wordcard-image placeholder" />
              )}
              <div className="wordcard-label">{label}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
