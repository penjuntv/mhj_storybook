// pages/coloring.js
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import SceneSidebar from "../components/coloring/SceneSidebar";
import ColorPalette from "../components/coloring/ColorPalette";
import Toolbar from "../components/coloring/Toolbar";
import ColoringCanvas from "../components/coloring/ColoringCanvas";
import useColoringPages from "../hooks/useColoringPages";

// Step3 전용 다국어 텍스트
const I18N = {
  ko: {
    pageTitle: "STEP 3 · 색칠하기",
    appTitle: "AI Storybook – 색칠하기",
    noPages: "아직 생성된 그림이 없습니다.",
    tip: "팁: 태블릿/스마트폰에서는 가로 화면으로 돌리면 색칠하기 캔버스를 더 크게 볼 수 있습니다.",
    sceneSelectLabel: "장면 선택",
    loading: "AI가 색칠용 그림을 만드는 중입니다…",
    errorPrefix: "색칠용 그림을 생성하는 중 오류가 발생했습니다: ",
    pageLabel: "Page",
    colorLabel: "색 선택:",
    fullscreen: "전체 화면",
    save: "저장",
    load: "불러오기",
  },
  en: {
    pageTitle: "STEP 3 · Coloring",
    appTitle: "AI Storybook – Coloring",
    noPages: "No coloring pages have been generated yet.",
    tip: "Tip: Rotate your tablet/phone to landscape to see a larger canvas.",
    sceneSelectLabel: "Scenes",
    loading: "AI is generating coloring pages…",
    errorPrefix: "Error while generating coloring pages: ",
    pageLabel: "Page",
    colorLabel: "Color:",
    fullscreen: "Fullscreen",
    save: "Save",
    load: "Load",
  },
  zh: {
    pageTitle: "STEP 3 · 填色",
    appTitle: "AI 故事书 – 填色",
    noPages: "还没有生成可以填色的画面。",
    tip: "提示：在平板/手机上横屏可以看到更大的画布。",
    sceneSelectLabel: "场景选择",
    loading: "AI 正在生成填色画面…",
    errorPrefix: "生成填色画面时出错：",
    pageLabel: "Page",
    colorLabel: "颜色：",
    fullscreen: "全屏",
    save: "保存",
    load: "载入",
  },
};

// 20색 팔레트 (2줄×10개)
export const PALETTE_COLORS = [
  "#000000",
  "#ffffff",
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#3f51b5",
  "#2196f3",
  "#00bcd4",
  "#4caf50",
  "#8bc34a",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#9e9e9e",
  "#607d8b",
  "#c2185b",
  "#7b1fa2",
  "#303f9f",
];

