// pages/coloring.js
// STEP 3: AI가 만든 동화를 기반으로 컬러링 페이지 구성

import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import ColoringCanvas from "../components/coloring/ColoringCanvas";

export default function ColoringPage() {
  const [loadingStory, setLoadingStory] = useState(true);
  const [storyData, setStoryData] = useState(null); // { story, createdAt }
  const [error, setError] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [scenes, setScenes] = useState([]); // [{ index, prompt, imageUrl }]
  const [selectedIndex, setSelectedIndex] = useState(0);

  // localStorage에서 스토리 읽기
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem("mhj_coloring_story_v1");
      if (!raw) {
        setError(
          "먼저 첫 번째 페이지에서 AI로 동화를 만든 뒤, '이 동화를 색칠 놀이 하기' 버튼을 눌러 주세요."
        );
        setLoadingStory(false);
        return;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.story !== "string") {
        setError(
          "저장된 동화를 불러올 수 없습니다. 다시 동화를 생성한 뒤 색칠 페이지로 이동해 주세요."
        );
        setLoadingStory(false);
        return;
      }

      setStoryData({
        story: parsed.story,
        createdAt: parsed.createdAt || null,
      });
      setLoadingStory(false);
    } catch (e) {
      console.error("Failed to load story from localStorage:", e);
      setError(
        "스토리를 불러오는 중 문제가 발생했습니다. 다시 동화를 생성해 주세요."
      );
      setLoadingStory(false);
    }
  }, []);

  const handleGenerateScenes = useCallback(async () => {
    if (!storyData || !storyData.story) return;

    setError("");
    setIsGenerating(true);
    setScenes([]);
    setSelectedIndex(0);

    try {
      const res = await fetch("/api/generateColoringImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story: storyData.story,
          maxScenes: 4,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.scenes || !Array.isArray(data.scenes) || data.scenes.length === 0) {
        throw new Error("이미지를 생성하지 못했습니다.");
      }

      setScenes(data.scenes);
      setSelectedIndex(0);
    } catch (err) {
      console.error("generateColoringImages failed:", err);
      setError(
        "색칠용 그림을 만드는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setIsGenerating(false);
    }
  }, [storyData]);

  const hasStory = !!storyData && typeof storyData.story === "string";

  const selectedScene =
    scenes && scenes.length > 0
      ? scenes.find((s) => s.index === selectedIndex) || scenes[0]
      : null;

  return (
    <>
      <Head>
        <title>AI Storybook – Step 3 · 색칠 놀이</title>
      </Head>

      <div
        className="coloring-page-root"
        style={{
          minHeight: "100vh",
          padding: "16px",
          boxSizing: "border-box",
          background: "#FFF7EC",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 상단 헤더 */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              Step 3 · 색칠 놀이
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: "#704424",
              }}
            >
              오늘 만든 영어 동화를 바탕으로 AI가 만든 그림에 색을 칠해요.
            </p>
          </div>

          <Link href="/" legacyBehavior>
            <a
              style={{
                fontSize: "13px",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "999px",
                border: "1px solid #E0B489",
                background: "#FFF3E3",
                color: "#704424",
              }}
            >
              ← 단어·동화 만들기 화면으로
            </a>
          </Link>
        </header>

        {/* 에러 메시지 */}
        {error && (
          <div
            style={{
              marginBottom: "12px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "#FFE0E0",
              color: "#A53333",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        {/* 스토리 로딩 상태 */}
        {loadingStory ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            저장된 동화를 불러오는 중입니다…
          </div>
        ) : !hasStory ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: "12px" }}>
              저장된 동화가 없습니다. 먼저 첫 페이지에서 동화를 만들어 주세요.
            </p>
            <Link href="/" legacyBehavior>
              <a
                style={{
                  padding: "10px 18px",
                  borderRadius: "999px",
                  border: "none",
                  background: "#FF8C41",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "14px",
                  textDecoration: "none",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                }}
              >
                동화 만들기 화면으로 가기
              </a>
            </Link>
          </div>
        ) : (
          // 본문 레이아웃
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              minHeight: 0,
            }}
          >
            {/* 좌측: 장면 선택 + 생성 버튼 */}
            <aside
              style={{
                width: "260px",
                minWidth: "220px",
                maxWidth: "280px",
                background: "#FFF2DD",
                borderRadius: "18px",
                padding: "12px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  marginBottom: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#704424",
                }}
              >
                오늘의 동화
              </div>
              <div
                style={{
                  fontSize: "11px",
                  lineHeight: 1.4,
                  maxHeight: "110px",
                  overflow: "auto",
                  padding: "8px",
                  borderRadius: "10px",
                  background: "#FFF9F0",
                  border: "1px solid #F4C79E",
                  whiteSpace: "pre-wrap",
                }}
              >
                {storyData.story}
              </div>

              <button
                type="button"
                onClick={handleGenerateScenes}
                disabled={isGenerating}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: isGenerating ? "default" : "pointer",
                  background: isGenerating ? "#FFB27A" : "#FF8C41",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  boxShadow: "0 6px 12px rgba(0,0,0,0.12)",
                }}
              >
                {isGenerating ? "그림을 만드는 중입니다…" : "이 이야기로 색칠 그림 만들기"}
              </button>

              <div
                style={{
                  marginTop: "12px",
                  marginBottom: "4px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#704424",
                }}
              >
                장면 선택
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >
                {scenes.length === 0 ? (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9B6A3B",
                      padding: "6px 2px",
                    }}
                  >
                    “이 이야기로 색칠 그림 만들기” 버튼을 눌러 AI가 장면별 그림을
                    만들게 해 주세요.
                  </div>
                ) : (
                  scenes.map((scene) => {
                    const active = scene.index === selectedIndex;
                    return (
                      <button
                        key={scene.index}
                        type="button"
                        onClick={() => setSelectedIndex(scene.index)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          border: active
                            ? "2px solid #FF8C41"
                            : "1px solid #F0C199",
                          borderRadius: "14px",
                          padding: "6px",
                          marginBottom: "8px",
                          background: active ? "#FFF6EA" : "#FFFDF8",
                          cursor: "pointer",
                          display: "flex",
                          gap: "8px",
                          boxSizing: "border-box",
                        }}
                      >
                        {scene.imageUrl ? (
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "12px",
                              overflow: "hidden",
                              background: "#FFF",
                              flexShrink: 0,
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={scene.imageUrl}
                              alt={`Scene ${scene.index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "12px",
                              background: "#F5D7AA",
                              flexShrink: 0,
                            }}
                          />
                        )}

                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              marginBottom: "2px",
                              color: "#704424",
                            }}
                          >
                            장면 {scene.index + 1}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: "#8F6234",
                              maxHeight: "42px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {scene.prompt}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            {/* 우측: 메인 색칠 영역 */}
            <main
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                background: "#FFF9F0",
                borderRadius: "18px",
                padding: "12px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#704424",
                  }}
                >
                  색칠하기 화면
                  {selectedScene && (
                    <span style={{ fontSize: "12px", marginLeft: "6px" }}>
                      (장면 {selectedScene.index + 1})
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  borderRadius: "16px",
                  border: "1px solid #F0C199",
                  background: "#FFFFFF",
                  padding: "8px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {scenes.length === 0 ? (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      color: "#9B6A3B",
                      textAlign: "center",
                      padding: "0 16px",
                    }}
                  >
                    먼저 왼쪽에서 “이 이야기로 색칠 그림 만들기” 버튼을 눌러
                    그림을 만들어 주세요.
                  </div>
                ) : !selectedScene ? (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                    }}
                  >
                    장면을 선택해 주세요.
                  </div>
                ) : (
                  <ColoringCanvas imageUrl={selectedScene.imageUrl} />
                )}
              </div>
            </main>
          </div>
        )}
      </div>
    </>
  );
}
