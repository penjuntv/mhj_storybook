// components/coloring/ColoringCanvas.js
// 아주 단순한 자유 그리기용 캔버스 (마우스/터치 모두 지원)

import { useEffect, useRef } from "react";

export default function ColoringCanvas({ strokeColor = "#FF4B4B" }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    // 기본 배경 흰색
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 6;
  }, []);

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
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="coloring-canvas-container">
      <canvas
        ref={canvasRef}
        className="coloring-canvas"
        width={800}
        height={480}
      />
      <button type="button" className="canvas-clear-button" onClick={handleClear}>
        지우기
      </button>
    </div>
  );
}
