// hooks/useWordCards.js
// 선택된 알파벳에 해당하는 단어 카드 목록을 돌려주는 단순 훅
// 이미지 URL은 data/wordCards.js 안에 들어있는 값을 그대로 사용한다.

import { useMemo } from "react";
import { WORD_CARDS } from "../data/wordCards";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function useWordCards(selectedLetter) {
  // 잘못된 값이 들어와도 항상 안전하게 "A"로 fallback
  const safeLetter = ALPHABETS.includes(selectedLetter) ? selectedLetter : "A";

  const cardsForLetter = useMemo(() => {
    const list = WORD_CARDS && WORD_CARDS[safeLetter];
    return Array.isArray(list) ? list : [];
  }, [safeLetter]);

  return {
    cards: cardsForLetter,
    isLoading: false,
    error: null,
  };
}
