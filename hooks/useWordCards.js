// hooks/useWordCards.js
// Supabase에 올려 둔 카드 이미지를 사용해서
// 선택된 알파벳에 해당하는 단어 카드 목록을 만들어 주는 커스텀 훅

import { useMemo } from "react";
import { WORD_CARDS } from "../data/wordCards";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// id: "A_airplane" -> "Airplane"
function idToWord(id) {
  if (!id) return "";
  const raw = id.split("_").slice(1).join(" "); // "airplane", "X-mas", "Doll 2" 등
  if (!raw) return "";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// Supabase public URL 생성
// 예: NEXT_PUBLIC_SUPABASE_URL/storage/v1/object/public/word-images/default_en/A/A_airplane.png
function buildImageUrl(letter, id) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return "";
  if (!letter || !id) return "";
  return `${baseUrl}/storage/v1/object/public/word-images/default_en/${letter}/${id}.png`;
}

/**
 * useWordCards
 * - selectedLetter: "A" ~ "Z"
 * - WORD_CARDS 데이터와 카드 id / imageUrl을 합쳐서 반환
 */
export default function useWordCards(selectedLetter) {
  const safeLetter = ALPHABETS.includes(selectedLetter) ? selectedLetter : "A";

  const cardsForLetter = useMemo(() => {
    const rawList = (WORD_CARDS && WORD_CARDS[safeLetter]) || [];

    return rawList.map((card) => {
      const id = card.id;
      const word = card.word || idToWord(id);
      const imageUrl = card.imageUrl || buildImageUrl(safeLetter, id);

      return { ...card, id, word, imageUrl };
    });
  }, [safeLetter]);

  return {
    cards: cardsForLetter,
    isLoading: false,
    error: null,
  };
}
