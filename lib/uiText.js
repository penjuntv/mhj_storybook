// lib/uiText.js

const TEXT = {
  en: {
    // 공통
    appTitle: "AI Storybook – Make an English story with today's words",
    appSubtitle:
      "Write or choose today's English words with your child and let AI make a very easy story for 3–7 year-old ESL learners.",

    // STEP 1
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "Write words from today's class, homework, or books, or pick them from the alphabet cards below.",
    pickFromCards: "Choose words from alphabet cards:",
    cardsForLetterLabel: 'Cards that start with "{letter}"',
    noCardsForLetter: "There are no cards for this letter yet.",
    writeWordsLabel: "Write today's English words",
    writeWordsPlaceholder:
      "Type words like apple, banana, mom. Use commas or new lines to separate them.",
    chipsLabel:
      "Word chips · Click a chip to toggle ★ (must appear in the story). Use ✕ to remove. ",
    selectedZero:
      "No words selected yet. Add words from the cards or the text box above.",
    countSuffix: "/8",

    // STEP 2 – 프로필/이야기 옵션
    step2Title: "STEP 2 · Ask AI to make a story",
    step2Subtitle:
      "AI will make a very easy English story using 2–8 words your child chose.",
    profileSectionTitle: "Child information for this story",
    kidNameLabel: "Name (example: Yujin)",
    povLabel: "Story style",
    povFirstPerson: '“I am the main character” (first person)',
    povThirdPerson: '“You are the main character” (third-person feeling)',
    lengthLabel: "Story length",
    lengthShort: "Short",
    lengthNormal: "Normal",
    lengthLong: "Long",

    // STEP 2 – 장소/행동/끝 + 아이디어
    ideasButton: "Ask AI to suggest places & actions",
    ideasCaption:
      "After choosing at least 2 words, you can let AI suggest simple places and actions that match those words.",
    placeLabel: "Story place (optional)",
    actionLabel: "What happened? (optional)",
    endingLabel: "How should it end? (optional)",
    suggestionsCaption:
      "Tap the buttons below so your child can easily choose a place and an action.",

    // STEP 2 – 동화 생성
    askButton: "Ask AI to make the story",
    loading: "AI is making the story...",
    errorPrefix: "Error: ",
    resultTitle: "AI made this story",
    storyTooFewWords:
      "Please choose at least 2 words before asking AI to make a story.",
  },

  ko: {
    // 공통
    appTitle: "AI Storybook – 오늘 배운 단어로 영어 동화 만들기",
    appSubtitle:
      "아이와 함께 오늘 배운 영어 단어를 넣고, 3~7세 아이를 위한 아주 쉬운 영어 동화를 만들어 보세요.",

    // STEP 1
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "오늘 수업·숙제·책에서 등장한 영어 단어를 적거나, 아래 카드에서 골라 보세요.",
    pickFromCards: "알파벳 카드에서 단어 고르기:",
    cardsForLetterLabel: '"{letter}" 로 시작하는 단어 카드',
    noCardsForLetter: "아직 이 알파벳에는 카드가 없습니다.",
    writeWordsLabel: "오늘 배운 영어 단어 적기",
    writeWordsPlaceholder:
      "apple, banana, mom 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요.",
    chipsLabel:
      "Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는 단어로 표시됩니다. ✕로 삭제할 수 있습니다. ",
    selectedZero:
      "아직 선택된 단어가 없습니다. 카드나 입력창으로 단어를 추가해 보세요.",
    countSuffix: "/8",

    // STEP 2 – 프로필/이야기 옵션
    step2Title: "STEP 2 · AI가 만든 영어 동화",
    step2Subtitle:
      "아이가 고른 단어(2~8개)를 바탕으로 AI가 아주 쉬운 영어 동화를 만들어 줍니다.",
    profileSectionTitle: "이야기를 들려줄 아이 정보",
    kidNameLabel: "이름 (예: Yujin)",
    povLabel: "이야기 방식",
    povFirstPerson: "내가 이야기의 주인공 (1인칭 느낌)",
    povThirdPerson: "네가 이야기의 주인공 (3인칭 느낌)",
    lengthLabel: "이야기 길이",
    lengthShort: "숏",
    lengthNormal: "노멀",
    lengthLong: "롱",

    // STEP 2 – 장소/행동/끝 + 아이디어
    ideasButton: "AI에게 장소·행동 아이디어 추천받기",
    ideasCaption:
      "단어를 2개 이상 고른 뒤, 버튼을 눌러 오늘 단어와 잘 어울리는 장소·행동 아이디어를 AI에게 추천받을 수 있어요.",
    placeLabel: "이야기 장소 (선택)",
    actionLabel: "무엇을 했나요? (선택)",
    endingLabel: "어떻게 끝났으면 좋겠나요? (선택)",
    suggestionsCaption:
      "아이가 고르기 쉽도록 아래 버튼을 눌러 장소·행동을 선택할 수도 있어요.",

    // STEP 2 – 동화 생성
    askButton: "AI에게 영어 동화 만들기 요청하기",
    loading: "AI 동화를 만드는 중입니다...",
    errorPrefix: "오류: ",
    resultTitle: "AI가 만든 영어 동화",
    storyTooFewWords:
      "먼저 단어를 2개 이상 고른 뒤 AI에게 동화를 만들어 달라고 요청해 주세요.",
  },

  zh: {
    // 공통 (간단 번역)
    appTitle: "AI 故事書 – 用今天學到的單字做英文故事",
    appSubtitle:
      "和孩子一起選今天學到的英文單字，讓 AI 為 3–7 歲孩子做一個非常簡單的英文故事。",

    // STEP 1
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "寫下或從卡片中選擇今天在課堂、作業或書裡出現的英文單字。",
    pickFromCards: "從字母卡片選單字：",
    cardsForLetterLabel: '以 "{letter}" 開頭的單字卡片',
    noCardsForLetter: "這個字母目前還沒有卡片。",
    writeWordsLabel: "寫下今天學到的英文單字",
    writeWordsPlaceholder:
      "輸入 apple, banana, mom 等單字，用逗號(,)或換行分開。",
    chipsLabel:
      "Word chips · 點一下單字就會加上 ★（一定要出現在故事裡），按 ✕ 可以刪除。",
    selectedZero: "還沒有選擇任何單字。請從卡片或輸入框中加入單字。",
    countSuffix: "/8",

    // STEP 2
    step2Title: "STEP 2 · 請 AI 做一個故事",
    step2Subtitle:
      "AI 會用孩子選的 2~8 個單字，做一個非常簡單的英文故事。",
    profileSectionTitle: "要聽故事的孩子資訊",
    kidNameLabel: "名字（例：Yujin）",
    povLabel: "敘述方式",
    povFirstPerson: "「我」是主角（第一人稱）",
    povThirdPerson: "「你」是主角（第三人稱感覺）",
    lengthLabel: "故事長度",
    lengthShort: "短",
    lengthNormal: "一般",
    lengthLong: "較長",

    ideasButton: "請 AI 建議故事地點和行動",
    ideasCaption:
      "選好至少兩個單字之後，可以請 AI 建議適合的故事地點和行動。",
    placeLabel: "故事地點（選填）",
    actionLabel: "發生了什麼事？（選填）",
    endingLabel: "故事怎麼結束？（選填）",
    suggestionsCaption: "可以點下面的按鈕，讓孩子更容易選擇。",

    askButton: "請 AI 做故事",
    loading: "AI 正在做故事…",
    errorPrefix: "錯誤: ",
    resultTitle: "AI 做出的故事",
    storyTooFewWords: "請先選至少兩個單字，再請 AI 做故事。",
  },
};

export function getUIText(language) {
  return TEXT[language] || TEXT.ko;
}
