// hooks/useWordCards.js
// Supabase에 올려 둔 단어 카드 데이터를 사용하는 커스텀 훅

import { useMemo } from "react";
import { WORD_CARDS } from "../data/wordCards";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/**
 * useWordCards
 * - selectedLetter: "A" ~ "Z"
 * - WORD_CARDS에서 해당 알파벳의 카드 목록만 꺼내서 반환
 * - 이미지 URL은 data/wordCards.js에 들어 있는 값을 그대로 사용
 */
function useWordCards(selectedLetter) {
  const safeLetter = ALPHABETS.includes(selectedLetter) ? selectedLetter : "A";

  const cardsForLetter = useMemo(() => {
    if (!WORD_CARDS) return [];
    const list = WORD_CARDS[safeLetter] || [];
    return list;
  }, [safeLetter]);

  return {
    cards: cardsForLetter,
    isLoading: false,
    error: null,
  };
}

// named + default 둘 다 내보내서
// pages/index.js 쪽에서 `import useWordCards from` 써도 에러가 안 나게 함
export { useWordCards };
export default useWordCards;
