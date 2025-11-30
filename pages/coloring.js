// pages/coloring.js
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import PageThumbnails from "../components/coloring/PageThumbnails";
import ColorPalette from "../components/coloring/ColorPalette";
import ColoringCanvas from "../components/coloring/ColoringCanvas";

const FALLBACK_PAGES = [
  {
    id: "sample-1",
    title: "Sample 1",
    imageUrl:
      "https://images.pexels.com/photos/110975/pexels-photo-110975.jpeg?auto=compress&cs=tinysrgb&w=600", // 나중에 진짜 라인아트로 교체
  },
  {
    id: "sample-2",
    title: "Sample 2",
    imageUrl:
      "https://images.pexels.com/photos/110935/pexels-photo-110935.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const DEFAULT_COLORS = [
  "#000000",
  "#FF6B6B",
  "#FFA94D",
  "#FFD43B",
  "#82C91E",
  "#15AABF",
  "#4C6EF5",
  "#7048E8",
  "#F783AC",
  "#FFFFFF",
];

const CONTAINER_STYLE = {
  minHeight: "100vh",
  background: "#FFEBD2",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "40px 16px 32px",
  boxSizing: "border-box",
};

const INNER_STYLE = {
  width: "100%",
  maxWidth: 1280,
  background: "#FFE3C1",
  borderRadius: 28,
  boxShadow: "0 22px 55px rgba(0,0,0,0.08)",
  padding: "28px 24px 24px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

export default function ColoringPage() {
  const router = useRouter();
  const { session } = router.query; // /coloring?session=xxxx

  const [storyTitle, setStoryTitle] = useState("AI Storybook – 색칠하기");
  const [storySummary, setStorySummary] = useState("");
  const [pages, setPages] = useState([]);
  const [activePageId, setActivePageId] = useState(null);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[1]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1) 세션 데이터 로드
  useEffect(() => {
    if (!session || typeof window === "undefined") return;

    const key = `mhj-coloring-session-${session}`;
    const raw = window.localStorage.getItem(key);

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.storyTitle) setStoryTitle(parsed.storyTitle);
        if (parsed.storySummary) setStorySummary(parsed.storySummary);
        if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
          setPages(parsed.pages);
          setActivePageId(parsed.pages[0].id);
          return;
        }
      } catch (e) {
        console.warn("Failed to parse coloring session:", e);
      }
    }

    // fallback (세션 데이터가 아직 없을 때)
    setPages(FALLBACK_PAGES);
    setActivePageId(FALLBACK_PAGES[0].id);
  }, [session]);

  const activePage = useMemo(
    () => pages.find((p) => p.id === activePageId) || pages[0],
    [pages, activePageId]
  );

  // 2) 현재 페이지 캔버스가 변경될 때 dataURL 저장
  const handleUpdatePageImage = (dataUrl) => {
    if (!activePage) return;
    setPages((prev) =>
      prev.map((p) => (p.id === activePage.id ? { ...p, coloredDataUrl: dataUrl } : p))
    );
  };

  // 3) 수동 저장 버튼 (localStorage)
  const handleSaveSession = () => {
    if (typeof window === "undefined") return;

    const key = `mhj-coloring-session-${session || "demo"}`;
    const payload = {
      storyTitle,
      storySummary,
      pages,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(key, JSON.stringify(payload));
    alert("색칠한 그림이 이 기기(LocalStorage)에 저장되었습니다.");
  };

  // 4) 불러오기 버튼 (이미 위에서 자동 로딩함. 여기선 강제 리로드 용도)
  const handleReloadSession = () => {
    if (typeof window === "undefined") return;
    if (!session) {
      alert("session 파라미터가 없는 데모 모드입니다.");
      return;
    }
    const key = `mhj-coloring-session-${session}`;
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      alert("저장된 색칠 데이터가 없습니다.");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
        setPages(parsed.pages);
        setActivePageId(parsed.pages[0].id);
        if (parsed.storyTitle) setStoryTitle(parsed.storyTitle);
        if (parsed.storySummary) setStorySummary(parsed.storySummary);
      }
    } catch (e) {
      alert("저장 데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={CONTAINER_STYLE}>
      <div style={INNER_STYLE}>
        {/* 헤더 */}
        <header
          style={{
            marginBottom: 4,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 6,
              color: "#5B3312",
            }}
          >
            STEP 3 · 색칠하기
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 4,
              color: "#4A2A10",
            }}
          >
            {storyTitle}
          </div>
          {storySummary && (
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.5,
                color: "#7A4C25",
                margin: 0,
              }}
            >
              {storySummary}
            </p>
          )}
        </header>

        {/* 메인 레이아웃 */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
          }}
        >
          {/* 좌측 썸네일 / 모바일에선 상단으로 보이도록 CSS에서 처리 */}
          <div
            style={{
              flexShrink: 0,
              width: 180,
              maxHeight: 520,
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            <PageThumbnails
              pages={pages}
              activePageId={activePageId}
              onSelect={(id) => setActivePageId(id)}
            />
          </div>

          {/* 우측 캔버스 영역 */}
          <div
            style={{
              flex: 1,
              minHeight: 320,
              background: "#FFF7EE",
              borderRadius: 24,
              boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
              padding: 16,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {activePage ? (
              <ColoringCanvas
                key={activePage.id}
                imageUrl={activePage.imageUrl}
                coloredDataUrl={activePage.coloredDataUrl}
                selectedColor={selectedColor}
                isFullscreen={isFullscreen}
                onChangeDataUrl={handleUpdatePageImage}
              />
            ) : (
              <div style={{ padding: 20, fontSize: 14 }}>선택된 페이지가 없습니다.</div>
            )}

            {/* 팔레트 & 버튼들 */}
            <div
              style={{
                marginTop: 4,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <ColorPalette
                colors={DEFAULT_COLORS}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginLeft: "auto",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsFullscreen((v) => !v)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    border: "none",
                    background: "#FFF0DA",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {isFullscreen ? "일반 화면" : "전체 화면"}
                </button>
                <button
                  type="button"
                  onClick={handleReloadSession}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    border: "none",
                    background: "#FFE0B2",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  불러오기
                </button>
                <button
                  type="button"
                  onClick={handleSaveSession}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: "none",
                    background: "#FF8C41",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 작은 화면용 안내 (반응형 튜닝은 CSS로 추가 가능) */}
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            color: "#A46A3A",
          }}
        >
          팁: 태블릿/스마트폰에서는 가로 화면으로 돌리면 색칠하기 캔버스를 더 크게 볼 수 있습니다.
        </div>
      </div>
    </div>
  );
}
