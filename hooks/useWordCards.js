// hooks/useWordCards.js
import { useMemo } from "react";
import { WORD_CARDS } from "../data/wordCards";

// Supabase base URL (NEXT_PUBLIC_SUPABASE_URL)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

// "A_airplane" -> "Airplane"
function idToWord(id) {
  if (!id) return "";
  const raw = id.split("_").slice(1).join(" ");
  if (!raw) return "";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// public 이미지 URL 생성
// word-images/default_en/{letter}/{id}.png
function buildImageUrl(letter, id) {
  if (!SUPABASE_URL) return "";
  return `${SUPABASE_URL}/storage/v1/object/public/word-images/default_en/${letter}/${id}.png`;
}

/**
 * 알파벳 한 글자에 해당하는 카드 목록을 반환하는 훅
 * - Supabase JS 클라이언트로 list() 호출하지 않고
 *   data/wordCards.js에 있는 ID를 이용해 URL을 직접 만든다.
 * - WORD_CARDS 구조는 예전 코드와 동일하다고 가정
 *   (예: WORD_CARDS["A"] = [{ id: "A_airplane" }, ...])
 */
export default function useWordCards(letter) {
  const cards = useMemo(() => {
    const safeLetter = letter || "A";
    const list = (WORD_CARDS && WORD_CARDS[safeLetter]) || [];

    return list.map((item) => {
      // item 이 문자열이든 객체든 모두 지원
      const id = typeof item === "string" ? item : item.id;
      const word =
        typeof item === "object" && item.word
          ? item.word
          : idToWord(id);
      const imageUrl =
        typeof item === "object" && item.imageUrl
          ? item.imageUrl
          : buildImageUrl(safeLetter, id);

      return {
        id,
        word,
        imageUrl,
      };
    });
  }, [letter]);

  return {
    cards,
    isLoading: false,
    error: null,
  };
}
