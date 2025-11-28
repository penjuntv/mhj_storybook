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
// 예: {NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/word-images/default_en/A/A_airplane.png
function buildImageUrl(letter, id) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return "";
  return `${baseUrl}/storage/v1/object/public/word-images/default_en/${letter}/${id}.png`;
}

/**
 * useWordCards
 * - selectedLetter: "A" ~ "Z"
 * - Supabase에 올려 둔 카드 이미지 경로 규칙을 이용해 imageUrl을 만들어 줌
 * - WORD_CARDS 데이터가 가지고 있는 id / imageUrl도 함께 활용
 */
export function useWordCards(selectedLetter) {
  const safeLetter = ALPHABETS.includes(selectedLetter)
    ? selectedLetter
    : "A";

  const cardsForLetter = useMemo(() => {
    const list = WORD_CARDS[safeLetter] || [];

    return list.map((card) => {
      // WORD_CARDS 안에 word가 없더라도 id에서 자동 생성
      const word = card.word || idToWord(card.id);

      // WORD_CARDS에 imageUrl이 명시돼 있으면 우선 사용,
      // 없으면 Supabase 경로 규칙으로 생성
      const imageUrl = card.imageUrl || buildImageUrl(safeLetter, card.id);

      return {
        ...card,
        letter: safeLetter,
        word,
        imageUrl,
      };
    });
  }, [safeLetter]);

  return { cardsForLetter, letter: safeLetter };
}
