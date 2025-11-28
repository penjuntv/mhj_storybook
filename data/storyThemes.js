// data/storyThemes.js

// STEP 2에서 버튼으로 보여 줄 테마 목록
export const STORY_THEMES = [
  { id: "everyday", emoji: "🏡" },
  { id: "princess", emoji: "👑" },
  { id: "superhero", emoji: "🦸" },
  { id: "animals", emoji: "🐻" },
  { id: "dinosaurs", emoji: "🦕" },
  { id: "space", emoji: "🚀" },
  { id: "fairy_tale", emoji: "📖" },
  { id: "family", emoji: "👨‍👩‍👧" },
  { id: "school", emoji: "🏫" },
  { id: "bedtime", emoji: "🌙" },
];

// GPT 프롬프트에서 사용할 영어 설명
export const STORY_THEME_DESCRIPTIONS = {
  everyday:
    "a warm, everyday adventure in a familiar place (home, park, or neighborhood)",
  princess:
    "a gentle fairy-tale with princesses, castles, and a small bit of magic",
  superhero:
    "an exciting but safe superhero story where nobody gets seriously hurt",
  animals:
    "a story with talking animal friends going on a small adventure together",
  dinosaurs:
    "a playful dinosaur story that is fun, not scary, for young children",
  space:
    "a cozy space adventure with rockets, stars, and friendly aliens",
  fairy_tale:
    "a classic fairy-tale style story, like folk tales, with a clear, kind lesson",
  family:
    "a story about family life, love, and helping each other",
  school:
    "a story about school life, classmates, and learning something new",
  bedtime:
    "a very calm, sleepy bedtime story that helps the child relax",
};
