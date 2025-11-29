// hooks/useWordCards.js
// 선택된 알파벳의 단어 카드 목록을 반환하는 훅
// data/wordCards.js 에서 카드 메타 정보를 가져오고,
// 카드 객체에 들어 있는 imageUrl/imageURL/url 을 우선 사용한 뒤,
// 없을 때만 Supabase 경로를 만들어 쓴다.

import { useMemo } from "react";
import { WORD_CARDS } from "../data/wordCards";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// id: "A_airplane" -> "Airplane"
function idToWord(id) {
  if (!id) return "";
  const raw = id.split("_").slice(1).join(" ");
  if (!raw) return "";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// Supabase 이미지 URL 생성 (fallback 용)
function buildImageUrl(baseUrl, letter, id) {
  if (!baseUrl || !letter || !id) return "";
  // 예: https://.../storage/v1/object/public/word-images/default_en/A/A_airplane.png
  return `${baseUrl}/storage/v1/object/public/word-images/default_en/${letter}/${id}.png`;
}

export default function useWordCards(selectedLetter) {
  const upperLetter = (selectedLetter || "A").toString().toUpperCase();
  const safeLetter = ALPHABETS.includes(upperLetter) ? upperLetter : "A";

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const cardsForLetter = useMemo(() => {
    const rawList = (WORD_CARDS && WORD_CARDS[safeLetter]) || [];
    if (!Array.isArray(rawList)) return [];

    return rawList
      .filter(Boolean)
      .map((card) => {
        const id = card.id || card.slug || card.key || null;
        const word = card.word || card.en || idToWord(id);

        // 기존 데이터에 들어 있던 이미지 경로를 최우선으로 사용
        const existingUrl =
          card.imageUrl ||
          card.imageURL || // 예전 필드명 호환
          card.url ||
          card.image ||
          "";

        const imageUrl =
          existingUrl ||
          (baseUrl && id ? buildImageUrl(baseUrl, safeLetter, id) : "");

        return {
          ...card,
          id: id || word,
          word,
          imageUrl,
        };
      });
  }, [safeLetter, baseUrl]);

  return {
    letter: safeLetter,
    cards: cardsForLetter,
    isLoading: false,
    error: null,
  };
}
