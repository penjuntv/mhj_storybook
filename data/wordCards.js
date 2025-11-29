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
// 2) 단어 카드 데이터
//    - id 값은 Supabase 파일명(확장자 제외)과 1:1로 맞아야 한다.
//    - 예: id: "A_airplane" → default_en/A/A_airplane.png
// -------------------------------------------------------------
export const WORD_CARDS = {
  A: [
    { id: "A_airplane" },
    { id: "A_alligator" }, // 기존 A_Alligator 였다면 파일명도 소문자 기준으로 맞춰 주는 걸 추천
    { id: "A_angry" },
    { id: "A_ant" },
    { id: "A_apple" },
    { id: "A_astronaut" },
  ],

  B: [
    { id: "B_ball" },
    { id: "B_banana" },
    { id: "B_bear" },
    { id: "B_bus" },
    { id: "B_bird" },
    { id: "B_book" },
  ],

  C: [
    { id: "C_cat" },
    { id: "C_cake" },
    { id: "C_car" },
    { id: "C_cloud" },
    { id: "C_crab" },
    { id: "C_crown" },
  ],

  D: [
    { id: "D_dog" },
    { id: "D_duck" },
    { id: "D_doll" },
    { id: "D_door" },
    { id: "D_drum" },
    { id: "D_dinosaur" },
  ],

  E: [
    { id: "E_ear" },
    { id: "E_earth" },
    { id: "E_egg" },
    { id: "E_eight" },
    { id: "E_elephant" },
    { id: "E_eye" },
  ],

  F: [
    { id: "F_fish" },
    { id: "F_fire" },
    { id: "F_flower" },
    { id: "F_frog" },
    { id: "F_fork" },
    { id: "F_fox" },
  ],

  G: [
    { id: "G_game" },
    { id: "G_ghost" },
    { id: "G_gift" },
    { id: "G_giraffe" },
    { id: "G_grape" },
    { id: "G_guitar" },
  ],

  H: [
    { id: "H_hand" },
    { id: "H_hat" },
    { id: "H_heart" },
    { id: "H_hippo" },
    { id: "H_house" },
    { id: "H_horse" },
  ],

  I: [
    { id: "I_icecream" },
    { id: "I_igloo" },
    { id: "I_insect" },
    { id: "I_island" },
    { id: "I_iron" },
    { id: "I_ice" },
  ],

  J: [
    { id: "J_jelly" },
    { id: "J_jellyfish" },
    { id: "J_juice" },
    { id: "J_jam" },
    { id: "J_jacket" },
    { id: "J_jet" },
  ],

  K: [
    { id: "K_kangaroo" },
    { id: "K_key" },
    { id: "K_king" },
    { id: "K_kite" },
    { id: "K_koala" },
    { id: "K_kitchen" },
  ],

  L: [
    { id: "L_lamp" },
    { id: "L_leaf" },
    { id: "L_lemon" },
    { id: "L_lion" },
    { id: "L_lollipop" },
    { id: "L_log" },
  ],

  M: [
    { id: "M_map" },
    { id: "M_milk" },
    { id: "M_monkey" },
    { id: "M_moon" },
    { id: "M_mouse" },
    { id: "M_mountain" },
  ],

  N: [
    { id: "N_nail" },
    { id: "N_nest" },
    { id: "N_nine" },
    { id: "N_nose" },
    { id: "N_notebook" },
    { id: "N_nut" },
  ],

  O: [
    { id: "O_octopus" },
    { id: "O_office" },
    { id: "O_onion" },
    { id: "O_orange" },
    { id: "O_owl" },
    { id: "O_oven" },
  ],

  P: [
    { id: "P_panda" },
    { id: "P_pants" },
    { id: "P_pencil" },
    { id: "P_pizza" },
    { id: "P_plane" },
    { id: "P_puppy" },
  ],

  Q: [
    { id: "Q_queen" },
    { id: "Q_question" },
    { id: "Q_quiet" },
    { id: "Q_quilt" },
    { id: "Q_quick" },
    { id: "Q_quail" },
  ],

  R: [
    { id: "R_rabbit" },
    { id: "R_rainbow" },
    { id: "R_ring" },
    { id: "R_robot" },
    { id: "R_rocket" },
    { id: "R_rose" },
  ],

  S: [
    { id: "S_salad" },
    { id: "S_school" },
    { id: "S_ship" },
    { id: "S_shoes" },
    { id: "S_snake" },
    { id: "S_sun" },
  ],

  T: [
    // 예전에 같이 정리했던 세트: Two, Tree, Turtle, Train, Truck, tomato
    { id: "T_two" },
    { id: "T_tree" },
    { id: "T_turtle" },
    { id: "T_train" },
    { id: "T_truck" },
    { id: "T_tomato" },
  ],

  U: [
    // Umbrella, Unicorn, Up, UFO, Universe, Uniform
    { id: "U_umbrella" },
    { id: "U_unicorn" },
    { id: "U_up" },
    { id: "U_ufo" },
    { id: "U_universe" },
    { id: "U_uniform" },
  ],

  V: [
    // Violin, volcano, Vacuum, Video, Vegetable, village
    { id: "V_violin" },
    { id: "V_volcano" },
    { id: "V_vacuum" },
    { id: "V_video" },
    { id: "V_vegetable" },
    { id: "V_village" },
  ],

  W: [
    { id: "W_wall" },
    { id: "W_watch" },
    { id: "W_whale" },
    { id: "W_wheel" },
    { id: "W_window" },
    { id: "W_wolf" },
  ],

  X: [
    // X 는 단어가 적어서 발음 중심 단어 + 패턴 단어 섞음
    { id: "X_xray" },
    { id: "X_xylophone" },
    { id: "X_box" },
    { id: "X_fox" },
    { id: "X_six" },
    { id: "X_taxi" },
  ],

  Y: [
    { id: "Y_yellow" },
    { id: "Y_yogurt" },
    { id: "Y_yoyo" },
    { id: "Y_yarn" },
    { id: "Y_yard" },
    { id: "Y_yes" },
  ],

  Z: [
    { id: "Z_zebra" },
    { id: "Z_zero" },
    { id: "Z_zigzag" },
    { id: "Z_zipper" },
    { id: "Z_zoo" },
    { id: "Z_zombie" },
  ],
};
