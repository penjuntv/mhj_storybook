// pages/coloring.js
// STEP 3 · 색칠 놀이 – 안정적인 뼈대 버전

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { loadStory } from "../utils/storyStorage";

import ColoringCanvas from "../components/coloring/ColoringCanvas";
import ColorPalette, {
  DEFAULT_COLORS,
} from "../components/coloring/ColorPalette";
import Toolbar from "../components/coloring/Toolbar";

function safeDecode(value) {
  if (typeof value !== "string") return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default function ColoringPage() {
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);
  const [story, setStory] = useState("");
  const [currentColor, setCurrentColor] = useState(DEFAULT_COLORS[1]); // 기본 빨간색
  const canvasRef = useRef(null);

  // 1) 스토리 불러오기: 쿼리스트링 > localStorage 순서
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1) 쿼리에서 가져오기
    const queryStoryRaw =
      typeof router.query.story === "string" ? router.query.story : "";
    const queryStory = safeDecode(queryStoryRaw);

    // 2) localStorage에서 가져오기
    const stored = loadStory(); // { story, savedAt } 또는 null
    const storedStory =
      stored && typeof stored.story === "string" ? stored.story : "";

    // 3) 최종 선택: 쿼리 > localStorage
    const finalStory =
      (queryStory && queryStory.trim().length > 0 && queryStory) ||
      (storedStory && storedStory.trim().length > 0 && storedStory) ||
      "";

    console.log(
      "[ColoringPage] Final story after storage + query merge:",
      finalStory.slice(0, 120) + (finalStory.length > 120 ? "..." : "")
    );

    setStory(finalStory);
    setIsReady(true);
  }, [router.query.story]);

  // 2) 캔버스 전체 지우기 (Toolbar에서 사용)
  const handleClearCanvas = () => {
    const canvas = document.querySelector("canvas.coloring-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // 3) 로딩 상태
  if (!isReady) {
    return (
      <main className="coloring-page">
        <header className="coloring-header">
          <h1>Step 3 · 색칠 놀이</h1>
          <p className="coloring-subtitle">저장된 동화를 불러오는 중입니다…</p>
        </header>
      </main>
    );
  }

  // 4) 스토리가 전혀 없을 때 – 기존 안내 화면
  if (!story || story.trim().length === 0) {
    return (
      <main className="coloring-page">
        <header className="coloring-header">
          <h1>Step 3 · 색칠 놀이</h1>
          <p className="coloring-subtitle">
            오늘 만든 영어 동화를 바탕으로 AI가 만든 그림에 색을 칠해 보세요.
          </p>
        </header>

        <section className="coloring-empty-state">
          <div className="alert-box alert-box--warning">
            먼저 첫 번째 페이지에서 새로 동화를 만든 뒤,&nbsp;
            <strong>“이 동화로 색칠 놀이 하기”</strong> 버튼을 눌러 주세요.
          </div>

          <p className="coloring-empty-text">
            저장된 동화가 없습니다. 먼저 첫 페이지에서 동화를 만들어 주세요.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => router.push("/")}
          >
            동화 만들기 화면으로 가기
          </button>

          <p className="coloring-tip">
            Tip: 단어 칩을 3~8개 정도 선택하고, 아이 이름과 테마를 정한 다음
            동화를 생성하면 색칠 놀이에 더 잘 어울리는 그림을 만들 수 있습니다.
          </p>
        </section>
      </main>
    );
  }

  // 5) 스토리가 있을 때 – 색칠 뼈대 UI
  const storyLines = story.split(/\n+/); // 항상 배열이므로 .map 안전

  return (
    <main className="coloring-page">
      <header className="coloring-header">
        <h1>Step 3 · 색칠 놀이</h1>
        <p className="coloring-subtitle">
          오늘 만든 영어 동화를 바탕으로 AI가 만든 그림에 색을 칠해 보세요.
        </p>
      </header>

      <section className="coloring-layout">
        {/* 왼쪽: 스토리 미리보기 (나중에 장면 썸네일로 교체 예정) */}
        <aside className="coloring-sidebar">
          <h2 className="sidebar-title">오늘 만든 동화</h2>
          <div className="sidebar-story-box">
            {storyLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </aside>

        {/* 오른쪽: 팔레트 + 캔버스 + 툴바 */}
        <div className="coloring-main">
          <div className="coloring-toolbar-row">
            <ColorPalette
              selectedColor={currentColor}
              onChangeColor={setCurrentColor}
            />
            <Toolbar onClear={handleClearCanvas} />
          </div>

          <div className="coloring-canvas-wrapper">
            <ColoringCanvas color={currentColor} ref={canvasRef} />
          </div>

          <p className="coloring-tip">
            Tip: 태블릿/스마트폰에서는 가로 화면으로 돌리면 색칠하기 캔버스를 더
            크게 볼 수 있어요.
          </p>
        </div>
      </section>
    </main>
  );
}
