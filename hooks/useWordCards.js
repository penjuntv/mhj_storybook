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
  const parts = String(id).split("_").slice(1);
  if (!parts.length) return "";
  const raw = parts.join(" ");
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// "E_ear" 같은 형태가 word 에 들어온 경우도 정리
function cleanupWord(letter, rawWord, rawId) {
  let word = rawWord;

  if (!word && rawId) {
    word = idToWord(rawId);
  }

  // "E_ear" 처럼 알파벳 + "_" 로 시작하면 뒷부분만 단어로 사용
  if (word && /^[A-Z]_/.test(word)) {
    const parts = String(word).split("_").slice(1);
    const base = parts.join(" ");
    if (base) {
      word = base.charAt(0).toUpperCase() + base.slice(1);
    }
  }

  return word || "";
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
      const rawId = card.id || card.imageId || null;

      let id = rawId;
      let word = cleanupWord(safeLetter, card.word, rawId);

      // id 가 없고 word 만 있을 때: LETTER_word 형태로 id 만들어 주기
      if (!id && word) {
        const slug = word.toLowerCase().replace(/\s+/g, "");
        id = `${safeLetter}_${slug}`;
      }

      const imageUrl =
        card.imageUrl || card.imageURL || buildImageUrl(safeLetter, id);

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
