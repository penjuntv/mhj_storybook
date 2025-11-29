// hooks/useWordCards.js
// 선택된 알파벳의 단어 카드 목록을 반환하는 훅
// data/wordCards.js 에 정의된 원본 데이터를 최대한 그대로 사용하면서,
// id / word / imageUrl 정도만 안전하게 보정한다.

import { useMemo } from "react";
import { WORD_CARDS } from "../data/wordCards";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function useWordCards(selectedLetter) {
  const upperLetter = (selectedLetter || "A").toString().toUpperCase();
  const safeLetter = ALPHABETS.includes(upperLetter) ? upperLetter : "A";

  const cardsForLetter = useMemo(() => {
    const rawList = WORD_CARDS?.[safeLetter];

    if (!Array.isArray(rawList)) return [];

    return rawList
      .filter(Boolean)
      .map((card, idx) => {
        const id =
          card.id ??
          card.word ??
          card.en ??
          `${safeLetter}_${idx}_${Math.random().toString(36).slice(2, 8)}`;

        const word =
          card.word || card.en || card.label || card.text || String(id);

        // 데이터에 있을 수 있는 모든 이미지 필드 + 마지막에 Supabase URL fallback
        const baseImage =
          card.imageURL || card.imageUrl || card.image || card.url || "";

        let imageUrl = baseImage;
        if (!imageUrl && process.env.NEXT_PUBLIC_SUPABASE_URL) {
          const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          imageUrl = `${baseUrl}/storage/v1/object/public/word-images/default_en/${safeLetter}/${id}.png`;
        }

        return {
          ...card,
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
