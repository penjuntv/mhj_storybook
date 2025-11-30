// pages/coloring.js

import { useEffect, useRef, useState, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

/**
 * STEP 3 · 색칠하기
 *
 * - 쿼리스트링으로 story, locale 을 전달받음
 *   예: /coloring?story=...&locale=en
 * - /api/generateColoringPages 에 POST 로 스토리를 보내서
 *   4장의 색칠용 장면 이미지를 받아옴.
 * - 좌측: 장면 선택(썸네일 + Page 번호)
 * - 상단: 큰 색 팔레트(20색)
 * - 중앙: 캔버스 (이미지 위에 "채우기 도구"로 색 채우기)
 * - 우상단 버튼: 전체 화면, 불러오기(저장된 그림), 저장
 */

const COLOR_PALETTE = [
  "#000000",
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#00C7BE",
  "#007AFF",
  "#5856D6",
  "#AF52DE",
  "#FF2D55",
  "#8E8E93",
  "#C7C7CC",
  "#FFDAB9",
  "#FFE4B5",
  "#D0F0C0",
  "#C6E2FF",
  "#E6E6FA",
  "#F5DEB3",
  "#B0E0E6",
  "#FFFFFF",
];

// hex → [r, g, b]
function hexToRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(h, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// 간단한 flood-fill 알고리즘 (이미지 영역 색 채우기)
function floodFill(ctx, x, y, fillColor, tolerance = 20) {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  // 캔버스 경계 밖이면 무시
  if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) return;

  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const data = imageData.data;

  const startPos = (Math.floor(y) * canvasWidth + Math.floor(x)) * 4;
  const startColor = [
    data[startPos],
    data[startPos + 1],
    data[startPos + 2],
    data[startPos + 3],
  ];

  const targetColor = hexToRgb(fillColor);
  const visited = new Uint8Array(canvasWidth * canvasHeight);

  // 이미 같은 색이면 굳이 채우지 않음
  if (
    Math.abs(startColor[0] - targetColor[0]) < 5 &&
    Math.abs(startColor[1] - targetColor[1]) < 5 &&
    Math.abs(startColor[2] - targetColor[2]) < 5
  ) {
    return;
  }

  const colorMatch = (idx) => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    return (
      Math.abs(r - startColor[0]) <= tolerance &&
      Math.abs(g - startColor[1]) <= tolerance &&
      Math.abs(b - startColor[2]) <= tolerance
    );
  };

  const stack = [];
  stack.push([Math.floor(x), Math.floor(y)]);

  while (stack.length > 0) {
    const [cx, cy] = stack.pop();
    if (cx < 0 || cy < 0 || cx >= canvasWidth || cy >= canvasHeight) continue;

    const idx = cy * canvasWidth + cx;
    if (visited[idx]) continue;

    const dataIdx = idx * 4;
    if (!colorMatch(dataIdx)) continue;

    // 색 채우기
    data[dataIdx] = targetColor[0];
    data[dataIdx + 1] = targetColor[1];
    data[dataIdx + 2] = targetColor[2];
    data[dataIdx + 3] = 255;

    visited[idx] = 1;

    stack.push([cx + 1, cy]);
    stack.push([cx - 1, cy]);
    stack.push([cx, cy + 1]);
    stack.push([cx, cy - 1]);
  }

  ctx.putImageData(imageData, 0, 0);
}

// 로컬스토리지 키
const storageKeyForPage = (pageIndex) =>
  `mhj_storybook_coloring_page_${pageIndex}`;

