// data/wordCards.js
// Supabase 이미지 베이스 URL
const SUPABASE_WORD_IMAGES_BASE =
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/word-images/default_en`;

// -------------------------------------------------------------
// 1) 알파벳 이미지 (A.png, B.png...)
// -------------------------------------------------------------
export const LETTER_IMAGES = {
  A: `${SUPABASE_WORD_IMAGES_BASE}/A/A.png`,
  B: `${SUPABASE_WORD_IMAGES_BASE}/B/B.png`,
  C: `${SUPABASE_WORD_IMAGES_BASE}/C/C.png`,
  D: `${SUPABASE_WORD_IMAGES_BASE}/D/D.png`,
  E: `${SUPABASE_WORD_IMAGES_BASE}/E/E.png`,
  F: `${SUPABASE_WORD_IMAGES_BASE}/F/F.png`,
  G: `${SUPABASE_WORD_IMAGES_BASE}/G/G.png`,
  H: `${SUPABASE_WORD_IMAGES_BASE}/H/H.png`,
  I: `${SUPABASE_WORD_IMAGES_BASE}/I/I.png`,
  J: `${SUPABASE_WORD_IMAGES_BASE}/J/J.png`,
  K: `${SUPABASE_WORD_IMAGES_BASE}/K/K.png`,
  L: `${SUPABASE_WORD_IMAGES_BASE}/L/L.png`,
  M: `${SUPABASE_WORD_IMAGES_BASE}/M/M.png`,
  N: `${SUPABASE_WORD_IMAGES_BASE}/N/N.png`,
  O: `${SUPABASE_WORD_IMAGES_BASE}/O/O.png`,
  P: `${SUPABASE_WORD_IMAGES_BASE}/P/P.png`,
  Q: `${SUPABASE_WORD_IMAGES_BASE}/Q/Q.png`,
  R: `${SUPABASE_WORD_IMAGES_BASE}/R/R.png`,
  S: `${SUPABASE_WORD_IMAGES_BASE}/S/S.png`,
  T: `${SUPABASE_WORD_IMAGES_BASE}/T/T.png`,
  U: `${SUPABASE_WORD_IMAGES_BASE}/U/U.png`,
  V: `${SUPABASE_WORD_IMAGES_BASE}/V/V.png`,
  W: `${SUPABASE_WORD_IMAGES_BASE}/W/W.png`,
  X: `${SUPABASE_WORD_IMAGES_BASE}/X/X.png`,
  Y: `${SUPABASE_WORD_IMAGES_BASE}/Y/Y.png`,
  Z: `${SUPABASE_WORD_IMAGES_BASE}/Z/Z.png`,
};

// -------------------------------------------------------------
// 2) 단어 카드 데이터 (Supabase 파일명과 반드시 1:1 매칭)
// -------------------------------------------------------------
export const WORD_CARDS = {
  A: [
    { id: "A_airplane" },
    { id: "A_Alligator" },
    { id: "A_angry" },
    { id: "A_ant" },
    { id: "A_apple" },
    { id: "A_Astronaut" },
  ],

  E: [
    { id: "E_ear" },
    { id: "E_earth" },
    { id: "E_egg" },
    { id: "E_eight" },
    { id: "E_elephant" },
    { id: "E_eye" },
  ],

  G: [
    { id: "G_game" },
    { id: "G_ghost" },
    { id: "G_gift" },
    { id: "G_giraffe" },
    { id: "G_grape" },
    { id: "G_guitar" },
  ],

  // 필요한 나머지 알파벳도 계속 같은 방식으로 채우면 됨
};
