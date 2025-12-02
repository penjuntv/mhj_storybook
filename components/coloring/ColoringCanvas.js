// components/coloring/ColoringCanvas.js
// 선그림(배경 이미지) 위에 자유롭게 색칠하는 캔버스 (마우스/터치 지원)

import { useEffect, useRef } from "react";

export default function ColoringCanvas({
  strokeColor = "#FF4B4B",
  backgroundImageUrl,
}) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const backgroundImageRef = useRef(null);

  const initCanvasBase = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // 흰 배경 + 선 스타일 기본값
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 6;

    // 배경 이미지가 있다면 다시 그려줌
    if (backgroundImageRef.current) {
      drawBackgroundImage(ctx, backgroundImageRef.current, canvas);
    }
  };

  const drawBackgroundImage = (ctx, img, canvas) => {
    if (!img || !canvas) return;
    const { width, height } = canvas;

    // 비율 유지하면서 중앙 배치
    const scale = Math.min(width / img.width, height / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // 1) 최초 캔버스 초기화
  useEffect(() => {
    initCanvasBase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) 배경 이미지가 바뀔 때마다 로드해서 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (!backgroundImageUrl) {
      backgroundImageRef.current = null;
      initCanvasBase();
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      backgroundImageRef.current = img;
      // 흰 배경 + 이미지 다시 그림
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawBackgroundImage(ctx, img, canvas);
    };
    img.onerror = (e) => {
      console.error("Failed to load background image", e);
      backgroundImageRef.current = null;
      initCanvasBase();
    };
    img.src = backgroundImageUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundImageUrl]);

  // 3) 드로잉 이벤트
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches && e.touches[0]) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleDown = (e) => {
      e.preventDefault();
      isDrawingRef.current = true;
      const pos = getPos(e);
      lastPointRef.current = pos;
    };

    const handleMove = (e) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();

      const pos = getPos(e);
      const last = lastPointRef.current;

      ctx.strokeStyle = strokeColor;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      lastPointRef.current = pos;
    };

    const handleUp = (e) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      isDrawingRef.current = false;
    };

    canvas.addEventListener("mousedown", handleDown);
    canvas.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    canvas.addEventListener("touchstart", handleDown, { passive: false });
    canvas.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);

    return () => {
      canvas.removeEventListener("mousedown", handleDown);
      canvas.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);

      canvas.removeEventListener("touchstart", handleDown);
      canvas.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [strokeColor]);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // 흰 배경 초기화 후, 배경 이미지는 다시 그림
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (backgroundImageRef.current) {
      drawBackgroundImage(ctx, backgroundImageRef.current, canvas);
    }
  };

  return (
    <div className="coloring-canvas-container">
      <canvas
        ref={canvasRef}
        className="coloring-canvas"
        width={800}
        height={480}
      />
      <button
        type="button"
        className="canvas-clear-button"
        onClick={handleClear}
      >
        지우기
      </button>
    </div>
  );
}
