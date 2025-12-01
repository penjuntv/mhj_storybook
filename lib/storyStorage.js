// lib/storyStorage.js
// 마지막으로 생성한 동화를 localStorage에 저장/읽기/삭제하는 헬퍼

const STORAGE_KEY = "mhj_last_story_v1";

// 동화 저장
export function saveLastStoryToStorage(storyText) {
  if (typeof window === "undefined") return; // SSR 방지

  try {
    const payload = {
      story: String(storyText || ""),
      savedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("[storyStorage] Failed to save story:", err);
  }
}

// 동화 불러오기
export function loadLastStoryFromStorage() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed.story !== "string" ||
      parsed.story.trim().length === 0
    ) {
      return null;
    }

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
  } catch (err) {
    console.error("[storyStorage] Failed to clear story:", err);
  }
}
