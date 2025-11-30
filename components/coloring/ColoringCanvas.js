// components/coloring/ColoringCanvas.js
import React, { useEffect, useRef } from "react";

// HEX -> [r,g,b]
function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean.length === 3 ? clean.replace(/(.)/g, "$1$1") : clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function withinTolerance(a, b, tolerance) {
  return Math.abs(a[0] - b[0]) <= tolerance &&
    Math.abs(a[1] - b[1]) <= tolerance &&
    Math.abs(a[2] - b[2]) <= tolerance;
}

function floodFill(ctx, x, y, fillColor, tolerance = 40) {
  const { width, height } = ctx.canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const startIdx = (y * width + x) * 4;
  const startColor = [data[startIdx], data[startIdx + 1], data[startIdx + 2]];

  // 선(검정/어두운색)은 채우지 않도록
  const lineThreshold = 80;
  if (
    startColor[0] < lineThreshold &&
    startColor[1] < lineThreshold &&
    startColor[2] < lineThreshold
  ) {
    return;
  }

  const stack = [[x, y]];
  const visited = new Uint8Array(width * height);
  const [fr, fg, fb] = fillColor;

  while (stack.length) {
    const [cx, cy] = stack.pop();
    if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;

    const idx = cy * width + cx;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const di = idx * 4;
    const current = [data[di], data[di + 1], data[di + 2]];

    if (!withinTolerance(current, startColor, tolerance)) continue;

    // 채우기
    data[di] = fr;
    data[di + 1] = fg;
    data[di + 2] = fb;
    data[di + 3] = 255;

    stack.push([cx + 1, cy]);
    stack.push([cx - 1, cy]);
    stack.push([cx, cy + 1]);
    stack.push([cx, cy - 1]);
  }

  ctx.putImageData(imageData, 0, 0);
}

export default function ColoringCanvas({
  imageUrl,
  coloredDataUrl,
  selectedColor,
  isFullscreen,
  onChangeDataUrl,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // 이미지 로드 & 캔버스 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
      const drawW = img.width * ratio;
      const drawH = img.height * ratio;
      const offsetX = (canvas.width - drawW) / 2;
      const offsetY = (canvas.height - drawH) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

      // onChangeDataUrl 에 초기 상태 전달 (선택)
      if (onChangeDataUrl) {
        try {
          const dataUrl = canvas.toDataURL("image/png");
          onChangeDataUrl(dataUrl);
        } catch {
          // ignore
        }
      }
    };
    img.src = coloredDataUrl || imageUrl;
  }, [imageUrl, coloredDataUrl, onChangeDataUrl]);

  // 클릭 / 터치 → 색 채우기
  const handlePointer = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;

    const x = Math.floor(((clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((clientY - rect.top) / rect.height) * canvas.height);

    floodFill(ctx, x, y, hexToRgb(selectedColor), 40);

    if (onChangeDataUrl) {
      try {
        const dataUrl = canvas.toDataURL("image/png");
        onChangeDataUrl(dataUrl);
      } catch {
        // ignore
      }
    }
  };

  const canvasWrapperStyle = isFullscreen
    ? {
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
      }
    : {
        position: "relative",
        width: "100%",
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };

  const canvasStyle = {
    width: "100%",
    maxWidth: isFullscreen ? 900 : 720,
    height: "auto",
    aspectRatio: "4 / 3",
    borderRadius: 22,
    boxShadow: "0 14px 30px rgba(0,0,0,0.15)",
    background: "#FFFFFF",
    touchAction: "none",
  };

  return (
    <div ref={containerRef} style={canvasWrapperStyle}>
      <canvas
        ref={canvasRef}
        width={1024}
        height={768}
        style={canvasStyle}
        onClick={handlePointer}
        onTouchStart={handlePointer}
      />
    </div>
  );
}