export default function ColoringPage() {
  const router = useRouter();
  const canvasRef = useRef(null);

  const [locale, setLocale] = useState("en");
  const [storyText, setStoryText] = useState("");
  const [pages, setPages] = useState([]); // { index, text, imageUrl }[]
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#FF3B30");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 초기: 쿼리에서 story, locale 읽기 + API 호출
  useEffect(() => {
    if (!router.isReady) return;

    const qs = router.query;
    const story = typeof qs.story === "string" ? qs.story : "";
    const loc = typeof qs.locale === "string" ? qs.locale : "en";

    setStoryText(story);
    setLocale(loc);

    if (story) {
      generateColoringPages(story, loc);
    } else {
      setErrorMsg("이 페이지는 STEP 2에서 동화를 만든 후에 들어와야 합니다.");
    }
  }, [router.isReady, router.query]);

  // 장면 선택이 바뀔 때마다 해당 이미지 로드
  useEffect(() => {
    const page = pages.find((p) => p.index === selectedPageIndex);
    if (!page || !page.imageUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // 캔버스 초기화
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);

      // 이미지 비율 유지하며 중앙 배치
      const scale = Math.min(w / img.width, h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;

      ctx.drawImage(img, dx, dy, dw, dh);

      // 저장된 그림이 있으면 불러오기
      const saved = window.localStorage.getItem(
        storageKeyForPage(selectedPageIndex)
      );
      if (saved) {
        const savedImg = new Image();
        savedImg.onload = () => {
          ctx.drawImage(savedImg, 0, 0, w, h);
        };
        savedImg.src = saved;
      }
    };

    img.onerror = () => {
      console.warn("Failed to load coloring image:", page.imageUrl);
    };

    img.src = page.imageUrl;
  }, [pages, selectedPageIndex]);

  async function generateColoringPages(story, loc) {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/generateColoringPages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story,
          locale: loc,
          pageCount: 4,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`색칠용 그림 생성 실패: HTTP ${res.status} ${text}`);
      }

      const data = await res.json();
      if (!data.pages || !Array.isArray(data.pages) || data.pages.length === 0) {
        throw new Error("색칠용 그림 데이터를 받지 못했습니다.");
      }

      setPages(data.pages);
      setSelectedPageIndex(data.pages[0].index ?? 0);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "색칠용 그림을 생성하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  // 캔버스 클릭 → 해당 위치 영역 색 채우기
  function handleCanvasClick(event) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;

    const ctx = canvas.getContext("2d");
    floodFill(ctx, x, y, selectedColor, 25);
  }

  // 현재 페이지 저장
  function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    window.localStorage.setItem(storageKeyForPage(selectedPageIndex), dataUrl);
    alert("이 페이지의 색칠 그림을 저장했습니다.");
  }

  // 현재 페이지 불러오기
  function handleLoad() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    const saved = window.localStorage.getItem(
      storageKeyForPage(selectedPageIndex)
    );
    if (!saved) {
      alert("저장된 그림이 없습니다.");
      return;
    }

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
    };
    img.src = saved;
  }

  // 전체 화면
  function handleFullscreen() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  }

  const currentPageText = useMemo(() => {
    const p = pages.find((page) => page.index === selectedPageIndex);
    if (!p) return "";
    return p.text;
  }, [pages, selectedPageIndex]);

  return (
    <>
      <Head>
        <title>STEP 3 · 색칠하기 | AI Storybook</title>
      </Head>
      <div className="coloring-page-root">
        <header className="coloring-header">
          <div className="title-block">
            <h1>STEP 3 · 색칠하기</h1>
            <p>AI Storybook – 색칠하기</p>
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
          <aside className="scene-sidebar">
            <h2>장면 선택</h2>
            {isLoading && (
              <p className="scene-info">색칠용 그림을 만드는 중입니다…</p>
            )}
            {errorMsg && <p className="scene-error">{errorMsg}</p>}

            {!isLoading && !errorMsg && pages.length === 0 && (
              <p className="scene-info">
                STEP 2에서 동화를 만든 후 이 페이지로 이동해 주세요.
              </p>
            )}

            <div className="scene-list">
              {pages.map((page) => (
                <button
                  key={page.index}
                  type="button"
                  className={
                    "scene-item" +
                    (page.index === selectedPageIndex ? " selected" : "")
                  }
                  onClick={() => setSelectedPageIndex(page.index)}
                >
                  <div className="scene-thumb">
                    {page.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={page.imageUrl} alt={`Page ${page.index + 1}`} />
                    ) : (
                      <div className="scene-thumb-placeholder" />
                    )}
                  </div>
                  <div className="scene-label">Page {page.index + 1}</div>
                </button>
              ))}
            </div>
            <p className="scene-tip">
              팁: 태블릿/스마트폰에서는 가로 화면으로 돌리면 색칠하기 캔버스를 더 크게 볼 수
              있어요.
            </p>
          </aside>

          {/* 우측: 색 선택 + 캔버스 */}
          <section className="canvas-section">
            <div className="toolbar">
              <div className="color-palette-label">색 선택:</div>
              <div className="color-palette">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={
                      "color-dot" + (color === selectedColor ? " selected" : "")
                    }
                    style={{
                      backgroundColor: color,
                    }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                  />
                ))}
              </div>
              <div className="toolbar-buttons">
                <button type="button" onClick={handleFullscreen}>
                  전체 화면
                </button>
                <button type="button" onClick={handleLoad}>
                  불러오기
                </button>
                <button type="button" onClick={handleSave}>
                  저장
                </button>
              </div>
            </div>

            <div className="canvas-wrapper">
              <canvas
                ref={canvasRef}
                width={1024}
                height={576}
                className="coloring-canvas"
                onClick={handleCanvasClick}
              />
            </div>

            {currentPageText && (
              <div className="scene-description">
                <strong>이 장면 설명:</strong> {currentPageText}
              </div>
            )}
          </section>
        </main>

        <style jsx>{`
          .coloring-page-root {
            min-height: 100vh;
            background: #ffe8c9;
            padding: 32px;
            box-sizing: border-box;
          }
          .coloring-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
          }
          .title-block h1 {
            margin: 0;
            font-size: 28px;
          }
          .title-block p {
            margin: 4px 0 0;
            font-size: 14px;
            color: #8b6b4a;
          }
          .lang-switch button {
            border-radius: 999px;
            border: none;
            padding: 6px 14px;
            margin-left: 6px;
            background: #f3d6ae;
            cursor: pointer;
            font-size: 12px;
          }
          .lang-switch button.active {
            background: #ff9f5a;
            color: white;
            font-weight: 600;
          }
          .coloring-main {
            display: grid;
            grid-template-columns: 260px 1fr;
            gap: 20px;
          }
          .scene-sidebar {
            background: #ffe0bf;
            border-radius: 24px;
            padding: 18px;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
            display: flex;
            flex-direction: column;
          }
          .scene-sidebar h2 {
            margin: 0 0 8px;
            font-size: 18px;
          }
          .scene-info,
          .scene-error {
            font-size: 13px;
            margin: 4px 0 8px;
          }
          .scene-error {
            color: #d32f2f;
          }
          .scene-list {
            margin-top: 8px;
            flex: 1;
            overflow-y: auto;
            padding-right: 4px;
          }
          .scene-item {
            width: 100%;
            text-align: left;
            border: none;
            background: transparent;
            padding: 8px;
            border-radius: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 6px;
          }
          .scene-item.selected {
            background: #ffd19a;
          }
          .scene-thumb {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            background: #fff7ec;
            overflow: hidden;
            flex-shrink: 0;
          }
          .scene-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .scene-thumb-placeholder {
            width: 100%;
            height: 100%;
            background: #f3d6ae;
          }
          .scene-label {
            font-size: 14px;
            font-weight: 500;
          }
          .scene-tip {
            margin-top: 10px;
            font-size: 11px;
            color: #8b6b4a;
          }
          .canvas-section {
            background: #ffe0bf;
            border-radius: 24px;
            padding: 18px;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
            display: flex;
            flex-direction: column;
          }
          .toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            gap: 12px;
          }
          .color-palette-label {
            font-size: 14px;
            margin-right: 4px;
          }
          .color-palette {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            flex: 1;
          }
          .color-dot {
            width: 32px;
            height: 32px;
            border-radius: 999px;
            border: 2px solid rgba(0, 0, 0, 0.12);
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          }
          .color-dot.selected {
            border-color: #ff6a00;
            box-shadow: 0 0 0 3px rgba(255, 153, 0, 0.4);
          }
          .toolbar-buttons button {
            margin-left: 6px;
            border-radius: 999px;
            border: none;
            padding: 6px 14px;
            background: #ff9f5a;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
          }
          .canvas-wrapper {
            flex: 1;
            background: #fff7ec;
            border-radius: 24px;
            padding: 12px;
            margin-top: 4px;
          }
          .coloring-canvas {
            width: 100%;
            height: 100%;
            border-radius: 18px;
            background: #ffffff;
            display: block;
          }
          .scene-description {
            margin-top: 10px;
            font-size: 12px;
            color: #6d4c41;
          }

          @media (max-width: 900px) {
            .coloring-main {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </>
  );
}
