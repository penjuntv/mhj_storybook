// components/coloring/ColorPalette.js
// 3~5세 아이용: 큰 동그라미 색상 버튼 16개 정도

const PALETTE = [
  "#000000", // black
  "#FF4B4B", // red
  "#FF8C00", // orange
  "#FFD447", // yellow
  "#4CAF50", // green
  "#00BCD4", // teal
  "#2196F3", // blue
  "#3F51B5", // indigo
  "#9C27B0", // purple
  "#E91E63", // pink
  "#795548", // brown
  "#9E9E9E", // gray
  "#FFFFFF", // white
];

export default function ColorPalette({ selectedColor, onSelectColor }) {
  return (
    <div className="color-palette">
      <span className="color-palette-label">색 선택:</span>
      <div className="color-palette-swatches">
        {PALETTE.map((color) => {
          const isActive = color === selectedColor;
          return (
            <button
              key={color}
              type="button"
              className={
                "color-swatch" + (isActive ? " color-swatch--active" : "")
              }
              style={{ backgroundColor: color }}
              onClick={() => onSelectColor(color)}
              aria-label={`색 ${color}`}
            />
          );
        })}
      </div>
    </div>
  );
}
