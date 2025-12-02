// components/coloring/ColoringCanvas.js
// 현재 버전: 브러시로 자유롭게 그리는 낙서 캔버스
// 이후 버전에서 "선 따기 + 영역 채우기" 컬러링 기능을 여기에 덧씌울 예정.

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 520;

export default function ColoringCanvas({ strokeColor = "#FF4B4B" }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 8;
    ctx.strokeStyle = strokeColor;
    ctxRef.current = ctx;

    // 하얀 배경
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = strokeColor;
    }
  }, [strokeColor]);

  const getOffsetPos = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handlePointerDown = (event) => {
    event.preventDefault();
    const pos = getOffsetPos(event);
    setLastPos(pos);
    setIsDrawing(true);
  };

  const handlePointerMove = (event) => {
    if (!isDrawing || !ctxRef.current) return;
    event.preventDefault();

    const pos = getOffsetPos(event);
    const ctx = ctxRef.current;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setLastPos(pos);
  };

  const handlePointerUp = (event) => {
    event.preventDefault();
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  return (
    <div className="coloring-canvas-container">
      <canvas
        ref={canvasRef}
        className="coloring-canvas"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />
      <button
        type="button"
        className="secondary-button canvas-clear-button"
        onClick={handleClear}
      >
        지우기
      </button>
    </div>
  );
}
