// components/coloring/ColoringCanvas.js
// 단순 브러시 드로잉 캔버스 (Flood-fill 컬러링 전 단계, 뼈대용)

import React, { useEffect, useRef } from "react";

export default function ColoringCanvas({
  color = "#FF6B6B",
  lineWidth = 16,
}) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // 캔버스 초기 설정 및 색상 변경 반영
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
  }, [color, lineWidth]);

  const getPos = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if (event.touches && event.touches.length > 0) {
      const touch = event.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerDown = (event) => {
    event.preventDefault();
    const pos = getPos(event);
    lastPosRef.current = pos;
    isDrawingRef.current = true;
  };

  const handlePointerMove = (event) => {
    if (!isDrawingRef.current) return;
    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const newPos = getPos(event);
    const last = lastPosRef.current;

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(newPos.x, newPos.y);
    ctx.stroke();

    lastPosRef.current = newPos;
  };

  const handlePointerUp = (event) => {
    event.preventDefault();
    isDrawingRef.current = false;
  };

  const handlePointerLeave = (event) => {
    event.preventDefault();
    isDrawingRef.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className="coloring-canvas"
      width={1200}
      height={700}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerLeave}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    />
  );
}
