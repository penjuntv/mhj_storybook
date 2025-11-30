// pages/coloring.js

import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";

// 간단 i18n (필요한 텍스트만)
const I18N = {
  ko: {
    title: "STEP 3 · 색칠하기",
    subtitle: "AI Storybook – 색칠하기",
    noStory: "이전에 만든 동화가 전달되지 않았어요. 먼저 STEP 2에서 동화를 만든 뒤 다시 시도해 주세요.",
    generatingFromStory: "동화 내용을 바탕으로 색칠 페이지를 만드는 중입니다…",
    noPages: "아직 생성된 그림이 없습니다.",
    pageListTitle: "장면 선택",
    selectedPageNone: "선택된 페이지가 없습니다.",
    colorLabel: "색 선택",
    fullscreen: "전체 화면",
    exitFullscreen: "전체 화면 해제",
    load: "불러오기",
    save: "저장",
    tip: "팁: 태블릿/스마트폰에서는 가로 화면으로 돌리면 색칠하기 캔버스를 더 크게 볼 수 있습니다.",
  },
  en: {
    title: "STEP 3 · Coloring",
    subtitle: "AI Storybook – Coloring",
    noStory: "No story was passed in. Please create a story in STEP 2 first, then try again.",
    generatingFromStory: "Creating coloring pages from the story…",
    noPages: "No pages have been generated yet.",
    pageListTitle: "Scenes",
    selectedPageNone: "No page selected.",
    colorLabel: "Colors",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit fullscreen",
    load: "Load",
    save: "Save",
    tip: "Tip: On tablets/phones, rotate to landscape to see a larger canvas.",
  },
  zh: {
    title: "STEP 3 · 涂色",
    subtitle: "AI Storybook – 涂色",
    noStory: "没有收到故事内容。请先在 STEP 2 生成故事，然后再来这里涂色。",
    generatingFromStory: "正在根据故事生成涂色页面…",
    noPages: "还没有生成任何图片。",
    pageListTitle: "场景列表",
    selectedPageNone: "还没有选择页面。",
    colorLabel: "颜色选择",
    fullscreen: "全屏",
    exitFullscreen: "退出全屏",
    load: "读取",
    save: "保存",
    tip: "提示：在平板/手机上横屏可以看到更大的画布。",
  },
};

// 스토리 텍스트를 4~6개의 장면으로 쪼개기
function generatePagesFromStory(story) {
  if (!story) return [];

  const clean = story.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  // 문장 단위로 쪼개기
  const sentences = clean.split(/(?<=[.!?。？！？])\s+/).filter(Boolean);

  const minPages = 4;
  const maxPages = 6;

  let targetCount = sentences.length;
  if (targetCount < minPages) targetCount = sentences.length;
  else if (targetCount > maxPages) targetCount = maxPages;

  if (targetCount <= 0) return [];

  const chunkSize = Math.ceil(sentences.length / targetCount);
  const pages = [];

  for (let i = 0; i < sentences.length; i += chunkSize) {
    const chunkSentences = sentences.slice(i, i + chunkSize);
    const text = chunkSentences.join(" ");
    pages.push({
      id: `page-${pages.length + 1}`,
      title: `Page ${pages.length + 1}`,
      caption: text,
    });
  }

  return pages;
}

// 간단 색 팔레트
const PALETTE = [
  "#000000",
  "#ff8b66",
  "#f4b400",
  "#fbbc04",
  "#34a853",
  "#4285f4",
  "#7e57c2",
  "#ea4335",
  "#ffffff",
];

