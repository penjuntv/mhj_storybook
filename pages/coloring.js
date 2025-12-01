// pages/coloring.js

import { useEffect, useRef, useState } from "react";
import Head from "next/head";

// 간단한 다국어 텍스트
const I18N = {
  ko: {
    title: "STEP 3 · 색칠하기",
    subtitle: "AI Storybook – 색칠하기",
    sceneListTitle: "장면 선택",
    noStory: "먼저 동화를 만든 뒤, 색칠하기를 시작할 수 있습니다.",
    loadingScenes: "색칠용 장면을 만드는 중입니다…",
    loadErrorPrefix: "색칠용 그림 생성 실패: ",
    fullscreen: "전체 화면",
    reload: "불러오기",
    save: "저장",
    tip: "팁: 태블릿/스마트폰에서는 가로 화면으로 돌리면 색칠하기 캔버스를 더 크게 볼 수 있어요.",
  },
  en: {
    title: "STEP 3 · Coloring",
    subtitle: "AI Storybook – Coloring",
    sceneListTitle: "Scenes",
    noStory: "Please create a story first, then come back to color it.",
    loadingScenes: "Generating coloring scenes…",
    loadErrorPrefix: "Failed to generate coloring pages: ",
    fullscreen: "Fullscreen",
    reload: "Reload",
    save: "Save",
    tip: "Tip: On tablets/phones, rotate to landscape to see a larger canvas.",
  },
  zh: {
    title: "STEP 3 · 填色",
    subtitle: "AI 故事书 – 填色",
    sceneListTitle: "场景选择",
    noStory: "请先生成故事，然后再来填色。",
    loadingScenes: "正在生成可填色的场景…",
    loadErrorPrefix: "生成填色图片失败：",
    fullscreen: "全屏",
    reload: "重新加载",
    save: "保存",
    tip: "提示：在平板或手机上横屏可以看到更大的画布。",
  },
};

const DEFAULT_LOCALE = "ko";

// 3–5세용 큰 팔레트 (20색)
const PALETTE = [
  "#000000", // black
  "#FF7A00", // orange
  "#FFC400", // yellow
  "#FFD966", // light yellow
  "#4CAF50", // green
  "#00BFA5", // teal
  "#1976D2", // blue
  "#3F51B5", // indigo
  "#673AB7", // deep purple
  "#E91E63", // pink
  "#9C27B0", // purple
  "#795548", // brown
  "#9E9E9E", // gray
  "#FFC1A1", // skin-ish
  "#FFF3E0", // warm light
  "#E0F7FA", // light cyan
  "#E8EAF6", // light indigo
  "#F3E5F5", // light purple
  "#FFF9C4", // pale yellow
  "#FFFFFF", // white
];

function getLocaleFromNavigator() {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const lang = navigator.language || navigator.userLanguage || "ko";
  if (lang.startsWith("ko")) return "ko";
  if (lang.startsWith("zh")) return "zh";
  return "en";
}

// 여러 storage에서 스토리 텍스트를 찾아오는 유틸
function detectStoryFromStorage() {
  if (typeof window === "undefined") return { story: "", source: null };

  const candidates = [
    "mhj_storybook_lastStory",
    "mhj_storybook_story",
    "storybook_last_story",
    "storybook_lastStory",
    "storybook_story",
    "ai_storybook_last_story",
  ];

  const sources = [
    { name: "localStorage", storage: window.localStorage },
    { name: "sessionStorage", storage: window.sessionStorage },
  ];

  for (const { name, storage } of sources) {
    if (!storage) continue;
    for (const key of candidates) {
      try {
        const value = storage.getItem(key);
        if (value && typeof value === "string" && value.trim().length > 20) {
          return { story: value, source: `${name}:${key}` };
        }
      } catch (e) {
        // 일부 브라우저/환경에서 접근 실패할 수 있으니 조용히 무시
      }
    }
  }

  return { story: "", source: null };
}

