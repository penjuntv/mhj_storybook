// utils/storyStorage.js
// Step2 ↔ Step3에서 공통으로 사용하는 스토리 저장/로드 헬퍼

export const STORY_KEY = "storybook_last_story_v1";

/**
 * 스토리를 localStorage에 저장합니다.
 * - raw가 문자열이면 { story: raw } 로 래핑
 * - story가 비어 있으면 아무 것도 하지 않음
 */
export function saveStory(raw) {
  if (typeof window === "undefined") return;

  const payload =
    typeof raw === "string"
      ? { story: raw }
      : raw && typeof raw === "object"
      ? raw
      : null;

  if (!payload) return;

  const storyText =
    typeof payload.story === "string" ? payload.story.trim() : "";

  if (!storyText) return;

  const toSave = {
    ...payload,
    story: storyText,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORY_KEY, JSON.stringify(toSave));
    // 디버깅용 로그
    console.log("[storyStorage] Saved story to localStorage:", toSave);
  } catch (err) {
    console.error("[storyStorage] Save failed", err);
  }
}

/**
 * localStorage에서 마지막 스토리를 읽어옵니다.
 * - 정상일 때: { story: string, savedAt: string, ... }
 * - 없거나 에러일 때: null
 */
export function loadStory() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORY_KEY);
    console.log("[storyStorage] Raw value from localStorage:", raw);

    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.story !== "string") return null;

    console.log("[storyStorage] Parsed story object:", parsed);
    return parsed;
  } catch (err) {
    console.error("[storyStorage] Load failed", err);
    return null;
  }
}
