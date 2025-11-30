// components/coloring/ColorPalette.js
import React from "react";

export default function ColorPalette({ colors, selectedColor, onSelectColor }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: 12,
          marginRight: 4,
          color: "#7A4C25",
        }}
      >
        색 선택:
      </span>
      {colors.map((color) => {
        const isActive = selectedColor === color;
        return (
          <button
            key={color}
            type="button"
            onClick={() => onSelectColor(color)}
            style={{
              width: isActive ? 26 : 22,
              height: isActive ? 26 : 22,
              borderRadius: "50%",
              border: isActive ? "2px solid #5B3312" : "1px solid #D3B08B",
              background: color,
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
            }}
          />
        );
      })}
    </div>
  );
}
