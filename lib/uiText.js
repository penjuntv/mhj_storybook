// lib/uiText.js

export const UI_TEXT = {
  en: {
    header: "AI Storybook – Make an English story with today's words",
    subtitle:
      "With your child, pick today's English words and let AI make a very simple English story for 3–7 year olds.",

    // STEP 1
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "Write or choose English words that appeared in today's class, homework, or books.",
    pickFromCards: "Choose words from alphabet cards:",
    noCardsForLetter: 'There are no cards for this letter yet.',
    writeWordsLabel: "Write today's English words",
    writeWordsPlaceholder:
      "Type words like apple, banana, mom ... separated by commas or line breaks.",
    chipsLabel:
      "Word chips · Click a chip to toggle ★ (must appear in the story). Click ✕ to remove. ",
    selectedZero:
      "No words have been selected yet. Choose from cards or add words in the box above.",
    countSuffix: "/8",

    // STEP 2 공통
    step2Title: "STEP 2 · Ask AI to make a story",
    step2Subtitle:
      "AI will make a very easy English story using 2–8 words your child chose. Options below are optional; you can also fill them together with your child.",
    profileSectionTitle: "Info about the child who will hear the story",
    kidNameLabel: "Name (e.g., Yujin)",
    kidAgeLabel: "Age",
    povLabel: "Story mode",
    povFirstPerson: 'Tell the story as "I" (first person)',
    povThirdPerson: "Tell the story about the child (third person)",

    // 아이디어 추천
    ideasButton: "Ask AI for place & action ideas",
    ideasCaption:
      "After choosing 2 or more words, you can tap this button to get simple, child-friendly places and actions.",
    placeLabel: "Story place (optional)",
    actionLabel: "What happened? (optional)",
    endingLabel: "How should it end? (optional)",
    suggestionsCaption:
      "Your child can also tap the buttons below to choose a place and an action.",

    askButton: "Ask AI to make the story",
    loading: "AI is making the story...",
    errorPrefix: "Error: ",
    resultTitle: "AI made this story",

    storyTooFewWords: "Please select at least 2 words for the story.",
    ideasTooFewWords:
      "Please select at least 2 words before asking for place/action ideas.",
  },

  ko: {
    header: "AI Storybook – 오늘 배운 단어로 영어 동화 만들기",
    subtitle:
      "아이와 함께 오늘 배운 영어 단어를 넣고, 3~7세 아이를 위한 아주 쉬운 영어 동화를 만들어 보세요.",

    // STEP 1
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

    // STEP 2 공통
    step2Title: "STEP 2 · AI가 만든 영어 동화",
    step2Subtitle:
      "아이가 고른 단어(2~8개)를 바탕으로 AI가 아주 쉬운 영어 동화를 만들어 줍니다. 아래 옵션은 비워 둬도 괜찮고, 아이와 함께 간단히 적어 봐도 좋습니다.",
    profileSectionTitle: "이야기를 들려줄 아이 정보",
    kidNameLabel: "이름 (예: Yujin)",
    kidAgeLabel: "나이",
    povLabel: "이야기 방식",
    povFirstPerson: '아이 입장에서 "나(I)"로 이야기하기',
    povThirdPerson: "아이를 밖에서 바라보듯 이야기하기",

    ideasButton: "AI에게 장소·행동 아이디어 추천받기",
    ideasCaption:
      "단어를 2개 이상 고른 뒤 이 버튼을 누르면, 아이가 이해하기 쉬운 장소·행동 아이디어를 추천해 줍니다.",
    placeLabel: "이야기 장소 (선택)",
    actionLabel: "무엇을 했나요? (선택)",
    endingLabel: "어떻게 끝났으면 좋겠나요? (선택)",
    suggestionsCaption:
      "아이가 고르기 쉽도록 아래 버튼을 눌러 장소·행동을 선택할 수도 있어요.",

    askButton: "AI에게 영어 동화 만들기 요청하기",
    loading: "AI 동화를 만드는 중입니다...",
    errorPrefix: "오류: ",
    resultTitle: "AI가 만든 영어 동화",

    storyTooFewWords: "동화를 만들려면 단어를 최소 2개 이상 선택해 주세요.",
    ideasTooFewWords:
      "장소·행동 아이디어를 받으려면 단어를 최소 2개 이상 선택해 주세요.",
  },

  zh: {
    header: "AI 故事書 – 用今天學到的單字做英文故事",
    subtitle:
      "和孩子一起選今天學到的英文單字，讓 AI 為 3–7 歲孩子做一個非常簡單的英文故事。",

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
      "AI 會用孩子選的 2~8 個單字，做一個非常簡單的英文故事。下面的選項可以留空，也可以和孩子一起簡單填寫。",
    profileSectionTitle: "要聽故事的孩子",
    kidNameLabel: "名字（例：Yujin）",
    kidAgeLabel: "年齡",
    povLabel: "敘事方式",
    povFirstPerson: "用「我」來說故事（第一人稱）",
    povThirdPerson: "用第三人稱描述孩子",

    ideasButton: "請 AI 推薦地點和行動點子",
    ideasCaption:
      "選好至少 2 個單字後，可以按這個按鈕取得簡單的地點和行動點子。",
    placeLabel: "故事地點（選填）",
    actionLabel: "發生了什麼事？（選填）",
    endingLabel: "故事怎麼結束？（選填）",
    suggestionsCaption: "孩子也可以點下面的按鈕自己選地點和行動。",

    askButton: "請 AI 做故事",
    loading: "AI 正在做故事…",
    errorPrefix: "錯誤: ",
    resultTitle: "AI 做出的故事",

    storyTooFewWords: "請至少選擇 2 個單字來做故事。",
    ideasTooFewWords: "請至少選 2 個單字再請求地點/行動點子。",
  },
};
