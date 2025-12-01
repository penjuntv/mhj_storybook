// utils/storyStorage.js
// Step2 ↔ Step3 사이에서 "마지막으로 만든 동화"를 공유하기 위한 단일 소스

export const STORY_KEY = "storybook_last_story";

// storyObj 예시:
// { story: "....", createdAt: 1733100000000, meta: { words: [...], themeKey: "family" } }
export function saveStory(storyObj) {
  if (!storyObj) return;

  try {
    const wrapped = {
      ...storyObj,
      createdAt: storyObj.createdAt || Date.now(),
    };
    const json = JSON.stringify(wrapped);
    localStorage.setItem(STORY_KEY, json);
    console.log("[storyStorage] Saved story to localStorage:", json);
  } catch (err) {
    console.error("[storyStorage] Save failed:", err);
  }
}

export function loadStory() {
  try {
    const raw = localStorage.getItem(STORY_KEY);
    console.log("[storyStorage] Raw value from localStorage:", raw);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    console.log("[storyStorage] Parsed story object:", parsed);
    return parsed;
  } catch (err) {
    console.error("[storyStorage] Load failed:", err);
    return null;
  }
}
