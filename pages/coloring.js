// pages/coloring.js
// STEP 3: 저장된 동화를 바탕으로 색칠 놀이 화면을 보여주는 페이지

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loadStory, saveStory } from "../utils/storyStorage";

import ColoringCanvas from "../components/coloring/ColoringCanvas";
import ColorPalette from "../components/coloring/ColorPalette";
import Toolbar from "../components/coloring/Toolbar";

export default function ColoringPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState("");

  useEffect(() => {
    // 1) localStorage에서 먼저 시도
    let finalStory = "";
    const stored = loadStory();
    console.log("[ColoringPage] loadStory result:", stored);

    if (stored && typeof stored.story === "string") {
      finalStory = stored.story;
    }

    // 2) 혹시라도 예전 방식처럼 ?story= 로 들어온 경우를 위한 백업 플랜
    if (!finalStory) {
      let fromQuery = router.query.story;
      if (Array.isArray(fromQuery)) {
        fromQuery = fromQuery[0];
      }

      if (typeof fromQuery === "string" && fromQuery.trim().length > 0) {
        let decoded = fromQuery;
        try {
          decoded = decodeURIComponent(decoded);
        } catch (e) {
          console.warn("[ColoringPage] 1st decode failed:", e);
        }
        try {
          decoded = decodeURIComponent(decoded);
        } catch (e) {
          console.warn("[ColoringPage] 2nd decode failed (can ignore):", e);
        }

        finalStory = decoded;
        // 앞으로는 localStorage만 봐도 되도록 저장
        saveStory({ story: finalStory });
      }
    }

    console.log(
      "[ColoringPage] Final story after storage + query merge:",
      finalStory
    );

    if (finalStory && typeof finalStory === "string") {
      setStory(finalStory);
    }

    setLoading(false);
  }, [router.query.story]);

  // 로딩 중
  if (loading) {
    return (
      <main className="coloring-page">
        <header className="coloring-header">
          <h1>Step 3 · 색칠 놀이</h1>
          <p>저장된 동화를 확인하는 중입니다…</p>
        </header>
      </main>
    );
  }

  // 저장된 동화가 전혀 없을 때 (Step1으로 돌려보내는 뼈대)
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

  // 여기부터는 "동화는 있다" 상태 → 색칠 UI (뼈대 고정)
  return (
    <main className="coloring-page">
      <header className="coloring-header">
        <h1>Step 3 · 색칠 놀이</h1>
        <p className="coloring-subtitle">
          오늘 만든 영어 동화를 바탕으로 AI가 만든 그림에 색을 칠해 보세요.
        </p>
      </header>

      <section className="coloring-layout">
        {/* 왼쪽: 장면/페이지 썸네일 영역 – 나중에 AI 컬러링 이미지 썸네일이 들어올 자리 */}
        <aside className="coloring-sidebar">
          <h2 className="sidebar-title">장면 선택</h2>
          <p className="sidebar-helper">
            다음 단계에서 &ldquo;이야기 장면별 컬러링 그림&rdquo;을 자동으로
            생성해 이곳에 썸네일로 보여줄 예정입니다.
          </p>
        </aside>

        {/* 오른쪽: 색 선택 + 툴바 + 캔버스 – 여기 뼈대 위에 기능을 계속 붙여나감 */}
        <div className="coloring-main">
          <div className="coloring-toolbar-row">
            <ColorPalette />
            <Toolbar />
          </div>

          <div className="coloring-canvas-wrapper">
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
