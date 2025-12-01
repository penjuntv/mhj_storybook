// pages/coloring.js
// STEP 3: 저장된 동화를 바탕으로 색칠 놀이 화면을 보여주는 페이지
// 1차 목표: 스토리 로딩 + 빈 색칠 UI 뼈대를 100% 안정적으로 띄우는 것

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { loadStory } from "../utils/storyStorage";

import ColoringCanvas from "../components/coloring/ColoringCanvas";
import ColorPalette from "../components/coloring/ColorPalette";
import Toolbar from "../components/coloring/Toolbar";

export default function ColoringPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState("");

  // 1) localStorage에 저장된 마지막 동화 불러오기
  // 2) 쿼리스트링에 story 가 있으면 그것으로 덮어쓰기 (가장 최신)
  useEffect(() => {
    try {
      // 1) localStorage에서 읽기
      const stored = typeof window !== "undefined" ? loadStory() : null;

      // 2) 쿼리에서 넘어온 story(있으면 더 우선)
      let queryStory = "";
      if (router && router.query && typeof router.query.story === "string") {
        // 프레이머/넥스트에서 인코딩된 문자열이므로 decodeURIComponent
        try {
          queryStory = decodeURIComponent(router.query.story);
        } catch {
          queryStory = router.query.story;
        }
      }

      // 최종 스토리 결정
      const finalStory =
        (queryStory && queryStory.trim().length > 0 && queryStory) ||
        (stored && typeof stored.story === "string" ? stored.story : "");

      console.log(
        "[ColoringPage] Final story after storage + query merge:",
        finalStory
      );

      setStory(finalStory || "");
    } catch (err) {
      console.error("[ColoringPage] Error while loading story:", err);
      setStory("");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ─────────────────────────────────────────
  // 로딩 중 화면
  // ─────────────────────────────────────────
  if (loading) {
    return (
      <main className="coloring-page">
        <header className="coloring-header">
          <h1>Step 3 · 색칠 놀이</h1>
          <p className="coloring-subtitle">저장된 동화를 불러오는 중입니다…</p>
        </header>
      </main>
    );
  }

  // ─────────────────────────────────────────
  // 저장된 동화가 전혀 없을 때
  // ─────────────────────────────────────────
  const hasStory = typeof story === "string" && story.trim().length > 0;

  if (!hasStory) {
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

  // ─────────────────────────────────────────
  // 여기부터는 "동화는 있다" 상태 → 색칠 UI 뼈대
  // 장면 분할 / 썸네일 / 자동 그림 생성은 이 뼈대 위에 나중에 추가
  // ─────────────────────────────────────────
  return (
    <main className="coloring-page">
      <header className="coloring-header">
        <h1>Step 3 · 색칠 놀이</h1>
        <p className="coloring-subtitle">
          오늘 만든 영어 동화를 바탕으로 AI가 만든 그림에 색을 칠해 보세요.
        </p>
      </header>

      <section className="coloring-layout">
        {/* 왼쪽 사이드바 – 현재는 안내 텍스트만, 나중에 장면 썸네일 추가 */}
        <aside className="coloring-sidebar">
          <h2 className="sidebar-title">장면 선택</h2>
          <p className="sidebar-helper">
            현재는 연습 단계라 빈 캔버스에 자유롭게 색칠할 수 있습니다.
            <br />
            다음 단계에서 이 동화를 여러 장면으로 나누고,
            각 장면에 맞는 컬러링 그림을 자동 생성해 이 영역에 썸네일로
            보여줄 예정입니다.
          </p>
        </aside>

        {/* 오른쪽 메인 – 색 팔레트 + 도구 + 캔버스 */}
        <div className="coloring-main">
          <div className="coloring-toolbar-row">
            <ColorPalette />
            <Toolbar />
          </div>

          <div className="coloring-canvas-wrapper">
            {/* 지금은 story 를 직접 쓰진 않지만, 필요하면 prop 로 넘길 수 있음 */}
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
