// pages/coloring.js

import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

// 간단 I18N (필요하면 Step2와 맞춰 확장 가능)
const I18N = {
  ko: {
    title: "STEP 3 · 색칠하기 | AI Storybook – 색칠하기",
    subtitle: "AI Storybook – 색칠하기",
    sceneSelect: "장면 선택",
    generatingErrorPrefix: "색칠용 그림을 생성하는 중 오류가 발생했습니다: ",
    noPages: "아직 생성된 그림이 없습니다.",
    pageLabel: "Page",
    colorLabel: "색 선택:",
    fullscreen: "전체 화면",
    load: "불러오기",
    save: "저장",
    tip: "팁: 태블릿/스마트폰에서는 가로 화면으로 돌리면 색칠하기 캔버스를 더 크게 볼 수 있습니다.",
  },
  en: {
    title: "STEP 3 · Coloring | AI Storybook – Coloring",
    subtitle: "AI Storybook – Coloring",
    sceneSelect: "Scenes",
    generatingErrorPrefix: "Error while generating coloring pages: ",
    noPages: "No pages generated yet.",
    pageLabel: "Page",
    colorLabel: "Color:",
    fullscreen: "Fullscreen",
    load: "Load",
    save: "Save",
    tip: "Tip: On tablets/phones, rotate to landscape for a larger coloring canvas.",
  },
  zh: {
    title: "STEP 3 · 填色 | AI 故事书 – 填色",
    subtitle: "AI 故事书 – 填色",
    sceneSelect: "场景选择",
    generatingErrorPrefix: "生成填色图片时出错：",
    noPages: "还没有生成任何页面。",
    pageLabel: "Page",
    colorLabel: "颜色选择：",
    fullscreen: "全屏",
    load: "读取",
    save: "保存",
    tip: "提示：在平板/手机上横屏可以看到更大的画布。",
  },
};

// 20색 팔레트
const PALETTE = [
  "#000000",
  "#663300",
  "#FF0000",
  "#FFA500",
  "#FFD700",
  "#008000",
  "#00CED1",
  "#0000FF",
  "#800080",
  "#FFC0CB",
  "#FFFFFF",
  "#8B4513",
  "#FF7F50",
  "#FFFF00",
  "#ADFF2F",
  "#40E0D0",
  "#1E90FF",
  "#4B0082",
  "#FF69B4",
  "#A9A9A9",
];

function decodeStoryParam(raw) {
  if (!raw) return "";
  if (Array.isArray(raw)) raw = raw[0];
  try {
    return decodeURIComponent(raw);
  } catch {
    return String(raw);
  }
}

