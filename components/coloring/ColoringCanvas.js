// components/coloring/ColoringCanvas.js
import React, { useEffect, useRef } from "react";

/**
 * hex 색상 -> [r,g,b,a]
 */
function hexToRgba(hex) {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return [r, g, b, 255];
}

/**
 * 유사 색인지 검사 (단일 픽셀)
 */
function isSameColor(data, index, target, tolerance) {
  const dr = data[index] - target[0];
  const dg = data[index + 1] - target[1];
  const db = data[index + 2] - target[2];
  const da = data[index + 3] - target[3];
  const dist = Math.sqrt(dr * dr + dg * dg + db * db + da * da);
  return dist <= tolerance;
}

/**
 * Flood-fill 알고리즘 (4방향)
 */
function floodFill(ctx, x, y, fillColor, tolerance = 32) {
  const { width, height } = ctx.canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const targetIndex = (y * width + x) * 4;
  const targetColor = [
    data[targetIndex],
    data[targetIndex + 1],
    data[targetIndex + 2],
    data[targetIndex + 3],
  ];

  const newColor = fillColor;

  // 이미 같은 색이면 아무 것도 안 함
  if (
    targetColor[0] === newColor[0] &&
    targetColor[1] === newColor[1] &&
    targetColor[2] === newColor[2] &&
    targetColor[3] === newColor[3]
  ) {
    return;
  }

  const stack = [[x, y]];
  const visited = new Uint8Array(width * height);

  while (stack.length > 0) {
    const [cx, cy] = stack.pop();
    if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;

    const idx = cy * width + cx;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const i4 = idx * 4;
    if (!isSameColor(data, i4, targetColor, tolerance)) continue;

    data[i4] = newColor[0];
    data[i4 + 1] = newColor[1];
    data[i4 + 2] = newColor[2];
    data[i4 + 3] = newColor[3];

    stack.push([cx + 1, cy]);
    stack.push([cx - 1, cy]);
    stack.push([cx, cy + 1]);
    stack.push([cx, cy - 1]);
  }

  ctx.putImageData(imageData, 0, 0);
}

export default function ColoringCanvas({
  page,
  selectedColor,
  savedImage,
  onChangeImage,
}) {
  const canvasRef = useRef(null);
  const bgCanvasRef = useRef(null);

  // 라인 아트 로딩
  useEffect(() => {
    const canvas = canvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    if (!canvas || !bgCanvas) return;

    const ctx = canvas.getContext("2d");
    const bgCtx = bgCanvas.getContext("2d");

    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 500;
    canvas.width = width;
    canvas.height = height;
    bgCanvas.width = width;
    bgCanvas.height = height;

    ctx.clearRect(0, 0, width, height);
    bgCtx.clearRect(0, 0, width, height);

    if (!page || !page.lineArtUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const ratio = Math.min(width / img.width, height / img.height);
      const drawW = img.width * ratio;
      const drawH = img.height * ratio;
      const offsetX = (width - drawW) / 2;
      const offsetY = (height - drawH) / 2;

      bgCtx.drawImage(img, offsetX, offsetY, drawW, drawH);

      if (savedImage) {
        const saved = new Image();
        saved.onload = () => {
          ctx.drawImage(saved, 0, 0, width, height);
        };
        saved.src = savedImage;
      }
    };
    img.src = page.lineArtUrl;
  }, [page, savedImage]);

  // 클릭 시 채우기
  const handleClick = (event) => {
    if (!page) return;
    const canvas = canvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    if (!canvas || !bgCanvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) * canvas.width) / rect.width);
    const y = Math.floor(((event.clientY - rect.top) * canvas.height) / rect.height);

    // 배경과 현재 색을 합친 캔버스에서 flood fill
    const mergeCanvas = document.createElement("canvas");
    mergeCanvas.width = canvas.width;
    mergeCanvas.height = canvas.height;
    const mergeCtx = mergeCanvas.getContext("2d");
    mergeCtx.drawImage(bgCanvas, 0, 0);
    mergeCtx.drawImage(canvas, 0, 0);

    const fillColor = hexToRgba(selectedColor);
    floodFill(mergeCtx, x, y, fillColor, 28);

    // 결과를 다시 canvas에 그리기 (라인은 bgCanvas, 색은 canvas)
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mergeCanvas, 0, 0);

    if (typeof onChangeImage === "function") {
      const dataUrl = canvas.toDataURL("image/png");
      onChangeImage(page.id, dataUrl);
    }
  };

  if (!page) {
    return <div className="canvas-placeholder">아직 선택된 페이지가 없습니다.</div>;
  }

  return (
    <div className="coloring-canvas-inner">
      {/* 배경 라인 아트 캔버스 */}
      <canvas ref={bgCanvasRef} className="coloring-bg-canvas" />

      {/* 색칠 캔버스 (위 레이어) */}
      <canvas
        ref={canvasRef}
        className="coloring-main-canvas"
        onClick={handleClick}
      />
    </div>
  );
}
