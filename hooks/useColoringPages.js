// hooks/useColoringPages.js
import { useEffect, useState } from "react";

/**
 * 스토리를 4~8개의 장면으로 나누는 간단한 함수
 * - 기본은 빈 줄(두 줄 이상) 기준으로 나눔
 * - 너무 적으면 길이 기준으로 잘라서 보정
 */
function splitStoryToPages(story, desiredCount = 6) {
  if (!story) return [];

  // 1차: 빈 줄 기준 분할
  let chunks = story
    .split(/\n\s*\n/g)
    .map((s) => s.trim())
    .filter(Boolean);

  if (chunks.length === 0) {
    chunks = [story.trim()];
  }

  // 장면 수가 너무 많으면 앞에서부터 desiredCount개까지만 사용
  if (chunks.length > desiredCount) {
    chunks = chunks.slice(0, desiredCount);
  }

  // 장면 수가 너무 적으면 길이 기준으로 쪼갬
  while (chunks.length < desiredCount) {
    const longestIndex = chunks.reduce(
      (maxIdx, chunk, idx, arr) =>
        chunk.length > arr[maxIdx].length ? idx : maxIdx,
      0
    );
    const target = chunks[longestIndex];
    if (target.length < 200) break;

    const mid = Math.floor(target.length / 2);
    const cutIndex =
      target.indexOf(" ", mid) > 0 ? target.indexOf(" ", mid) : mid;
    const left = target.slice(0, cutIndex).trim();
    const right = target.slice(cutIndex).trim();
    chunks.splice(longestIndex, 1, left, right);
  }

  return chunks.map((text, idx) => ({
    id: idx + 1,
    title: `Page ${idx + 1}`,
    text,
    summary: text.length > 100 ? text.slice(0, 100) + "…" : text,
    lineArtUrl: null,
  }));
}

/**
 * 스토리 + 테마를 받아서 AI 색칠용 페이지(line art 이미지)를 로딩하는 훅
 */
export default function useColoringPages({ story, themeKey, locale }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!story) {
      setPages([]);
      setError("");
      setLoading(false);
      return;
    }

    const basePages = splitStoryToPages(story, 6);
    setPages(basePages);
    setError("");
    setLoading(true);

    async function fetchImages() {
      try {
        const res = await fetch("/api/generateColoringPages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pages: basePages.map((p) => ({
              id: p.id,
              summary: p.summary,
              text: p.text,
            })),
            themeKey,
            locale,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }

        const data = await res.json();
        if (!data || !Array.isArray(data.images)) {
          throw new Error("Invalid response from generateColoringPages");
        }

        const map = new Map();
        data.images.forEach((img) => {
          if (img && typeof img.id === "number") {
            map.set(img.id, img.url);
          }
        });

        setPages((prev) =>
          prev.map((p) => ({
            ...p,
            lineArtUrl: map.get(p.id) || p.lineArtUrl,
          }))
        );
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [story, themeKey, locale]);

  return { pages, loading, error };
}
