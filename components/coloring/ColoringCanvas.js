// components/coloring/ColoringCanvas.js
// 정적 선그림 템플릿 위에 자유롭게 색칠하는 캔버스
// (마우스/터치 모두 지원)

import { useEffect, useRef } from "react";

export default function ColoringCanvas({
  strokeColor = "#FF4B4B",
  templateImageUrl = null,
}) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  // 배경(흰색 + 템플릿) 그리기 공통 함수
  const drawBackground = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 흰색 배경
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 선 스타일 기본값 설정
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 6;

    // 템플릿 이미지가 있다면 배경으로 그리기
    if (templateImageUrl) {
      const img = new Image();
      img.src = templateImageUrl;
      img.onload = () => {
        // 캔버스 전체에 맞게 그림
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      // onerror는 일단 무시 (이미지 없으면 그냥 흰 배경만)
    }
  };

  // 초기 마운트 & 템플릿 변경 시 배경 새로 그리기
  useEffect(() => {
    drawBackground();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateImageUrl]);

  // 그리기 이벤트 (마우스/터치)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

  // 지우기(배경 + 템플릿만 다시 그리고, 사용자가 그린 선은 모두 제거)
  const handleClear = () => {
    drawBackground();
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
