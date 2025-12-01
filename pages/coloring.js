// pages/coloring.js
// STEP 3: 저장된 동화를 바탕으로 색칠 놀이 화면을 보여주는 페이지
// 이번 버전은 "에러 없이 동작하는 안정적인 뼈대"를 목표로 한다.

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import ColoringCanvas from "../components/coloring/ColoringCanvas";
import ColorPalette from "../components/coloring/ColorPalette";
import Toolbar from "../components/coloring/Toolbar";

export default function ColoringPage() {
  const router = useRouter();

  // 쿼리에서 받은 전체 스토리
  const [story, setStory] = useState("");
  const [isReady, setIsReady] = useState(false);

  // 현재 선택된 색상 (팔레트 ↔ 캔버스 공유)
  const [selectedColor, setSelectedColor] = useState("#FF4B4B");

  useEffect(() => {
    if (!router.isReady) return;

    // ?story=... 쿼리에서 스토리 추출
    const q = router.query.story;
    const storyFromQuery =
      typeof q === "string" ? decodeURIComponent(q) : "";

    setStory(storyFromQuery || "");
    setIsReady(true);
  }, [router.isReady, router.query.story]);

  // 1) 아직 router가 준비 안 된 상태 (SSR → CSR 전환 직후)
  if (!isReady) {
    return (
      <main className="coloring-page">
        <header className="coloring-header">
          <h1>Step 3 · 색칠 놀이</h1>
          <p className="coloring-subtitle">
            동화 내용을 불러오는 중입니다…
          </p>
        </header>
      </main>
    );
  }

  // 2) 스토리가 전혀 없는 상태 (직접 /coloring 주소를 치고 들어온 경우 등)
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

  // 3) 스토리는 정상적으로 넘어온 상태 → 색칠 UI 뼈대 표시
  //    여기서는 아직 "장면 분리 / AI 그림 생성"은 하지 않고,
  //    스토리 프리뷰 + 캔버스 + 색 팔레트만 제공한다.

  // 스토리 첫 부분만 살짝 프리뷰 (3줄 정도)
  const previewText = story.split("\n").slice(0, 3).join(" ").slice(0, 200);

  return (
    <main className="coloring-page">
      <header className="coloring-header">
        <h1>Step 3 · 색칠 놀이</h1>
        <p className="coloring-subtitle">
          오늘 만든 영어 동화를 바탕으로 AI가 만든 그림에 색을 칠해 보세요.
        </p>
      </header>

      <section className="coloring-layout">
        {/* 왼쪽: 장면 / 스토리 프리뷰 (지금은 간단 버전) */}
        <aside className="coloring-sidebar">
          <h2 className="sidebar-title">장면 선택</h2>
          <p className="sidebar-helper">
            지금은 스토리 첫 부분만 보여줍니다. 이후 버전에서 장면별 컬러링
            그림과 썸네일을 이곳에 추가할 예정입니다.
          </p>
          <div className="story-preview-box">
            <p className="story-preview-label">오늘 만든 동화</p>
            <p className="story-preview-text">{previewText}...</p>
          </div>
        </aside>

        {/* 오른쪽: 색 팔레트 + 캔버스 + 툴바 */}
        <div className="coloring-main">
          <div className="coloring-toolbar-row">
            <ColorPalette
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
            />
            <Toolbar />
          </div>

          <div className="coloring-canvas-wrapper">
            <ColoringCanvas strokeColor={selectedColor} />
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
