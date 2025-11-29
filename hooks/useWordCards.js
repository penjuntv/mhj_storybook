// hooks/useWordCards.js
import { useMemo } from "react";
import {
  WORD_CARDS,
  SUPABASE_WORD_IMAGES_BASE,
} from "../data/wordCards";

// 선택된 알파벳에 맞는 단어 카드 목록을 돌려주는 훅
export function useWordCards(selectedLetter) {
  const safeLetter =
    typeof selectedLetter === "string" && selectedLetter.length > 0
      ? selectedLetter.toUpperCase()
      : "A";

  const cards = useMemo(() => {
    const list = WORD_CARDS[safeLetter] || [];

    return list.map(({ id }) => {
      // id: "A_airplane" → word: "Airplane"
      const parts = id.split("_");
      const raw = parts[1] || parts[0];
      const word = raw.charAt(0).toUpperCase() + raw.slice(1);

      return {
        id,
        word,
        imageUrl: `${SUPABASE_WORD_IMAGES_BASE}/${safeLetter}/${id}.png`,
      };
    });
  }, [safeLetter]);

  // 지금은 Supabase 실시간 호출을 안 하므로 로딩/에러는 항상 false/null
  return {
    cards,
    isLoading: false,
    error: null,
  };
}
