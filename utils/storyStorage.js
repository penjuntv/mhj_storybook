// utils/storyStorage.js
// STEP 2 ↔ STEP 3 사이에서 마지막으로 만든 동화를 공유하기 위한 유틸

export const STORY_KEY = "storybook_last_story";

// 동화 저장: { story, ...추가필드 } 형태를 기대
export function saveStory(storyObj) {
  try {
    if (!storyObj) return;
    const json = JSON.stringify(storyObj);
    localStorage.setItem(STORY_KEY, json);
    console.log("[storyStorage] Saved story:", storyObj);
  } catch (err) {
    console.error("[storyStorage] Save failed", err);
  }
}

// 마지막 동화 불러오기
export function loadStory() {
  try {
    const raw = localStorage.getItem(STORY_KEY);
    console.log("[storyStorage] Raw value from localStorage:", raw);

    if (!raw) return null;

    const parsed = JSON.parse(raw);
    console.log("[storyStorage] Parsed story object:", parsed);
    return parsed;
  } catch (err) {
    console.error("[storyStorage] Load failed", err);
    return null;
  }
}
