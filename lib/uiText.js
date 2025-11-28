// lib/uiText.js
// 언어별 UI 텍스트 모음

const TEXT = {
  ko: {
    // 공통
    appTitle: "AI Storybook – 오늘 배운 단어로 영어 동화 만들기",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "오늘 수업·숙제·책에서 등장한 영어 단어를 적거나, 아래 카드에서 골라 보세요.",
    pickFromCards: "알파벳 카드에서 단어 고르기:",
    noCardsForLetter: '아직 이 알파벳에는 카드가 없습니다.',
    writeWordsLabel: "오늘 배운 영어 단어 적기",
    writeWordsPlaceholder:
      "apple, banana, mom 처럼 쉼표(,)나 줄바꿈으로 단어를 입력해 주세요.",
    chipsLabel:
      "Word chips (단어 칩) · 단어 칩을 클릭하면 ★ 표시가 생기며, 동화 속에 꼭 들어갔으면 하는 단어로 표시됩니다. X로 삭제할 수 있습니다. 0/8",
    selectedZero:
      "아직 선택된 단어가 없습니다. 카드나 입력창으로 단어를 추가해 보세요.",
    countSuffix: "/8",

    // 카드 그리드용
    cardsTitle: '단어 카드',
    cardsTitleSuffix: '로 시작하는 단어 카드',
    loadingCards: '카드를 불러오는 중입니다...',
    cardError: '카드를 불러오는 중 오류가 발생했습니다.',

    // STEP 2
    step2Title: "STEP 2 · AI가 만든 영어 동화",
    step2Subtitle:
      "아이 이름과 이야기 방식을 고르고, 동화의 테마와 길이를 선택해 주세요. 단어 2~8개를 고르면 AI가 아이 눈높이에 맞춰 동화를 만들어 줍니다.",

    profileSectionTitle: "이야기를 들려줄 아이 정보",
    kidNameLabel: "이름 (예: Yujin)",
    povLabel: "이야기 방식",
    povFirstPerson: '내가 이야기의 주인공 (1인칭)',
    povThirdPerson: '내가 들려주는 이야기 (3인칭)',

    themeTitle: "이야기 테마 고르기",
    themeSubtitle:
      "단어와 잘 어울리는 테마를 골라 주세요. 테마에 따라 동화의 분위기가 바뀝니다.",

    lengthTitle: "이야기 길이 선택",
    lengthShort: "짧게",
    lengthNormal: "보통",
    lengthLong: "길게",

    themes: {
      everyday: "일상 모험",
      princess: "공주 이야기",
      superhero: "영웅 이야기",
      animals: "동물 친구들",
      dinosaurs: "공룡",
      space: "우주 여행",
      fairy_tale: "전래/동화 느낌",
      family: "가족",
      school: "학교 생활",
      bedtime: "잠자리 이야기",
    },

    askButton: "AI에게 영어 동화 만들기 요청하기",
    loadingStory: "AI가 동화를 만드는 중입니다...",
    mustSelectWords: "단어를 1개 이상 선택해 주세요.",
    resultTitle: "AI가 만든 오늘의 영어 동화",
    storyTooFewWords:
      "선택된 단어가 1개뿐이거나, 모두 같은 유형의 단어면 이야기가 단조로울 수 있습니다.",
    ideasTooFewWords:
      "단어가 너무 적으면 좋은 아이디어를 내기 어렵습니다. 2개 이상 골라 주세요.",
  },

  en: {
    appTitle: "AI Storybook – Make an English story with today's words",
    step1Title: "STEP 1 · Today's words",
    step1Subtitle:
      "Write the English words from today's class / homework / book, or pick cards below.",
    pickFromCards: "Pick from alphabet cards:",
    noCardsForLetter: "No cards for this letter yet.",
    writeWordsLabel: "Write today's English words",
    writeWordsPlaceholder:
      "Type words like apple, banana, mom separated by commas or line breaks.",
    chipsLabel:
      "Word chips · Click a chip to mark it ★ (must appear in the story). You can remove it with X. 0/8",
    selectedZero:
      "No words selected yet. Add words from cards or the input box.",
    countSuffix: "/8",

    cardsTitle: 'Word cards',
    cardsTitleSuffix: ' words',

    step2Title: "STEP 2 · AI-made English story",
    step2Subtitle:
      "Tell us about the child, choose story style, theme, and length. With 2–8 words, AI will write a simple story for them.",

    profileSectionTitle: "Child information",
    kidNameLabel: "Name (e.g. Yujin)",
    povLabel: "Story point of view",
    povFirstPerson: 'Child is the hero (1st person, "I")',
    povThirdPerson: 'Child listens to the story (3rd person)',

    themeTitle: "Choose a story theme",
    themeSubtitle:
      "Pick a theme that matches your words. It changes the feeling of the story.",

    lengthTitle: "Choose story length",
    lengthShort: "Short",
    lengthNormal: "Normal",
    lengthLong: "Long",

    themes: {
      everyday: "Everyday adventure",
      princess: "Princess",
      superhero: "Superhero",
      animals: "Animal friends",
      dinosaurs: "Dinosaurs",
      space: "Space trip",
      fairy_tale: "Fairy tale",
      family: "Family",
      school: "School life",
      bedtime: "Bedtime story",
    },

    askButton: "Ask AI to create the story",
    loadingStory: "AI is writing the story...",
    mustSelectWords: "Please select at least one word.",
    resultTitle: "Today's AI story",
    storyTooFewWords:
      "With very few or very similar words the story may be too simple.",
    ideasTooFewWords:
      "Please choose at least two words to get better ideas.",
  },

  zh: {
    appTitle: "AI 故事书 – 用今天学的单词讲故事",
    step1Title: "步骤 1 · 今天的单词",
    step1Subtitle:
      "写下今天课上 / 作业 / 书里出现的英文单词，或者从下面的卡片中选择。",
    pickFromCards: "从字母卡片中选择：",
    noCardsForLetter: "这个字母还没有卡片。",
    writeWordsLabel: "写下今天学到的英文单词",
    writeWordsPlaceholder:
      "例如 apple, banana, mom，用逗号(,)或换行分开。",
    chipsLabel:
      "单词芯片 · 点击芯片会出现 ★，表示一定要出现在故事里。可用 X 删除。0/8",
    selectedZero: "还没有选择单词。请从卡片或输入框中添加。",
    countSuffix: "/8",

    cardsTitle: '单词卡',
    cardsTitleSuffix: ' 开头的单词',

    step2Title: "步骤 2 · AI 英文故事",
    step2Subtitle:
      "填写孩子信息，选择讲故事方式、主题和长度。选 2–8 个单词，AI 会为孩子写一个简单故事。",

    profileSectionTitle: "孩子信息",
    kidNameLabel: "名字（例：Yujin）",
    povLabel: "讲故事方式",
    povFirstPerson: "我是主角（第一人称）",
    povThirdPerson: "我来听故事（第三人称）",

    themeTitle: "选择故事主题",
    themeSubtitle:
      "选一个和单词相配的主题，故事的气氛会随之变化。",

    lengthTitle: "选择故事长度",
    lengthShort: "短",
    lengthNormal: "一般",
    lengthLong: "长",

    themes: {
      everyday: "日常冒险",
      princess: "公主故事",
      superhero: "英雄故事",
      animals: "动物朋友",
      dinosaurs: "恐龙",
      space: "太空旅行",
      fairy_tale: "童话风格",
      family: "家庭",
      school: "学校生活",
      bedtime: "睡前故事",
    },

    askButton: "请 AI 写故事",
    loadingStory: "AI 正在写故事…",
    mustSelectWords: "请至少选择一个单词。",
    resultTitle: "今天的 AI 故事",
    storyTooFewWords: "单词太少或太相似，故事可能比较简单。",
    ideasTooFewWords: "请至少选两个单词，效果更好。",
  },
};

export function getUIText(language) {
  if (language === "ko" || language === "en" || language === "zh") {
    return TEXT[language];
  }
  return TEXT.en;
}
