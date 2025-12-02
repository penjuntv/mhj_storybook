// pages/coloring.js
// STEP 3: 동화를 장면(scene)으로 나눠 보여주고,
// 테마별 정적 선그림 템플릿을 배경으로 쓰는 색칠 페이지.
//
// - Step1/Step2는 전혀 건드리지 않는다.
// - story, locale, childName, themeKey는 querystring으로만 받는다.
// - flood-fill(영역 자동 채우기)은 아직 하지 않고
//   "선그림 위에 자유롭게 색칠하는 단계"까지만 구현.

import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import ColoringCanvas from "../components/coloring/ColoringCanvas";
import ColorPalette from "../components/coloring/ColorPalette";
import SceneSidebar from "../components/coloring/SceneSidebar";
import Toolbar from "../components/coloring/Toolbar";

import { COLORING_TEMPLATES } from "../data/coloringTemplates";

// 동화를 3~6개의 장면으로 자르는 유틸
function splitStoryIntoScenes(story) {
  if (typeof story !== "string") return [];

  const trimmed = story.trim();
  if (!trimmed) return [];

  // 1단계: 문장 단위로 자르기
  const sentences = trimmed.split(/(?<=[.!?])\s+/);

  // 문장이 너무 짧을 때는 그대로 하나의 장면으로 사용
  if (sentences.length <= 3) {
    return [trimmed];
  }

  // 2단계: 문장을 3개씩 묶어서 장면으로 만든다.
  const scenes = [];
  const chunkSize = 3;
  for (let i = 0; i < sentences.length; i += chunkSize) {
    const chunk = sentences.slice(i, i + chunkSize).join(" ");
    scenes.push(chunk);
  }

  // 장면이 너무 많으면 앞에서 6개까지만 사용
  return scenes.slice(0, 6);
}

export default function ColoringPage() {
  const router = useRouter();

  const [rawStory, setRawStory] = useState("");
  const [locale, setLocale] = useState("ko");
  const [childName, setChildName] = useState("");
  const [themeKey, setThemeKey] = useState("everyday");

  const [isReady, setIsReady] = useState(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#FF4B4B");

  // 1) 쿼리에서 스토리/테마 정보 읽기
  useEffect(() => {
    if (!router.isReady) return;

    const qStory = router.query.story;
    const qLocale = router.query.locale;
    const qChildName = router.query.childName;
    const qThemeKey = router.query.themeKey;

    const storyFromQuery =
      typeof qStory === "string" ? decodeURIComponent(qStory) : "";
    const localeFromQuery =
      typeof qLocale === "string" && qLocale ? qLocale : "ko";
    const nameFromQuery =
      typeof qChildName === "string" ? qChildName : "";
    const themeFromQuery =
      typeof qThemeKey === "string" && qThemeKey
        ? qThemeKey
        : "everyday";

    setRawStory(storyFromQuery || "");
    setLocale(localeFromQuery);
    setChildName(nameFromQuery);
    setThemeKey(themeFromQuery);
    setIsReady(true);
  }, [router.isReady, router.query]);

  // 2) 스토리를 장면 배열로 변환
  const scenes = useMemo(() => {
    return splitStoryIntoScenes(rawStory);
  }, [rawStory]);

  // 3) 테마에 맞는 정적 선그림 템플릿 선택
  const templatesForTheme = useMemo(() => {
    const list =
      (themeKey && COLORING_TEMPLATES[themeKey]) ||
      COLORING_TEMPLATES["everyday"] ||
      [];
    return Array.isArray(list) ? list : [];
  }, [themeKey]);

  // 현재 선택된 장면 텍스트
  const currentScene =
    Array.isArray(scenes) && scenes.length > 0
      ? scenes[Math.min(selectedSceneIndex, scenes.length - 1)]
      : "";

  // 현재 선택된 템플릿 (테마 템플릿 배열 기준)
  const currentTemplate =
    Array.isArray(templatesForTheme) && templatesForTheme.length > 0
      ? templatesForTheme[
          Math.min(selectedSceneIndex, templatesForTheme.length - 1)
        ]
      : null;

  // ----------------------------------
  // 상태별 렌더링
  // ----------------------------------

  // 아직 router 준비 전
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

  // 장면 배열/템플릿 배열 안전 처리
  const safeScenes = Array.isArray(scenes) ? scenes : [];
  const safeTemplates = Array.isArray(templatesForTheme)
    ? templatesForTheme
    : [];

  return (
    <main className="coloring-page">
      <header className="coloring-header">
        <h1>Step 3 · 색칠 놀이</h1>
        <p className="coloring-subtitle">
          오늘 만든 영어 동화를 바탕으로 테마에 맞는 선그림 위에 색을 칠해
          보세요.
        </p>
      </header>

      <section className="coloring-layout">
        {/* 왼쪽: 장면 리스트 + 썸네일 */}
        <SceneSidebar
          scenes={safeScenes}
          templates={safeTemplates}
          selectedIndex={selectedSceneIndex}
          onSelectScene={setSelectedSceneIndex}
          fullStory={rawStory}
          childName={childName}
          locale={locale}
        />

        {/* 오른쪽: 팔레트 + 캔버스 + 툴바 */}
        <div className="coloring-main">
          <div className="coloring-scene-header">
            <span className="scene-badge">
              Scene{" "}
              {safeScenes.length > 0 ? selectedSceneIndex + 1 : "-"}
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
            <ColoringCanvas
              strokeColor={selectedColor}
              templateImageUrl={currentTemplate?.imageSrc || null}
            />
          </div>

          <p className="coloring-tip">
            Tip: 아이에게 &ldquo;이 장면에 무슨 일이 일어났는지 그림으로
            보여줄래?&rdquo; 하고 질문해 주세요. 나중에 자동 생성 선그림과
            비교하는 활동으로 확장할 수 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
