// hooks/useWordCards.js
// STEP 1 카드에서 쓸 단어 카드 목록을 만드는 훅

import { useMemo } from "react";
import { WORD_CARDS } from "../data/wordCards";

// Supabase 이미지 베이스 URL
const SUPABASE_WORD_IMAGES_BASE =
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/word-images/default_en`;

export function useWordCards(selectedLetter) {
  // 1. 안전한 알파벳 하나로 정규화 (A~Z가 아니면 A로)
  const letter = useMemo(() => {
    const upper =
      typeof selectedLetter === "string"
        ? selectedLetter.toUpperCase()
        : "A";

    return /^[A-Z]$/.test(upper) ? upper : "A";
  }, [selectedLetter]);

  // 2. 해당 알파벳의 카드 정의 가져와서 화면에서 쓸 객체로 변환
  const cards = useMemo(() => {
    const defs = WORD_CARDS[letter] || [];

    return defs.map((def) => {
      const rawId = def.id || "";
      const explicitWord = def.word;

      // 표시용 단어 (이미지 파일명에서 앞의 'A_' 이런 접두사, 언더바 제거)
      const word =
        explicitWord ||
        rawId
          .replace(/^[A-Za-z]_?/, "") // 맨 앞 글자 + '_' 제거
          .replace(/_/g, " ")        // 언더바 → 공백
          .replace(/\b\w/g, (ch) => ch.toUpperCase()); // 단어별 첫 글자 대문자

      // 실제 파일명으로 쓸 id (Supabase에 올라간 png 파일 이름과 동일해야 함)
      const fileId = rawId;

      const imageUrl = `${SUPABASE_WORD_IMAGES_BASE}/${letter}/${fileId}.png`;

      return {
        id: fileId,
        word,
        imageUrl,
      };
    });
  }, [letter]);

  // 이 훅은 현재 비동기 통신이 없으니 로딩/에러는 항상 false/null
  return {
    letter,
    cards,
    isLoading: false,
    error: null,
  };
}
