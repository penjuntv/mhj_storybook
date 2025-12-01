// lib/storyStorage.js
// 마지막으로 생성한 동화를 localStorage에 저장/읽기/삭제하는 헬퍼

const STORAGE_KEY = "mhj_last_story_v1";

// 동화 저장
export function saveLastStoryToStorage(storyText) {
  if (typeof window === "undefined") {
    console.log("[storyStorage] window is undefined (SSR), skip save");
    return;
  }

  try {
    const story = String(storyText || "");
    const payload = {
      story,
      savedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    console.log(
      "[storyStorage] Saved story",
      { length: story.length, savedAt: payload.savedAt }
    );
  } catch (err) {
    console.error("[storyStorage] Failed to save story:", err);
  }
}

// 동화 불러오기
export function loadLastStoryFromStorage() {
  if (typeof window === "undefined") {
    console.log("[storyStorage] window is undefined (SSR), skip load");
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    console.log("[storyStorage] Raw value from localStorage:", raw);

    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed.story !== "string" ||
      parsed.story.trim().length === 0
    ) {
      console.log("[storyStorage] Parsed but no valid story:", parsed);
      return null;
    }

    console.log(
      "[storyStorage] Loaded story",
      { length: parsed.story.length, savedAt: parsed.savedAt }
    );

    return {
      story: parsed.story,
      savedAt: parsed.savedAt || null,
    };
  } catch (err) {
    console.error("[storyStorage] Failed to load story:", err);
    return null;
  }
}

// (옵션) 필요하면 마지막 동화 삭제
export function clearLastStoryFromStorage() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    console.log("[storyStorage] Cleared last story");
  } catch (err) {
    console.error("[storyStorage] Failed to clear story:", err);
  }
}
