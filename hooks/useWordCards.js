// hooks/useWordCards.js
// 알파벳별 단어카드 정보를 가져오는 공용 훅

import { useMemo } from "react";
import { WORD_CARDS } from "../data/wordCards";

// Supabase 스토리지 베이스 URL (이미 사용 중인 환경변수 그대로 사용)
const SUPABASE_WORD_IMAGES_BASE =
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/word-images/default_en`;

// 선택된 알파벳을 항상 대문자 A~Z 로 정규화
function normalizeLetter(letter) {
  if (typeof letter !== "string") return "A";
  const upper = letter.toUpperCase();
  return /[A-Z]/.test(upper) ? upper : "A";
}

// id("A_airplane" 등)로부터 표시용 단어와 이미지 URL 생성
function buildCard(letter, id) {
  // id: "A_airplane" → "airplane"
  const [, rawWord = id] = id.split("_");

  // 공백 기준으로 쪼개서 맨 앞글자만 대문자로
  const displayWord = rawWord
    .trim()
    .split(/\s+/)
    .map((part) =>
      part.length ? part[0].toUpperCase() + part.slice(1) : ""
    )
    .join(" ");

  return {
    id,
    word: displayWord,
    imageUrl: `${SUPABASE_WORD_IMAGES_BASE}/${letter}/${id}.png`,
  };
}

// ===== 메인 훅 =====
export function useWordCards(selectedLetter) {
  const letter = normalizeLetter(selectedLetter);

  const value = useMemo(() => {
    const rawList = WORD_CARDS[letter] || []; // [{ id: "A_airplane" }, ...]
    const cards = rawList.map((item) => buildCard(letter, item.id));
    return {
      cards,
      isLoading: false, // 현재는 Supabase 호출 없이 정적 데이터만 사용
      error: null,
    };
  }, [letter]);

  return value;
}

// pages/index.js 처럼 `import useWordCards from ...` 로 가져오는 코드도
// 작동하게 하기 위해 default export 추가
export default useWordCards;