export default function ColoringPage() {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const t = I18N[locale] || I18N[DEFAULT_LOCALE];

  const [story, setStory] = useState("");
  const [storySource, setStorySource] = useState(null); // 디버그용: 어느 key에서 읽었는지

  const [pages, setPages] = useState([]); // {id, prompt, url}
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [currentColor, setCurrentColor] = useState(PALETTE[1]);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  // 캔버스 크기 조정
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();

      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;

      const ctx = canvas.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0); // scale 중복 방지
      ctx.scale(ratio, ratio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 10; // 굵은 선
      ctxRef.current = ctx;

      const currentPage = pages.find((p) => p.id === selectedPageId);
      if (currentPage && currentPage.url) {
        drawBackgroundImage(currentPage.url, canvas, ctx);
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, selectedPageId]);

  // 초기 locale + 스토리 로드
  useEffect(() => {
    setLocale(getLocaleFromNavigator());

    const { story: detectedStory, source } = detectStoryFromStorage();
    if (detectedStory) {
      setStory(detectedStory);
      setStorySource(source);
    }
  }, []);

  // 스토리가 있으면 장면 생성 시도
  useEffect(() => {
    if (!story) return;
    generateColoringPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story, locale]);

  const generateColoringPages = async () => {
    if (!story) return;

    setLoading(true);
    setLoadError("");
    setPages([]);
    setSelectedPageId(null);

    try {
      const res = await fetch("/api/generateColoringPages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story,
          locale,
          numPages: 6,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        setLoadError(`${t.loadErrorPrefix}HTTP ${res.status}`);
        console.error("generateColoringPages error:", text);
        return;
      }

      const data = await res.json();
      const pages = Array.isArray(data.pages) ? data.pages : [];
      setPages(pages);
      if (pages.length > 0) {
        setSelectedPageId(pages[0].id);
      }
    } catch (err) {
      console.error("generateColoringPages error:", err);
      setLoadError(`${t.loadErrorPrefix}${err?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const currentPage = pages.find((p) => p.id === selectedPageId) || null;

  // 특정 페이지를 선택했을 때 배경 이미지 다시 그림
  useEffect(() => {
    if (!currentPage || !currentPage.url) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    drawBackgroundImage(currentPage.url, canvas, ctx);
  }, [currentPage]);

  const drawBackgroundImage = (url, canvas, ctx) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const scale = Math.min(width / img.width, height / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const offsetX = (width - drawW) / 2;
      const offsetY = (height - drawH) / 2;
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    };
    img.onerror = (e) => {
      console.error("Failed to load background image", e);
    };
    img.src = url;
  };

  // 좌표 계산
  const getCanvasPoint = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (event.touches && event.touches[0]) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return { x, y };
  };

  const handlePointerDown = (e) => {
    if (!ctxRef.current) return;
    e.preventDefault();
    drawing.current = true;
    const p = getCanvasPoint(e);
    lastPoint.current = p;
  };

  const handlePointerMove = (e) => {
    if (!drawing.current || !ctxRef.current) return;
    e.preventDefault();
    const ctx = ctxRef.current;
    const p = getCanvasPoint(e);

    ctx.strokeStyle = currentColor;
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    lastPoint.current = p;
  };

  const handlePointerUp = (e) => {
    if (!ctxRef.current) return;
    e.preventDefault();
    drawing.current = false;
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "storybook-coloring.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleFullscreen = () => {
    const container = document.documentElement;
    if (container.requestFullscreen) {
      container.requestFullscreen();
    }
  };

  return (
    <>
      <Head>
        <title>{t.title}</title>
      </Head>
      <div className="page-root coloring-page">
        {/* 상단 헤더 */}
        <header className="page-header">
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
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

        <main className="coloring-layout">
          {/* 좌측: 장면 선택 */}
          <aside className="coloring-scenes-panel">
            <h2>{t.sceneListTitle}</h2>
            {!story && (
              <p className="coloring-info-text">{t.noStory}</p>
            )}
            {story && loading && (
              <p className="coloring-info-text">{t.loadingScenes}</p>
            )}
            {loadError && (
              <p className="coloring-error-text">{loadError}</p>
            )}
            <div className="coloring-scenes-list">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  type="button"
                  className={
                    "coloring-scene-item" +
                    (page.id === selectedPageId ? " active" : "")
                  }
                  onClick={() => setSelectedPageId(page.id)}
                >
                  <div className="scene-thumb-wrapper">
                    {page.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={page.url}
                        alt={`Page ${index + 1}`}
                        className="scene-thumb-image"
                      />
                    ) : (
                      <div className="scene-thumb-placeholder" />
                    )}
                  </div>
                  <div className="scene-thumb-label">
                    Page {index + 1}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* 중앙: 팔레트 + 캔버스 */}
          <section className="coloring-main">
            {/* 팔레트 + 버튼들 */}
            <div className="coloring-toolbar">
              <div className="palette-label">색 선택:</div>
              <div className="palette-row">
                {PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={
                      "palette-color" +
                      (currentColor === c ? " selected" : "")
                    }
                    style={{ backgroundColor: c }}
                    onClick={() => setCurrentColor(c)}
                  />
                ))}
              </div>
              <div className="toolbar-buttons">
                <button type="button" onClick={handleFullscreen}>
                  {t.fullscreen}
                </button>
                <button type="button" onClick={generateColoringPages}>
                  {t.reload}
                </button>
                <button type="button" onClick={handleSave}>
                  {t.save}
                </button>
              </div>
            </div>

            {/* 캔버스 */}
            <div className="coloring-canvas-wrapper">
              <canvas
                ref={canvasRef}
                className="coloring-canvas"
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
              />
            </div>

            <p className="coloring-tip-text">{t.tip}</p>
            {storySource && (
              <p
                style={{
                  fontSize: 10,
                  opacity: 0.5,
                  marginTop: 4,
                }}
              >
                (debug: story from {storySource})
              </p>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
