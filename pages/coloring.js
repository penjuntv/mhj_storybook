// pages/coloring.js

import { useEffect, useRef, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

// 다국어 UI 텍스트 (스토리는 항상 영어지만, 화면 문구는 로케일에 따라 변경)
const I18N = {
  ko: {
    title: "STEP 3 · 색칠하기",
    subtitle: "AI Storybook – 색칠하기",
    sceneListTitle: "장면 선택",
    loadingScenes: "색칠용 장면을 만드는 중입니다...",
    scenesErrorPrefix: "색칠용 그림을 생성하는 중 오류가 발생했습니다: ",
    noScenes: "아직 생성된 장면이 없습니다.",
    colorsLabel: "색 선택",
    fullScreen: "전체 화면",
    load: "불러오기",
    save: "저장",
    tip: "팁: 태블릿/스마트폰에서는 가로 화면으로 돌리면 색칠하기 캔버스를 더 크게 볼 수 있습니다.",
  },
  en: {
    title: "STEP 3 · Coloring",
    subtitle: "AI Storybook – Coloring",
    sceneListTitle: "Scene selection",
    loadingScenes: "Preparing coloring scenes...",
    scenesErrorPrefix: "Error while generating coloring scenes: ",
    noScenes: "No scenes have been created yet.",
    colorsLabel: "Colors",
    fullScreen: "Full screen",
    load: "Load",
    save: "Save",
    tip: "Tip: On tablets/phones rotate to landscape to see a bigger canvas.",
  },
  zh: {
    title: "STEP 3 · 涂色",
    subtitle: "AI Storybook – 涂色",
    sceneListTitle: "选择场景",
    loadingScenes: "正在生成涂色场景…",
    scenesErrorPrefix: "生成涂色场景时出错：",
    noScenes: "目前还没有生成场景。",
    colorsLabel: "颜色选择",
    fullScreen: "全屏",
    load: "载入",
    save: "保存",
    tip: "提示：在平板/手机上横屏可以看到更大的画布。",
  },
};

// 3–5세 아이 기준 크고 선명한 20색 팔레트
const COLOR_PALETTE = [
  "#000000",
  "#7F7F7F",
  "#C00000",
  "#FF0000",
  "#FFC000",
  "#FFFF00",
  "#92D050",
  "#00B050",
  "#00B0F0",
  "#0070C0",
  "#002060",
  "#7030A0",
  "#FF99CC",
  "#FF6600",
  "#CCFF66",
  "#99FFFF",
  "#99CCFF",
  "#CCCCFF",
  "#FFFFFF",
  "#663300",
];

export default function ColoringPage() {
  const router = useRouter();
  const [locale, setLocale] = useState("ko");
  const t = I18N[locale] || I18N.ko;

  const [storyText, setStoryText] = useState("");
  const [pages, setPages] = useState([]); // [{ id, index, title, caption, description }]
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [loadingScenes, setLoadingScenes] = useState(false);
  const [scenesError, setScenesError] = useState("");

  // 캔버스 관련 상태
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [brushColor, setBrushColor] = useState(COLOR_PALETTE[3]); // 밝은 빨강
  const [brushSize, setBrushSize] = useState(8);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  // 페이지별 그림 상태를 저장할 수 있도록 구조를 준비해 둔다.
  // 지금은 단일 캔버스만 사용하지만, 나중에 sceneImages[pageId] 로 저장/복원 가능.
  const [sceneImages, setSceneImages] = useState({}); // { [pageId]: ImageDataURL }

  // ----- 스토리 텍스트 읽어오기 -----
  useEffect(() => {
    // 1) 쿼리에서 가져오기
    const queryStory =
      typeof router.query.story === "string"
        ? decodeURIComponent(router.query.story)
        : "";

    if (queryStory) {
      setStoryText(queryStory);
      return;
    }

    // 2) 로컬스토리지에서 가져오기 (선택 사항)
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("mhj_storybook_last_story");
      if (stored) {
        setStoryText(stored);
      }
    }
  }, [router.query.story]);

  // ----- 스토리 → 색칠 장면 생성 API 호출 -----
  useEffect(() => {
    if (!storyText) return;

    async function fetchScenes() {
      setLoadingScenes(true);
      setScenesError("");
      try {
        const res = await fetch("/api/generateColoringPages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storyText,
            maxPages: 6,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} ${text}`);
        }

        const data = await res.json();
        setPages(Array.isArray(data.pages) ? data.pages : []);
        setSelectedPageIndex(0);
      } catch (err) {
        console.error("Error fetching coloring scenes:", err);
        setScenesError(
          (err && err.message) || "Unknown error while generating scenes."
        );
      } finally {
        setLoadingScenes(false);
      }
    }

    fetchScenes();
  }, [storyText]);

  // ----- 캔버스 초기화 / 리사이즈 -----
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    // 좌우 여백 감안해서 약간 줄여서 사용
    const width = Math.max(600, rect.width - 40);
    const height = Math.max(400, rect.height - 80);

    // 실제 픽셀 크기 & 스타일 크기 동시 조정
    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.fillStyle = "#FFFDF8";
    ctx.fillRect(0, 0, width, height);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // ----- 드로잉 핸들러 -----
  const getCanvasPos = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    // 마우스/터치 공통 처리
    const clientX =
      event.touches && event.touches[0]
        ? event.touches[0].clientX
        : event.clientX;
    const clientY =
      event.touches && event.touches[0]
        ? event.touches[0].clientY
        : event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCanvasPos(e);

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;

    ctx.beginPath();
    ctx.moveTo(x, y);

    isDrawingRef.current = true;
    lastPointRef.current = { x, y };
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCanvasPos(e);

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;

    ctx.lineTo(x, y);
    ctx.stroke();

    lastPointRef.current = { x, y };
  };

  const endDrawing = () => {
    isDrawingRef.current = false;
  };

  // ----- 전체 화면 토글 -----
  const handleFullScreen = () => {
    if (typeof document === "undefined") return;
    const elem = containerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // ----- 저장/불러오기 -----
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "coloring-page.png";
    a.click();

    // 페이지별 상태로도 저장
    const page = pages[selectedPageIndex];
    if (page) {
      setSceneImages((prev) => ({
        ...prev,
        [page.id]: dataUrl,
      }));
    }
  };

  const fileInputRef = useRef(null);

  const handleLoadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // 캔버스 전체를 흰색으로 지운 뒤 그림을 맞춰 넣는다.
        ctx.fillStyle = "#FFFDF8";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  // ----- 페이지 변경 시 저장된 그림 복원 (가능하면) -----
  useEffect(() => {
    const page = pages[selectedPageIndex];
    const canvas = canvasRef.current;
    if (!page || !canvas) return;

    const saved = sceneImages[page.id];
    const ctx = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.width / ratio;
    const height = canvas.height / ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.fillStyle = "#FFFDF8";
    ctx.fillRect(0, 0, width, height);

    if (saved) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = saved;
    }
  }, [pages, selectedPageIndex, sceneImages]);

  // ----- 렌더링 -----
  const currentPage = pages[selectedPageIndex];

  return (
    <>
      <Head>
        <title>{t.subtitle}</title>
      </Head>
      <div className="page-root">
        {/* 상단 헤더 */}
        <header className="page-header">
          <div>
            <h1>{t.title}</h1>
            <p style={{ marginTop: 4, color: "#8b6b4a" }}>{t.subtitle}</p>
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

        <section
          className="step-section"
          style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24 }}
        >
          {/* 좌측: 장면 선택 패널 */}
          <aside
            style={{
              background: "#fbe7c9",
              borderRadius: 24,
              padding: "20px 18px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              minHeight: 480,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                marginBottom: 12,
                fontSize: 18,
                color: "#5a3e27",
              }}
            >
              {t.sceneListTitle}
            </div>

            {loadingScenes ? (
              <div style={{ fontSize: 14, color: "#7a5b3c" }}>
                {t.loadingScenes}
              </div>
            ) : scenesError ? (
              <div
                style={{
                  fontSize: 13,
                  color: "#b3261e",
                  whiteSpace: "pre-wrap",
                }}
              >
                {t.scenesErrorPrefix}
                {scenesError}
              </div>
            ) : pages.length === 0 ? (
              <div style={{ fontSize: 13, color: "#7a5b3c" }}>{t.noScenes}</div>
            ) : (
              <div
                style={{
                  marginTop: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  overflowY: "auto",
                  paddingRight: 4,
                }}
              >
                {pages.map((page, idx) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => setSelectedPageIndex(idx)}
                    style={{
                      textAlign: "left",
                      borderRadius: 16,
                      padding: "10px 12px",
                      border:
                        idx === selectedPageIndex
                          ? "2px solid #f28c3a"
                          : "1px solid rgba(0,0,0,0.04)",
                      background:
                        idx === selectedPageIndex ? "#ffe8cb" : "#fff7eb",
                      boxShadow:
                        idx === selectedPageIndex
                          ? "0 4px 10px rgba(0,0,0,0.08)"
                          : "0 2px 6px rgba(0,0,0,0.04)",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        marginBottom: 4,
                        color: "#5a3e27",
                      }}
                    >
                      Page {idx + 1} · {page.title}
                    </div>
                    {page.caption && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#7a5b3c",
                          lineHeight: 1.3,
                        }}
                      >
                        {page.caption}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div
              style={{
                marginTop: "auto",
                fontSize: 11,
                color: "#8b6b4a",
                paddingTop: 12,
              }}
            >
              {t.tip}
            </div>
          </aside>

          {/* 우측: 캔버스 + 도구 */}
          <div
            ref={containerRef}
            style={{
              background: "#fbe7c9",
              borderRadius: 24,
              padding: 18,
              boxShadow: "0 12px 30px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              minHeight: 480,
            }}
          >
            {/* 상단 색 선택 & 버튼들 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#5a3e27",
                    marginRight: 4,
                  }}
                >
                  {t.colorsLabel}:
                </span>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {COLOR_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBrushColor(color)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "999px",
                        border:
                          brushColor === color
                            ? "3px solid #ffffff"
                            : "2px solid rgba(0,0,0,0.12)",
                        boxShadow:
                          brushColor === color
                            ? "0 0 0 3px rgba(242,140,58,0.8)"
                            : "0 2px 4px rgba(0,0,0,0.2)",
                        backgroundColor: color,
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <button
                  type="button"
                  onClick={handleFullScreen}
                  style={toolButtonStyle}
                >
                  {t.fullScreen}
                </button>
                <button
                  type="button"
                  onClick={handleLoadClick}
                  style={toolButtonStyle}
                >
                  {t.load}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  style={toolButtonStylePrimary}
                >
                  {t.save}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* 캔버스 */}
            <div
              style={{
                flex: 1,
                background: "#fff7eb",
                borderRadius: 20,
                padding: 12,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {currentPage && (
                <div
                  style={{
                    marginBottom: 8,
                    fontSize: 13,
                    color: "#7a5b3c",
                  }}
                >
                  <strong>
                    Page {selectedPageIndex + 1} · {currentPage.title}
                  </strong>
                  {currentPage.description && (
                    <span>: {currentPage.description}</span>
                  )}
                </div>
              )}

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    borderRadius: 18,
                    backgroundColor: "#FFFDF8",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                    touchAction: "none",
                  }}
                  onMouseDown={handlePointerDown}
                  onMouseMove={handlePointerMove}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                  onTouchStart={handlePointerDown}
                  onTouchMove={handlePointerMove}
                  onTouchEnd={endDrawing}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// 공용 버튼 스타일
const toolButtonStyle = {
  padding: "6px 10px",
  borderRadius: 999,
  border: "none",
  background: "#ffe1ba",
  color: "#5a3e27",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
};

const toolButtonStylePrimary = {
  ...toolButtonStyle,
  background: "#f28c3a",
  color: "#ffffff",
};
