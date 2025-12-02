// components/coloring/ColorPalette.js
// 3~5세 아이 기준: 크게, 누르기 쉬운 색상 버튼

export default function ColorPalette({ selectedColor, onSelectColor }) {
  const COLORS = [
    "#000000",
    "#5C5C5C",
    "#FFFFFF",
    "#FF4B4B",
    "#FF9F1C",
    "#FFD93D",
    "#2ECC71",
    "#1ABC9C",
    "#3498DB",
    "#6C5CE7",
    "#9B59B6",
    "#E84393",
    "#FF6F91",
    "#FF9671",
    "#FFC75F",
    "#F9F871",
    "#A3CB38",
    "#38ADA9",
    "#74B9FF",
  ];

  return (
    <div className="color-palette">
      <span className="color-palette-label">색 선택:</span>
      <div className="color-palette-grid">
        {COLORS.map((color) => {
          const isActive = color === selectedColor;
          return (
            <button
              key={color}
              type="button"
              className={`color-swatch ${isActive ? "color-swatch--active" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => onSelectColor?.(color)}
              aria-label={`색상 ${color}`}
            />
          );
        })}
      </div>
    </div>
  );
}