// 간단 해시 (스토리+테마 기준으로 저장 키 만들기)
function simpleHash(str) {
  let hash = 0;
  if (!str) return "0";
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

export default function ColoringPage() {
  const router = useRouter();
  const { story = "", themeKey = "everyday", locale: queryLocale } = router.query;

  const [locale, setLocale] = useState(
    typeof queryLocale === "string" ? queryLocale : "ko"
  );
  const t = useMemo(() => I18N[locale] || I18N.ko, [locale]);

  const fullStory = typeof story === "string" ? story : "";
  const storyHash = simpleHash(fullStory + "|" + themeKey);

  const {
    pages,
    loading: pagesLoading,
    error: pagesError,
  } = useColoringPages({
    story: fullStory,
    themeKey: typeof themeKey === "string" ? themeKey : "everyday",
    locale,
  });

  const [selectedPageId, setSelectedPageId] = useState(null);
  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[2]);
  const [savedImages, setSavedImages] = useState({}); // pageId -> dataURL

  const rootRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 페이지 목록이 생기면 첫 페이지 자동 선택
  useEffect(() => {
    if (pages && pages.length > 0 && selectedPageId == null) {
      setSelectedPageId(pages[0].id);
    }
  }, [pages, selectedPageId]);

  // localStorage에서 불러오기
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `mhj-storybook-coloring-${storyHash}`;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.images) {
        setSavedImages(parsed.images);
      }
    } catch {
      // ignore
    }
  }, [storyHash]);

  const handleSaveImageForPage = useCallback((pageId, dataUrl) => {
    setSavedImages((prev) => ({
      ...prev,
      [pageId]: dataUrl,
    }));
  }, []);

  const handleSaveAll = useCallback(() => {
    if (typeof window === "undefined") return;
    const key = `mhj-storybook-coloring-${storyHash}`;
    try {
      const payload = {
        version: 1,
        storyHash,
        images: savedImages,
        updatedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(key, JSON.stringify(payload));
      alert("색칠한 그림이 저장되었습니다.");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  }, [savedImages, storyHash]);

  const handleLoadAll = useCallback(() => {
    if (typeof window === "undefined") return;
    const key = `mhj-storybook-coloring-${storyHash}`;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        alert("저장된 색칠 내역이 없습니다.");
        return;
      }
      const parsed = JSON.parse(raw);
      if (parsed && parsed.images) {
        setSavedImages(parsed.images);
        alert("저장된 색칠 내역을 불러왔습니다.");
      } else {
        alert("불러올 수 있는 데이터가 없습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("불러오기 중 오류가 발생했습니다.");
    }
  }, [storyHash]);

  // 전체 화면 토글
  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!isFullscreen) {
      if (rootRef.current && rootRef.current.requestFullscreen) {
        rootRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, [isFullscreen]);

  // 브라우저에서 직접 전체화면 종료했을 때 상태 동기화
  useEffect(() => {
    if (typeof document === "undefined") return;
    const handler = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const selectedPage =
    pages && pages.length > 0 && selectedPageId != null
      ? pages.find((p) => p.id === selectedPageId)
      : null;

  return (
    <>
      <Head>
        <title>{t.appTitle}</title>
      </Head>

      <div className={`coloring-root ${isFullscreen ? "fullscreen" : ""}`} ref={rootRef}>
        {/* 상단 헤더 */}
        <header className="coloring-header">
          <div className="coloring-header-left">
            <h1 className="coloring-main-title">{t.pageTitle}</h1>
            <p className="coloring-sub-title">{t.appTitle}</p>
          </div>

          <div className="lang-switch">
            <button
              type="button"
              className={locale === "en" ? "active" : ""}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={locale === "ko" ? "active" : ""}
              onClick={() => setLocale("ko")}
            >
              KO
            </button>
            <button
              type="button"
              className={locale === "zh" ? "active" : ""}
              onClick={() => setLocale("zh")}
            >
              中文
            </button>
          </div>
        </header>

        <main className="coloring-main">
          {/* 좌측 장면 선택 */}
          <aside className="coloring-sidebar">
            <h2 className="sidebar-title">{t.sceneSelectLabel}</h2>

            {pagesLoading && (
              <div className="sidebar-placeholder">{t.loading}</div>
            )}

            {pagesError && (
              <div className="sidebar-error">
                {t.errorPrefix}
                {pagesError}
              </div>
            )}

            {!pagesLoading && !pagesError && (!pages || pages.length === 0) && (
              <div className="sidebar-placeholder">{t.noPages}</div>
            )}

            {!pagesLoading && !pagesError && pages && pages.length > 0 && (
              <SceneSidebar
                pages={pages}
                selectedPageId={selectedPageId}
                onSelectPage={setSelectedPageId}
                locale={locale}
              />
            )}
          </aside>

          {/* 중앙/우측: 캔버스 + 팔레트 + 툴바 */}
          <section className="coloring-workspace">
            <Toolbar
              onToggleFullscreen={toggleFullscreen}
              onSaveAll={handleSaveAll}
              onLoadAll={handleLoadAll}
              isFullscreen={isFullscreen}
              labels={{
                fullscreen: t.fullscreen,
                save: t.save,
                load: t.load,
              }}
            />

            <div className="coloring-canvas-block">
              <div className="coloring-canvas-header">
                <div className="canvas-page-title">
                  {selectedPage
                    ? `${t.pageLabel} ${selectedPage.id}`
                    : t.noPages}
                </div>
                {selectedPage && (
                  <div className="canvas-page-caption">
                    {selectedPage.summary}
                  </div>
                )}
              </div>

              <div className="coloring-canvas-and-palette">
                <div className="coloring-canvas-wrapper">
                  <ColoringCanvas
                    key={selectedPage ? selectedPage.id : "empty"}
                    page={selectedPage}
                    selectedColor={selectedColor}
                    savedImage={selectedPage ? savedImages[selectedPage.id] : null}
                    onChangeImage={handleSaveImageForPage}
                  />
                </div>

                <div className="coloring-palette-wrapper">
                  <div className="palette-label">{t.colorLabel}</div>
                  <ColorPalette
                    colors={PALETTE_COLORS}
                    selectedColor={selectedColor}
                    onSelectColor={setSelectedColor}
                  />
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="coloring-footer">
          <p>{t.tip}</p>
        </footer>
      </div>
    </>
  );
}
