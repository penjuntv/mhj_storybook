// components/coloring/ColoringCanvas.js
// AI가 만든 선 그림 위에 두꺼운 브러시로 색을 칠하는 캔버스

import { useEffect, useRef, useState } from "react";

// 3~5세 아이용 기본 색상 팔레트 20종
const PALETTE = [
  "#000000", // black (outline 강조용)
  "#FF4B4B", // red
  "#FF8C41", // orange
  "#FFD93B", // yellow
  "#8BC34A", // green
  "#00BCD4", // cyan
  "#2196F3", // blue
  "#3F51B5", // indigo
  "#9C27B0", // purple
  "#E91E63", // pink
  "#FFB6C1", // light pink
  "#FFE0B2", // peach
  "#FFF9C4", // light yellow
  "#C8E6C9", // light green
  "#B3E5FC", // light blue
  "#D1C4E9", // lavender
  "#795548", // brown
  "#9E9E9E", // grey
  "#FFFFFF", // white (지우개 느낌)
  "#F44336", // strong red
];

export default function ColoringCanvas({ imageUrl }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState("#FF8C41");
  const [isDrawing, setIsDrawing] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  // 캔버스 크기를 컨테이너에 맞게 설정
  useEffect(() => {
    function resizeCanvas() {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);

      canvas.width = size * devicePixelRatio;
      canvas.height = size * devicePixelRatio;

      const ctx = canvas.getContext("2d");
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(size * 0.02, 10); // 화면 크기에 비례한 두꺼운 브러시
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // 그리기 시작
  const startDrawing = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x - rect.left, y - rect.top);
    setIsDrawing(true);
  };

  // 그리기 중
  const draw = (x, y) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = currentColor;
    ctx.lineTo(x - rect.left, y - rect.top);
    ctx.stroke();
  };

  // 그리기 종료
  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.closePath();
    setIsDrawing(false);
  };

  // 마우스 이벤트
  const handleMouseDown = (e) => {
    e.preventDefault();
    startDrawing(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    draw(e.clientX, e.clientY);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  // 터치 이벤트
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    startDrawing(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    draw(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  // 전체 지우기
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const toggleFullScreen = () => {
    setFullScreen((prev) => !prev);
  };

  return (
    <div
      className={`coloring-canvas-root ${fullScreen ? "fullscreen" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        height: "100%",
      }}
    >
      {/* 상단 툴바 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          padding: "4px 6px",
          borderRadius: "10px",
          background: "#FFF3E3",
          border: "1px solid #F0C199",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            maxWidth: "70%",
          }}
        >
          {PALETTE.map((color) => {
            const active = color === currentColor;
            return (
              <button
                key={color}
                type="button"
                onClick={() => setCurrentColor(color)}
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  border: active ? "3px solid #333" : "2px solid #EEE0CE",
                  background: color,
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
                aria-label={`Choose color ${color}`}
              />
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            gap: "6px",
          }}
        >
          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: "6px 10px",
              borderRadius: "999px",
              border: "none",
              background: "#FFCDD2",
              color: "#A53333",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            다 지우기
          </button>
          <button
            type="button"
            onClick={toggleFullScreen}
            style={{
              padding: "6px 10px",
              borderRadius: "999px",
              border: "none",
              background: "#FFECB3",
              color: "#704424",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {fullScreen ? "작게 보기" : "크게 보기"}
          </button>
        </div>
      </div>

      {/* 메인 그림 영역 */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          borderRadius: "14px",
          overflow: "hidden",
          background: "#FFFFFF",
          border: "1px solid #E0D2C5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 배경 선 그림 */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="coloring-line-art"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />
        ) : null}

        {/* 색칠용 캔버스 */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            touchAction: "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      {fullScreen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
            boxSizing: "border-box",
          }}
          onClick={toggleFullScreen}
        >
          <div
            style={{
              width: "min(90vw, 90vh)",
              height: "min(90vw, 90vh)",
              background: "#FFF9F0",
              borderRadius: "18px",
              padding: "10px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ColoringCanvasInnerFull imageUrl={imageUrl} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 전체 화면 모드용 내부 캔버스 (코드 중복을 피하기 위해 간단 버전으로 별도 구성)
 */
function ColoringCanvasInnerFull({ imageUrl }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState("#FF8C41");
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    function resizeCanvas() {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      canvas.width = size * devicePixelRatio;
      canvas.height = size * devicePixelRatio;

      const ctx = canvas.getContext("2d");
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(size * 0.025, 12);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const startDrawing = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x - rect.left, y - rect.top);
    setIsDrawing(true);
  };

  const draw = (x, y) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = currentColor;
    ctx.lineTo(x - rect.left, y - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.closePath();
    setIsDrawing(false);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    startDrawing(e.clientX, e.clientY);
  };
  const handleMouseMove = (e) => {
    e.preventDefault();
    draw(e.clientX, e.clientY);
  };
  const handleMouseUp = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const t = e.touches[0];
    if (!t) return;
    startDrawing(t.clientX, t.clientY);
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
    const t = e.touches[0];
    if (!t) return;
    draw(t.clientX, t.clientY);
  };
  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <>
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
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            maxWidth: "70%",
          }}
        >
          {PALETTE.map((color) => {
            const active = color === currentColor;
            return (
              <button
                key={color}
                type="button"
                onClick={() => setCurrentColor(color)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: active ? "3px solid #333" : "2px solid #EEE0CE",
                  background: color,
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              />
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleClear}
          style={{
            padding: "6px 10px",
            borderRadius: "999px",
            border: "none",
            background: "#FFCDD2",
            color: "#A53333",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          다 지우기
        </button>
      </div>

      <div
        ref={containerRef}
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          borderRadius: "14px",
          overflow: "hidden",
          background: "#FFFFFF",
          border: "1px solid #E0D2C5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="coloring-line-art-full"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />
        )}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            touchAction: "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </>
  );
}
