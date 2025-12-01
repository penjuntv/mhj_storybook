// components/coloring/ColorPalette.js
// 3~5세 아이용 기본 색 팔레트 – 컴포넌트 안에서 자체로 완결

import React from "react";

export const DEFAULT_COLORS = [
  "#000000", // black
  "#FF6B6B", // red
  "#FF9F43", // orange
  "#FFD93D", // yellow
  "#1DD1A1", // green
  "#54A0FF", // blue
  "#5F27CD", // indigo
  "#FF6B81", // pink
  "#FFFFFF", // white
  "#A3A3A3", // gray
];

export default function ColorPalette({ selectedColor, onChangeColor }) {
  const palette = DEFAULT_COLORS; // 항상 정의된 배열

  return (
    <div className="color-palette">
      {palette.map((color) => (
        <button
          key={color}
          type="button"
          className={
            "color-swatch" +
            (selectedColor === color ? " color-swatch--active" : "")
          }
          style={{ backgroundColor: color }}
          onClick={() => onChangeColor && onChangeColor(color)}
          aria-label={`색 선택: ${color}`}
        />
      ))}
    </div>
  );
}
