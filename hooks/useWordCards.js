// hooks/useWordCards.js
// 선택된 알파벳의 단어 카드 목록을 반환하는 훅
// data/wordCards.js 에서 카드 메타 정보를 가져오고,
// imageUrl 이 없으면 Supabase 경로로 직접 만들어서 채운다.

import { useMemo } from "react";
import { WORD_CARDS } from "../data/wordCards";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// id: "A_airplane" -> "Airplane"
function idToWord(id) {
  if (!id) return "";
  const raw = id.split("_").slice(1).join(" "); // "airplane", "X-mas" ...
  if (!raw) return "";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// Supabase 이미지 URL 생성
function buildImageUrl(letter, id) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl || !letter || !id) return "";

  // 예: https://.../storage/v1/object/public/word-images/default_en/A/A_airplane.png
  return `${baseUrl}/storage/v1/object/public/word-images/default_en/${letter}/${id}.png`;
}

export default function useWordCards(selectedLetter) {
  const upperLetter = (selectedLetter || "A").toString().toUpperCase();
  const safeLetter = ALPHABETS.includes(upperLetter) ? upperLetter : "A";

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
