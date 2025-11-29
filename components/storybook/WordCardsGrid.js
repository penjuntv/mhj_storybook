// components/storybook/WordCardsGrid.js
// STEP 1: 선택된 알파벳에 대한 단어 카드 6장 (2행 × 3열) 보여주기

export default function WordCardsGrid({
  cards,
  isLoading,
  error,
  selectedWords,
  onCardClick,
}) {
  const safeCards = Array.isArray(cards) ? cards : [];
  const safeSelected = Array.isArray(selectedWords) ? selectedWords : [];

  if (isLoading) {
    return (
      <div className="wordcards-grid loading">
        <p>Loading cards…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wordcards-grid error">
        <p>단어 카드를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  if (safeCards.length === 0) {
    return (
      <div className="wordcards-grid empty">
        <p>아직 이 알파벳에는 카드가 없습니다.</p>
      </div>
    );
  }

  // 최대 6장까지만 사용 (2행 × 3열 레이아웃을 안정적으로 유지)
  const visibleCards = safeCards.slice(0, 6);

  return (
    <div className="wordcards-grid">
      {visibleCards.map((card) => {
        if (!card) return null;

        const id = card.id ?? card.word ?? card.en ?? String(Math.random());
        const label =
          card.word ||
          card.en ||
          card.text ||
          card.label ||
          "Word";
        const imageUrl =
          card.imageURL ||
          card.imageUrl ||
          card.image ||
          card.url ||
          "";

        // 이미 선택된 단어인지 여부 (필요하면 사용)
        const wordLower = String(label).toLowerCase();
        const alreadySelected = safeSelected.filter(Boolean).some((w) => {
          const wWord =
            typeof w === "string" ? w : w.word || w.en || "";
          return wWord.toLowerCase() === wordLower;
        });

        return (
          <button
            key={id}
            type="button"
            className={`wordcard ${alreadySelected ? "selected" : ""}`}
            onClick={() => {
              if (typeof onCardClick === "function") {
                onCardClick({ ...card, word: label });
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
