// pages/coloring.js
// STEP 3: 동화를 장면(scene)으로 나눠 보여주고, 장면별 색칠 캔버스를 제공하는 페이지
// - Step1/Step2는 건드리지 않는다.
// - 스토리는 querystring (?story=...) 에서 받는다. (필요하면 나중에 localStorage fallback 추가)
// - 에러 대신 '장면 없음' / '스토리 없음' 같은 안전한 상태로 처리한다.

import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import ColoringCanvas from "../components/coloring/ColoringCanvas";
import ColorPalette from "../components/coloring/ColorPalette";
import SceneSidebar from "../components/coloring/SceneSidebar";
import Toolbar from "../components/coloring/Toolbar";

// 동화를 3~6개의 장면으로 자르는 유틸
function splitStoryIntoScenes(story) {
  if (typeof story !== "string") return [];

  const trimmed = story.trim();
  if (!trimmed) return [];

  // 1단계: 문장 단위로 자르기
  const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean);

  // 문장이 너무 짧을 때는 그대로 하나의 장면으로 사용
  if (sentences.length <= 3) {
    return [trimmed];
  }

  // 2단계: 문장을 2~4개씩 묶어서 장면으로 만든다 (너무 잘게 쪼개지지 않도록)
  const scenes = [];
  const chunkSize = 3; // 기본 3문장씩 묶기

  for (let i = 0; i < sentences.length; i += chunkSize) {
    const chunk = sentences.slice(i, i + chunkSize).join(" ");
    scenes.push(chunk);
  }

  // 장면이 너무 많으면 앞에서 6개까지만 사용 (컬러링 장면 6장 기준)
  if (scenes.length > 6) {
    return scenes.slice(0, 6);
  }

  return scenes;
}

export default function ColoringPage() {
  const router = useRouter();

  const [rawStory, setRawStory] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#FF4B4B");

  // 1) 쿼리에서 스토리 읽기
  useEffect(() => {
    if (!router.isReady) return;

    const q = router.query.story;
    const storyFromQuery =
      typeof q === "string" ? decodeURIComponent(q) : "";

    setRawStory(storyFromQuery || "");
    setIsReady(true);
  }, [router.isReady, router.query.story]);

  // 2) 스토리를 장면 배열로 변환
  const scenes = useMemo(() => {
    return splitStoryIntoScenes(rawStory);
  }, [rawStory]);

  // 현재 선택된 장면 텍스트
  const safeScenes = Array.isArray(scenes) ? scenes : [];
  const currentScene =
    safeScenes.length > 0
      ? safeScenes[Math.min(selectedSceneIndex, safeScenes.length - 1)]
      : "";

  // ----------------------------------
  // 상태별 렌더링
  // ----------------------------------

  // 아직 router 준비 전
  if (!isReady) {
    return (
      <main className="coloring-page">
        <header className="coloring-header">
          <h1>Step 3 · 색칠 놀이</h1>
          <p className="coloring-subtitle">동화 내용을 불러오는 중입니다…</p>
        </header>
      </main>
    );
  }

  // 스토리 자체가 없는 경우
  if (!rawStory || rawStory.trim().length === 0) {
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

  return (
    <main className="coloring-page">
      <header className="coloring-header">
        <h1>Step 3 · 색칠 놀이</h1>
        <p className="coloring-subtitle">
          오늘 만든 영어 동화를 장면별로 나눠서, 아이가 직접 그림으로 표현해
          볼 수 있는 색칠 놀이 화면입니다. 이후 버전에서 AI 컬러링 선그림이
          자동으로 추가될 예정입니다.
        </p>
      </header>

      <section className="coloring-layout">
        {/* 왼쪽: 장면 리스트 + 전체 스토리 요약 */}
        <SceneSidebar
          scenes={safeScenes}
          selectedIndex={selectedSceneIndex}
          onSelectScene={setSelectedSceneIndex}
          fullStory={rawStory}
        />

        {/* 오른쪽: 팔레트 + 캔버스 + 툴바 */}
        <div className="coloring-main">
          <div className="coloring-scene-header">
            <span className="scene-badge">
              Scene {safeScenes.length > 0 ? selectedSceneIndex + 1 : "-"}
            </span>
            <p className="scene-description">
              {currentScene
                ? currentScene
                : "선택된 장면이 없습니다. 왼쪽에서 장면을 선택해 주세요."}
            </p>
          </div>

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
            Tip: 아이에게 &ldquo;이 장면에 무슨 일이 일어났는지 그림으로
            보여줄래?&rdquo; 하고 질문해 주세요. 나중에 AI가 자동으로 그린
            선그림과 비교해 보는 활동으로 확장할 수 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
