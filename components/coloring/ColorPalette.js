// components/coloring/ColorPalette.js
import React from "react";

export default function ColorPalette({ colors, selectedColor, onSelectColor }) {
  return (
    <div className="palette-grid">
      {colors.map((color) => {
        const isActive = color === selectedColor;
        return (
          <button
            key={color}
            type="button"
            className={`palette-swatch ${isActive ? "active" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => onSelectColor(color)}
          >
            {isActive && <span className="palette-swatch-inner" />}
          </button>
        );
      })}
    </div>
  );
}