export default function ColoringPage() {
  const router = useRouter();
  const [locale, setLocale] = useState("ko");
  const t = useMemo(() => I18N[locale], [locale]);

  const rawStory = router.query.story;
  const story = useMemo(() => decodeStoryParam(rawStory), [rawStory]);

  const [pages, setPages] = useState([]); // {id,title,text}[]
  const [pagesLoading, setPagesLoading] = useState(false);
  const [pagesError, setPagesError] = useState("");

  const [selectedPageIndex, setSelectedPageIndex] = useState(0);

  const [currentColor, setCurrentColor] = useState(PALETTE[2]); // 기본 빨강
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  // --- 스토리 기반 페이지 생성 요청 ---
  useEffect(() => {
    if (!story) return;

    async function fetchPages() {
      setPagesLoading(true);
      setPagesError("");

      try {
        const res = await fetch("/api/generateColoringPages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ story }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} ${text || ""}`);
        }

        const data = await res.json();
        setPages(data.pages || []);
        setSelectedPageIndex(0);
      } catch (err) {
        console.error("fetchPages error", err);
        setPagesError(
          t.generatingErrorPrefix +
            (err && err.message ? err.message : "Unknown error")
        );
      } finally {
        setPagesLoading(false);
      }
    }

    fetchPages();
  }, [story, t.generatingErrorPrefix]);

  // --- 캔버스 크기/배경 설정 ---
  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current;
      const wrapper = canvasWrapperRef.current;
      if (!canvas || !wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, rect.width, rect.height);
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // --- 그리기 핸들러 (단순 브러시) ---
  function getCanvasPos(evt) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in evt && evt.touches.length > 0) {
      clientX = evt.touches[0].clientX;
      clientY = evt.touches[0].clientY;
    } else {
      clientX = evt.clientX;
      clientY = evt.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  function handlePointerDown(evt) {
    evt.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCanvasPos(evt);

    isDrawingRef.current = true;
    lastPointRef.current = { x, y };

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function handlePointerMove(evt) {
    if (!isDrawingRef.current) return;
    evt.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCanvasPos(evt);

    ctx.lineTo(x, y);
    ctx.stroke();
    lastPointRef.current = { x, y };
  }

  function handlePointerUp(evt) {
    if (!isDrawingRef.current) return;
    evt.preventDefault();
    isDrawingRef.current = false;
  }

  function handlePointerLeave(evt) {
    if (!isDrawingRef.current) return;
    evt.preventDefault();
    isDrawingRef.current = false;
  }

  // --- 저장/불러오기 (localStorage) ---
  const storageKey = useMemo(
    () => `storybook-coloring-page-${selectedPageIndex}`,
    [selectedPageIndex]
  );

  function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/png");
      window.localStorage.setItem(storageKey, dataUrl);
      alert("현재 색칠 결과를 저장했습니다.");
    } catch (err) {
      console.error("save error", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  }

  function handleLoad() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = window.localStorage.getItem(storageKey);
    if (!dataUrl) {
      alert("저장된 그림이 없습니다.");
      return;
    }
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      // 배경 하양으로 초기화 후 로드
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
    };
    img.src = dataUrl;
  }

  // --- 전체 화면 ---
  function handleFullscreen() {
    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (wrapper.requestFullscreen) {
      wrapper.requestFullscreen().catch(() => {});
    }
  }

  // --- 렌더링 ---

  const currentPage = pages[selectedPageIndex] || null;

  return (
    <>
      <Head>
        <title>{t.title}</title>
      </Head>

      <div className="coloring-root">
        {/* 상단 헤더 */}
        <header className="coloring-header">
          <div>
            <h1>STEP 3 · 색칠하기</h1>
            <p className="subtitle">{t.subtitle}</p>
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
          {/* 좌측: 장면 선택 */}
          <aside className="scene-list">
            <h2>{t.sceneSelect}</h2>

            {pagesLoading && (
              <p className="scene-placeholder">색칠용 페이지를 준비 중입니다…</p>
            )}

            {pagesError && (
              <p className="scene-error">
                {pagesError}
              </p>
            )}

            {!pagesLoading && !pagesError && pages.length === 0 && (
              <p className="scene-placeholder">{t.noPages}</p>
            )}

            <div className="scene-scroll">
              {pages.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  className={
                    "scene-item " +
                    (idx === selectedPageIndex ? "scene-item-active" : "")
                  }
                  onClick={() => setSelectedPageIndex(idx)}
                >
                  <div className="scene-thumb">
                    <span className="scene-page-label">
                      {t.pageLabel} {idx + 1}
                    </span>
                    <p className="scene-text">
                      {p.text.length > 80
                        ? p.text.slice(0, 80) + "…"
                        : p.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* 우측: 캔버스 & 툴 */}
          <section className="canvas-section">
            <header className="canvas-header">
              <div className="canvas-title">
                {currentPage ? `${t.pageLabel} ${currentPage.id}` : ""}
              </div>

              <div className="canvas-toolbar">
                <span className="color-label">{t.colorLabel}</span>
                <div className="palette">
                  {PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={
                        "palette-swatch" +
                        (color === currentColor ? " palette-swatch-active" : "")
                      }
                      style={{ backgroundColor: color }}
                      onClick={() => setCurrentColor(color)}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="tool-button"
                  onClick={handleFullscreen}
                >
                  {t.fullscreen}
                </button>
                <button
                  type="button"
                  className="tool-button"
                  onClick={handleLoad}
                >
                  {t.load}
                </button>
                <button
                  type="button"
                  className="tool-button primary"
                  onClick={handleSave}
                >
                  {t.save}
                </button>
              </div>
            </header>

            <div
              ref={canvasWrapperRef}
              className="canvas-wrapper"
            >
              <canvas
                ref={canvasRef}
                className="coloring-canvas"
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerLeave}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
              />
            </div>

            <p className="tip-text">{t.tip}</p>
          </section>
        </main>

        <style jsx>{`
          .coloring-root {
            min-height: 100vh;
            background: #fbe5c8;
            padding: 24px 32px;
            box-sizing: border-box;
          }
          .coloring-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
          }
          h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: #5a3a25;
          }
          .subtitle {
            margin: 4px 0 0;
            color: #a0734b;
            font-size: 14px;
          }
          .lang-switch button {
            margin-left: 4px;
            padding: 6px 12px;
            border-radius: 999px;
            border: none;
            background: #f2d3aa;
            cursor: pointer;
            font-size: 13px;
          }
          .lang-switch button.active {
            background: #ff8c3f;
            color: #fff;
            font-weight: 600;
          }

          .coloring-main {
            display: flex;
            gap: 24px;
          }

          .scene-list {
            width: 260px;
            background: #ffe7c8;
            border-radius: 20px;
            padding: 16px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
            box-sizing: border-box;
          }
          .scene-list h2 {
            margin: 0 0 12px;
            font-size: 16px;
            color: #5a3a25;
          }
          .scene-placeholder,
          .scene-error {
            font-size: 13px;
            color: #a0734b;
            margin: 8px 0;
          }
          .scene-error {
            color: #d9534f;
          }
          .scene-scroll {
            max-height: 540px;
            overflow-y: auto;
            padding-right: 4px;
          }
          .scene-item {
            width: 100%;
            border: none;
            background: transparent;
            padding: 0;
            margin-bottom: 8px;
            cursor: pointer;
            text-align: left;
          }
          .scene-thumb {
            border-radius: 14px;
            background: #fff7ec;
            padding: 8px 10px;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
          }
          .scene-item-active .scene-thumb {
            border: 2px solid #ff8c3f;
          }
          .scene-page-label {
            display: inline-block;
            font-size: 12px;
            font-weight: 600;
            color: #ff8c3f;
            margin-bottom: 4px;
          }
          .scene-text {
            margin: 0;
            font-size: 12px;
            color: #6b4c35;
            line-height: 1.3;
          }

          .canvas-section {
            flex: 1;
            background: #ffeede;
            border-radius: 24px;
            padding: 16px 18px 20px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
          }
          .canvas-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .canvas-title {
            font-size: 15px;
            font-weight: 600;
            color: #5a3a25;
          }
          .canvas-toolbar {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .color-label {
            font-size: 13px;
            color: #6b4c35;
            margin-right: 4px;
          }
          .palette {
            display: grid;
            grid-template-columns: repeat(10, 16px);
            grid-auto-rows: 16px;
            gap: 4px;
            margin-right: 8px;
          }
          .palette-swatch {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid transparent;
            padding: 0;
            cursor: pointer;
          }
          .palette-swatch-active {
            border-color: #5a3a25;
          }
          .tool-button {
            padding: 6px 10px;
            border-radius: 999px;
            border: none;
            background: #f2d3aa;
            cursor: pointer;
            font-size: 12px;
            white-space: nowrap;
          }
          .tool-button.primary {
            background: #ff8c3f;
            color: #fff;
            font-weight: 600;
          }

          .canvas-wrapper {
            flex: 1;
            margin-top: 8px;
            border-radius: 20px;
            background: #ffffff;
            overflow: hidden;
            position: relative;
          }
          .coloring-canvas {
            width: 100%;
            height: 100%;
            display: block;
            cursor: crosshair;
          }
          .tip-text {
            margin-top: 8px;
            font-size: 12px;
            color: #a0734b;
          }

          @media (max-width: 900px) {
            .coloring-main {
              flex-direction: column;
            }
            .scene-list {
              width: 100%;
              display: flex;
              flex-direction: column;
              max-height: 240px;
            }
            .scene-scroll {
              display: flex;
              flex-direction: row;
              overflow-x: auto;
              max-height: none;
            }
            .scene-item {
              flex: 0 0 180px;
              margin-right: 8px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
