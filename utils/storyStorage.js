// utils/storyStorage.js
// Step2에서 만든 "마지막 동화"를 저장/불러오기 위한 단일 소스

export const STORY_KEY = "storybook_last_story";

/**
 * storyObj 형태 예:
 * {
 *   story: "Yujin woke up ...",   // 필수
 *   savedAt: "2025-12-02T01:23:45.678Z"  // 선택
 * }
 */
export function saveStory(storyObj) {
  try {
    if (!storyObj || typeof storyObj.story !== "string") {
      console.warn("[storyStorage] saveStory called with invalid object:", storyObj);
      return;
    }

    const payload = {
      story: storyObj.story,
      savedAt: storyObj.savedAt || new Date().toISOString(),
    };

    localStorage.setItem(STORY_KEY, JSON.stringify(payload));
    console.log("[storyStorage] Saved story to localStorage:", payload);
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
    console.log("[storyStorage] Parsed value from localStorage:", parsed);
    return parsed;
  } catch (err) {
    console.error("[storyStorage] Load failed:", err);
    return null;
  }
}
