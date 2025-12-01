// pages/coloring.js
// STEP 3: 저장된 동화를 바탕으로 색칠 놀이 화면을 보여주는 페이지

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loadLastStoryFromStorage } from "../lib/storyStorage";

import ColoringCanvas from "../components/coloring/ColoringCanvas";
import ColorPalette from "../components/coloring/ColorPalette";
import Toolbar from "../components/coloring/Toolbar";
// PageThumbnails, SceneSidebar 등은 이후 단계에서 사용할 수 있도록 남겨둠
// import PageThumbnails from "../components/coloring/PageThumbnails";
// import SceneSidebar from "../components/coloring/SceneSidebar";

export default function ColoringPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState("");

  useEffect(() => {
    const data = loadLastStoryFromStorage();
    if (data && typeof data.story === "string") {
      setStory(data.story);
    }
    setLoading(false);
  }, []);

  // 아직 로딩 중일 때 간단한 플레이스홀더
  if (loading) {
    return (
      <main className="coloring-page">
        <div className="coloring-header">
          <h1>Step 3 · 색칠 놀이</h1>
          <p>저장된 동화를 확인하는 중입니다…</p>
        </div>
      </main>
    );
  }

  // 저장된 동화가 전혀 없을 때: 안내 화면
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
            먼저 첫 번째 페이지에서 새로 동화를 만든 뒤,
            &nbsp;
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

  // 여기부터는 "동화는 있다" 상태 → 색칠 UI 표시
  return (
    <main className="coloring-page">
      <header className="coloring-header">
        <h1>Step 3 · 색칠 놀이</h1>
        <p className="coloring-subtitle">
          오늘 만든 영어 동화를 바탕으로 AI가 만든 그림에 색을 칠해 보세요.
        </p>
      </header>

      <section className="coloring-layout">
        {/* 왼쪽: (향후) 장면 선택 / 썸네일 영역 */}
        <aside className="coloring-sidebar">
          <h2 className="sidebar-title">장면 선택</h2>
          <p className="sidebar-helper">
            다음 단계에서 &ldquo;이야기 장면별 컬러링 그림&rdquo;을 자동으로
            생성해 이곳에 썸네일로 보여줄 예정입니다.
          </p>
          {/* 향후: PageThumbnails, SceneSidebar 등을 여기에 배치 */}
        </aside>

        {/* 오른쪽: 메인 색칠 캔버스 */}
        <div className="coloring-main">
          <div className="coloring-toolbar-row">
            {/* 색 팔레트 (20색) */}
            <ColorPalette />
            {/* 브러시/지우개 등 도구 모음 (이미 구현해둔 Toolbar 컴포넌트 사용) */}
            <Toolbar />
          </div>

          <div className="coloring-canvas-wrapper">
            {/* 현재는 단순 브러시 드로잉.
               다음 단계에서 story를 기반으로 생성한 선 그림을
               배경 레이어로 올려서 "색 채우기" 기능을 확장할 수 있음. */}
            <ColoringCanvas />
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