export default function ColoringPage() {
  const router = useRouter();

  const [locale, setLocale] = useState("ko");
  const t = useMemo(() => I18N[locale] || I18N.ko, [locale]);

  const [storyText, setStoryText] = useState("");
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState(null);

  const [selectedColor, setSelectedColor] = useState(PALETTE[1]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  // router에서 story / locale 받아오기
  useEffect(() => {
    if (!router.isReady) return;

    let loc = router.query.locale;
    if (typeof loc === "string" && I18N[loc]) {
      setLocale(loc);
    }

    let rawStory = router.query.story;
    if (Array.isArray(rawStory)) rawStory = rawStory[0];

    if (typeof rawStory === "string") {
      let decoded = rawStory;
      try {
        decoded = decodeURIComponent(rawStory);
      } catch {
        // 그냥 raw 사용
      }
      setStoryText(decoded);
      setIsGenerating(true);
      const generated = generatePagesFromStory(decoded);
      setPages(generated);
      if (generated[0]) {
        setSelectedPageId(generated[0].id);
      }
      setIsGenerating(false);
    }
  }, [router.isReady, router.query.story, router.query.locale]);

  const currentPage = pages.find((p) => p.id === selectedPageId) || null;

  // 캔버스 초기화 또는 저장된 그림 불러오기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentPage) return;

    const ctx = canvas.getContext("2d");

    // 캔버스 크기 설정 (고정 비율)
    const width = 900;
    const height = 540;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 기존 저장본이 있으면 불러오기
    if (typeof window !== "undefined") {
      const key = `mhj_coloring_${currentPage.id}`;
      const dataUrl = window.localStorage.getItem(key);

      if (dataUrl) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
        };
        img.src = dataUrl;
        return;
      }
    }

    // 기본 바탕색
    ctx.fillStyle = "#fffaf1";
    ctx.fillRect(0, 0, width, height);

    // 아주 연한 테두리
    ctx.strokeStyle = "#e0d0b8";
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, width - 16, height - 16);
  }, [selectedPageId, pages.length]);

  // 캔버스에 점 찍기(간단 붓)
  const drawDot = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseDown = (e) => {
    if (!currentPage) return;
    drawingRef.current = true;
    drawDot(e);
  };

  const handleMouseMove = (e) => {
    if (!drawingRef.current || !currentPage) return;
    drawDot(e);
  };

  const handleMouseUp = () => {
    drawingRef.current = false;
  };

  const handleMouseLeave = () => {
    drawingRef.current = false;
  };

  const handleSave = () => {
    if (!currentPage || !canvasRef.current) return;
    if (typeof window === "undefined") return;

    const key = `mhj_coloring_${currentPage.id}`;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    try {
      window.localStorage.setItem(key, dataUrl);
      // 나중에 토스트 등 추가 가능
    } catch {
      // 저장 실패는 조용히 무시
    }
  };

  const handleLoad = () => {
    if (!currentPage || !canvasRef.current) return;
    if (typeof window === "undefined") return;

    const key = `mhj_coloring_${currentPage.id}`;
    const dataUrl = window.localStorage.getItem(key);
    if (!dataUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      const width = canvas.width;
      const height = canvas.height;
      // 현재 width/height는 DPR 반영된 값이므로 그냥 꽉 채워서 그림
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = dataUrl;
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // ===== 렌더링 =====
  return (
    <>
      <Head>
        <title>{t.title}</title>
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background: "#fde7c7",
          display: "flex",
          justifyContent: "center",
          padding: "48px 16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1280px",
            background: "#fbe3bf",
            borderRadius: "32px",
            padding: "32px 40px 40px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          }}
        >
          {/* 헤더 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 24,
              gap: 16,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 28,
                  margin: 0,
                  color: "#5b3a20",
                  fontWeight: 800,
                }}
              >
                {t.title}
              </h1>
              <div
                style={{
                  fontSize: 18,
                  marginTop: 4,
                  fontWeight: 600,
                  color: "#7a4c28",
                }}
              >
                {t.subtitle}
              </div>
            </div>

            {/* 간단 언어 표시 (읽기 전용) */}
            <div
              style={{
                display: "inline-flex",
                borderRadius: 999,
                background: "#f7d6aa",
                padding: 4,
                gap: 4,
                fontSize: 12,
              }}
            >
              {["en", "ko", "zh"].map((code) => (
                <div
                  key={code}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: locale === code ? "#f47b39" : "transparent",
                    color: locale === code ? "#fffdf8" : "#7a4c28",
                    fontWeight: 600,
                  }}
                >
                  {code === "en" ? "EN" : code === "ko" ? "KO" : "中文"}
                </div>
              ))}
            </div>
          </div>

          {/* 스토리 없음 처리 */}
          {!storyText && (
            <p
              style={{
                marginTop: 12,
                marginBottom: 0,
                fontSize: 15,
                color: "#7a4c28",
              }}
            >
              {t.noStory}
            </p>
          )}

          {/* 메인 레이아웃 */}
          <div
            style={{
              marginTop: 20,
              background: "#fff7ec",
              borderRadius: 32,
              padding: 24,
              display: "flex",
              gap: 20,
              minHeight: 480,
            }}
          >
            {/* 좌측: 페이지 리스트 */}
            <div
              style={{
                width: 260,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#7a4c28",
                  marginBottom: 4,
                }}
              >
                {t.pageListTitle}
              </div>

              {isGenerating && (
                <div
                  style={{
                    fontSize: 14,
                    color: "#7a4c28",
                    padding: "8px 10px",
                    borderRadius: 16,
                    background: "#ffe2c4",
                  }}
                >
                  {t.generatingFromStory}
                </div>
              )}

              {!isGenerating && pages.length === 0 && (
                <div
                  style={{
                    fontSize: 14,
                    color: "#7a4c28",
                    padding: "8px 10px",
                    borderRadius: 16,
                    background: "#ffe2c4",
                  }}
                >
                  {t.noPages}
                </div>
              )}

              {!isGenerating && pages.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    maxHeight: 460,
                    overflowY: "auto",
                  }}
                >
                  {pages.map((page) => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => setSelectedPageId(page.id)}
                      style={{
                        textAlign: "left",
                        border: "none",
                        borderRadius: 20,
                        padding: "10px 12px",
                        background:
                          selectedPageId === page.id
                            ? "#f47b39"
                            : "rgba(255,255,255,0.9)",
                        color:
                          selectedPageId === page.id ? "#fffdf7" : "#7a4c28",
                        boxShadow:
                          selectedPageId === page.id
                            ? "0 6px 12px rgba(0,0,0,0.18)"
                            : "0 3px 8px rgba(0,0,0,0.08)",
                        cursor: "pointer",
                        transition: "transform 0.1s ease, box-shadow 0.1s ease",
                        fontSize: 13,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          marginBottom: 4,
                        }}
                      >
                        {page.title}
                      </div>
                      <div
                        style={{
                          opacity: 0.9,
                          lineHeight: 1.4,
                          maxHeight: 48,
                          overflow: "hidden",
                        }}
                      >
                        {page.caption}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 우측: 캔버스 & 툴 */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* 선택된 페이지 설명 */}
              <div
                style={{
                  minHeight: 60,
                  marginBottom: 4,
                  fontSize: 14,
                  color: "#7a4c28",
                  padding: "8px 10px",
                }}
              >
                {currentPage ? (
                  <>
                    <div
                      style={{
                        fontWeight: 700,
                        marginBottom: 4,
                        fontSize: 15,
                      }}
                    >
                      {currentPage.title}
                    </div>
                    <div style={{ lineHeight: 1.4 }}>{currentPage.caption}</div>
                  </>
                ) : (
                  <span>{t.selectedPageNone}</span>
                )}
              </div>

              {/* 색 팔레트 + 버튼들 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#7a4c28",
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    {t.colorLabel}:
                  </div>
                  {PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        border:
                          selectedColor === color
                            ? "3px solid #f47b39"
                            : "2px solid #f2d3ac",
                        background: color,
                        boxShadow:
                          selectedColor === color
                            ? "0 0 0 2px rgba(0,0,0,0.08)"
                            : "none",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    style={{
                      border: "none",
                      borderRadius: 999,
                      padding: "6px 14px",
                      background: "#ffe1bb",
                      color: "#7a4c28",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {isFullscreen ? t.exitFullscreen : t.fullscreen}
                  </button>
                  <button
                    type="button"
                    onClick={handleLoad}
                    style={{
                      border: "none",
                      borderRadius: 999,
                      padding: "6px 14px",
                      background: "#ffd59b",
                      color: "#7a4c28",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {t.load}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    style={{
                      border: "none",
                      borderRadius: 999,
                      padding: "6px 16px",
                      background: "#f47b39",
                      color: "#fffdf7",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {t.save}
                  </button>
                </div>
              </div>

              {/* 캔버스 영역 */}
              <div
                style={{
                  flex: 1,
                  marginTop: 8,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: 24,
                    padding: 12,
                    background: "#f9e7cf",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)",
                    width: isFullscreen ? "100%" : "auto",
                    maxWidth: "100%",
                    overflow: "auto",
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      display: "block",
                      borderRadius: 20,
                      cursor: currentPage ? "crosshair" : "default",
                      background: "#fffaf1",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 하단 팁 */}
          <div
            style={{
              marginTop: 18,
              fontSize: 13,
              color: "#7a4c28",
            }}
          >
            {t.tip}
          </div>
        </div>
      </div>
    </>
  );
}
