// hooks/useWordCards.js
// Supabase에 올려 둔 단어 카드 데이터를 사용하는 커스텀 훅
// ✅ 경로 계산 X, wordCards.js에 이미 들어 있는 imageUrl만 그대로 사용

import { useMemo } from "react";
import { WORD_CARDS } from "../data/wordCards";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// "A_airplane" -> "Airplane"
function idToWord(id) {
  if (!id) return "";
  const raw = id.split("_").slice(1).join(" "); // "airplane", "X-mas", "Doll 2" 등
  if (!raw) return "";
  const cleaned = raw.replace(/\d+$/g, "").trim();
  const first = cleaned.charAt(0).toUpperCase();
  return first + cleaned.slice(1);
}

export default function useWordCards(selectedLetter) {
  const safeLetter = ALPHABETS.includes(selectedLetter) ? selectedLetter : "A";

  const cardsForLetter = useMemo(() => {
    const rawList = (WORD_CARDS && WORD_CARDS[safeLetter]) || [];

    return rawList.map((card) => {
      const id = card.id;
      const word =
        (card.word || card.label || card.name || idToWord(id || "")).trim();
      const imageUrl = card.imageUrl || card.imageURL || card.url || "";

      return {
        id,
        word,
        imageUrl,
      };
    });
  }, [safeLetter]);

  return {
    cards: cardsForLetter,
    isLoading: false,
    error: null,
  };
}
