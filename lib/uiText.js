// lib/uiText.js
// 다국어 UI 텍스트 모음 + 헬퍼 함수

const TEXT = {
  en: {
    header: "AI Storybook – Make an English story with today's words",
    subtitle:
      "Write today's English words with your child and let AI make a very easy English story for 3–7 year olds.",

    // STEP 1
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "Write or choose today's English words from class, homework, or books.",
    pickFromCards: "Choose words from alphabet cards:",
    noCardsForLetter: 'There are no cards for this alphabet yet.',
    writeWordsLabel: "Write today's English words",
    writeWordsPlaceholder:
      "Type words like apple, banana, mom, separated by commas or line breaks.",
    chipsLabel:
      'Word chips · Click a chip to toggle ★ (must appear in the story). Use ✕ to delete. ',
    selectedZero:
      "No words selected yet. Add words from the cards or the input box.",
    countSuffix: "/8",

    // STEP 2 – profile
    step2Title: "STEP 2 · Ask AI to make a story",
    step2Subtitle:
      "AI will make a very easy English story using 2–8 words your child chose.",
    profileSectionTitle: "Child who will hear the story",
    kidNameLabel: "Name (ex: Yujin)",
    kidAgeLabel: "Age",
    povLabel: "Story point of view",
    povFirstPerson: 'Tell story as "I" (first person)',
    povThirdPerson: "Tell story about the child (third person)",

    // STEP 2 – place / action / ending
    ideasButton: "Get story place & action ideas from AI",
    ideasCaption:
      "After choosing at least 2 words, you can get child-friendly places and actions that match them.",
    placeLabel: "Story place (optional)",
    actionLabel: "What happened? (optional)",
    endingLabel: "How should it end? (optional)",
    endingPlaceholder: "everyone smiles, they go to sleep...",
    suggestionsCaption:
      "You can tap one of the suggestion chips below to fill each box.",

    // Buttons / status
    askButton: "Ask AI to make the story",
    loading: "AI is making the story...",
    errorPrefix: "Error: ",
    resultTitle: "AI made this story",

    // storyIdeas
    ideasTooFewWords:
      "Please choose at least 2 words before asking AI for place & action ideas.",
    ideasLoading: "AI is thinking of places and actions...",
    ideasErrorPrefix: "Error while getting ideas: ",
  },

  ko: {
    header: "AI Storybook – 오늘 배운 단어로 영어 동화 만들기",
    subtitle:
      "아이와 함께 오늘 배운 영어 단어를 넣고, 3~7세 아이를 위한 아주 쉬운 영어 동화를 만들어 보세요.",

    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "오늘 수업·숙제·책에서 등장한 영어 단어를 적거나, 아래 카드에서 골라 보세요.",
    pickFromCards: "알파벳 카드에서 단어 고르기:",
    noCardsForLetter: "아직 이 알파벳에는 카드가 없습니다.",
    writeWordsLabel: "오늘 배운 영어 단어 적기",
    writeWordsPlaceholder:
      "apple, banana, mom 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요.",
    chipsLabel:
      "Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는 단어로 표시됩니다. ✕로 삭제할 수 있습니다. ",
    selectedZero:
      "아직 선택된 단어가 없습니다. 카드나 입력창으로 단어를 추가해 보세요.",
    countSuffix: "/8",

    step2Title: "STEP 2 · AI가 만든 영어 동화",
    step2Subtitle:
      "아이가 고른 단어(2~8개)를 바탕으로 AI가 아주 쉬운 영어 동화를 만들어 줍니다.",
    profileSectionTitle: "이야기를 들려줄 아이 정보",
    kidNameLabel: "이름 (예: Yujin)",
    kidAgeLabel: "나이",
    povLabel: "이야기 방식",
    povFirstPerson: '아이가 "나(I)"로 이야기하기',
    povThirdPerson: "아이 이야기를 밖에서 들려주기",

    ideasButton: "AI에게 장소·행동 아이디어 추천받기",
    ideasCaption:
      "단어를 2개 이상 고른 뒤 누르면, 아이가 좋아할 만한 장소와 행동을 추천해 줍니다.",
    placeLabel: "이야기 장소 (선택)",
    actionLabel: "무엇을 했나요? (선택)",
    endingLabel: "어떻게 끝났으면 좋겠나요? (선택)",
    endingPlaceholder: "everyone smiles, they go to sleep...",
    suggestionsCaption:
      "아이가 고르기 쉽도록 아래 버튼을 눌러 장소·행동·마무리를 선택할 수도 있어요.",

    askButton: "AI에게 영어 동화 만들기 요청하기",
    loading: "AI 동화를 만드는 중입니다...",
    errorPrefix: "오류: ",
    resultTitle: "AI가 만든 영어 동화",

    ideasTooFewWords:
      "AI에게 장소·행동을 물어보려면 먼저 단어를 2개 이상 선택해 주세요.",
    ideasLoading: "AI가 장소와 행동을 떠올리는 중입니다...",
    ideasErrorPrefix: "아이디어 불러오기 오류: ",
  },

  zh: {
    header: "AI 故事書 – 用今天學到的單字做英文故事",
    subtitle: "和孩子一起輸入今天學到的英文單字，做一個給 3–7 歲孩子的簡單英文故事。",

    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "請寫下或從卡片中選擇今天在課堂、作業或書裡出現的英文單字。",
    pickFromCards: "從字母卡片選單字：",
    noCardsForLetter: "這個字母目前還沒有卡片。",
    writeWordsLabel: "寫下今天學到的英文單字",
    writeWordsPlaceholder:
      "輸入 apple, banana, mom 等單字，用逗號(,)或換行分開。",
    chipsLabel:
      "Word chips · 點一下單字就會加上 ★（一定要出現在故事裡），按 ✕ 可以刪除。",
    selectedZero: "還沒有選擇任何單字。請從卡片或輸入框中加入單字。",
    countSuffix: "/8",

    step2Title: "STEP 2 · 請 AI 做一個故事",
    step2Subtitle:
      "AI 會用孩子選的 2~8 個單字，做一個非常簡單的英文故事。",
    profileSectionTitle: "會聽故事的孩子",
    kidNameLabel: "名字（例：Yujin）",
    kidAgeLabel: "年齡",
    povLabel: "故事視角",
    povFirstPerson: "用「我」來說故事（第一人稱）",
    povThirdPerson: "用第三人稱講孩子的故事",

    ideasButton: "請 AI 推薦故事地點和活動",
    ideasCaption:
      "先選 2 個以上的單字，再請 AI 想想適合的地點和活動。",
    placeLabel: "故事地點（選填）",
    actionLabel: "做了什麼？（選填）",
    endingLabel: "故事怎麼結束？（選填）",
    endingPlaceholder: "everyone smiles, they go to sleep...",
    suggestionsCaption: "也可以點下面的按鈕，直接選地點、活動和結局。",

    askButton: "請 AI 做故事",
    loading: "AI 正在做故事…",
    errorPrefix: "錯誤: ",
    resultTitle: "AI 做出的故事",

    ideasTooFewWords: "請至少選 2 個單字再請 AI 推薦地點和活動。",
    ideasLoading: "AI 正在思考地點與活動…",
    ideasErrorPrefix: "取得故事點子時發生錯誤：",
  },
};

// 헬퍼 함수: 언어코드를 넣으면 해당 텍스트 세트를 반환
export function getUIText(language) {
  if (!language) return TEXT.ko;
  return TEXT[language] || TEXT.ko;
}
