export const STORY_KEY = "storybook_last_story";

export function saveStory(storyObj) {
  if (!storyObj) return;
  localStorage.setItem(STORY_KEY, JSON.stringify(storyObj));
}

export function loadStory() {
  try {
    const raw = localStorage.getItem(STORY_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("[storyStorage] Load failed", err);
    return null;
  }
}
