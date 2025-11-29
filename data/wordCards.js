// data/wordCards.js

// Supabase 단어 카드 이미지 베이스 URL
// 예) https://xxxx.supabase.co/storage/v1/object/public/word-images/default_en/A/A_airplane.png
const SUPABASE_WORD_IMAGES_BASE =
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/word-images/default_en`;

// -------------------------------------------------------------
// 1) 알파벳 대표 이미지 (A.png, B.png ...)
//    필요하면 쓰고, 안 쓰면 그냥 둬도 무방
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
// 2) 단어 카드 데이터
//    - id 는 Supabase에 올라간 파일명(.png 제거)과 100% 동일해야 함
//    - useWordCards 훅에서 `${BASE}/${letter}/${id}.png` 형태로 사용
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

  B: [
    { id: "B_Ball" },
    { id: "B_Balloon" },
    { id: "B_Banana" },
    { id: "B_Bear" },
    { id: "B_Bee" },
    { id: "B_Book" },
  ],

  C: [
    { id: "C_Cake" },
    { id: "C_camera" },
    { id: "C_Car" },
    { id: "C_Cat" },
    { id: "C_Cloud" },
    { id: "C_Cup" },
  ],

  D: [
    { id: "D_Desk" },
    { id: "D_Dog" },
    { id: "D_Doll 2" }, // 파일명이 그대로 "D_Doll 2.png" 인 경우
    { id: "D_Dolphin" },
    { id: "D_Door" },
    { id: "D_Duck" },
  ],

  E: [
    { id: "E_Ear" },
    { id: "E_Earth" },
    { id: "E_Egg" },
    { id: "E_Eight" },
    { id: "E_Elephant" },
    { id: "E_Eye" },
  ],

  F: [
    { id: "F_Fire" },
    { id: "F_Fish" },
    { id: "F_Flower" },
    { id: "F_Foot" },
    { id: "F_Frog" },
    { id: "F_Fruit" },
  ],

  G: [
    { id: "G_Game" },
    { id: "G_Ghost" },
    { id: "G_Gift" },
    { id: "G_Giraffe" },
    { id: "G_Grape" },
    { id: "G_Guitar" },
  ],

  H: [
    { id: "H_Hat" },
    { id: "H_Heart" },
    { id: "H_Helicopter" },
    { id: "H_Horse" },
    { id: "H_House" },
    { id: "H_Hug" },
  ],

  I: [
    { id: "I_Ice" },
    { id: "I_Icecream" },
    { id: "I_idea" },
    { id: "I_Insect" },
    { id: "I_Iron" },
    { id: "I_Island" },
  ],

  J: [
    { id: "J_Jacket" },
    { id: "J_Jam" },
    { id: "J_Jar" },
    { id: "J_Jelly" },
    { id: "J_Juice" },
    { id: "J_Jump" },
  ],

  K: [
    { id: "K_Key" },
    { id: "K_King" },
    { id: "K_Kitchen" },
    { id: "K_Kite" },
    { id: "K_Kitten" },
    { id: "K_Knee" },
  ],

  L: [
    { id: "L_Leaf" },
    { id: "L_Lemon" },
    { id: "L_Letter" },
    { id: "L_Library" },
    { id: "L_Light" },
    { id: "L_Lion" },
  ],

  M: [
    { id: "M_Milk" },
    { id: "M_Monkey" },
    { id: "M_Moon" },
    { id: "M_Mountain" },
    { id: "M_Mouse" },
    { id: "M_Music" },
  ],

  N: [
    { id: "N_Night" },
    { id: "N_Nine" },
    { id: "N_No" },
    { id: "N_Nose" },
    { id: "N_Nurse" },
    { id: "N_nut" },
  ],

  O: [
    { id: "O_Octopus" },
    { id: "O_One" },
    { id: "O_Onion" },
    { id: "O_Orange" },
    { id: "O_Otter" },
    { id: "O_Owl" },
  ],

  P: [
    { id: "P_Panda" },
    { id: "P_Penguin" },
    { id: "P_Piano" },
    { id: "P_Pizza" },
    { id: "P_Pumpkin" },
    { id: "P_Purple" },
  ],

  Q: [
    { id: "Q_Queen" },
    { id: "Q_Question" },
    { id: "Q_Quiet" },
    { id: "Q_Quilt" },
    { id: "Q_Square" },
    { id: "Q_Squirrel" },
  ],

  R: [
    { id: "R_Rabbit" },
    { id: "R_Rainbow" },
    { id: "R_Ribbon" },
    { id: "R_Robot" },
    { id: "R_Rock" },
    { id: "R_Rocket" },
  ],

  S: [
    { id: "S_Shoe" },
    { id: "S_Smile" },
    { id: "S_Snake" },
    { id: "S_Spider" },
    { id: "S_Star" },
    { id: "S_Sun" },
  ],

  T: [
    { id: "T_Tomato" },
    { id: "T_Train" },
    { id: "T_Tree" },
    { id: "T_Truck" },
    { id: "T_Turtle" },
    { id: "T_two" },
  ],

  U: [
    { id: "U_UFO" },
    { id: "U_Umbrella" },
    { id: "U_Unicorn" },
    { id: "U_Uniform" },
    { id: "U_Universe" },
    { id: "U_Up" },
  ],

  V: [
    { id: "V_Vacuum" },
    { id: "V_Vegetable" },
    { id: "V_Video" },
    { id: "V_Village" },
    { id: "V_Violin" },
    { id: "V_Volcano" },
  ],

  W: [
    { id: "W_Water" },
    { id: "W_Whale" },
    { id: "W_Window" },
    { id: "W_Winter" },
    { id: "W_Witch" },
    { id: "W_Wolf" },
  ],

  X: [
    { id: "X_Box" },
    { id: "X_Fox" },
    { id: "X_Six" },
    { id: "X_X-mas" },
    { id: "X_X-ray" },
    { id: "X_Xylophone" },
  ],

  Y: [
    { id: "Y_Yacht" },
    { id: "Y_Yarn" },
    { id: "Y_Yawn" },
    { id: "Y_Yellow" },
    { id: "Y_Yogurt" },
    { id: "Y_Yoyo" },
  ],

  Z: [
    { id: "Z_Puzzle" },
    { id: "Z_Zebra" },
    { id: "Z_Zero" },
    { id: "Z_Zigzag" },
    { id: "Z_Zipper" },
    { id: "Z_Zoo" },
  ],
};
