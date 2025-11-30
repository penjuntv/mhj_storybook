// components/coloring/Toolbar.js
import React from "react";

export default function Toolbar({
  onToggleFullscreen,
  onSaveAll,
  onLoadAll,
  isFullscreen,
  labels,
}) {
  const { fullscreen, save, load } = labels || {};

  return (
    <div className="coloring-toolbar">
      <button type="button" onClick={onToggleFullscreen}>
        {fullscreen || "Fullscreen"}
      </button>
      <button type="button" onClick={onLoadAll}>
        {load || "Load"}
      </button>
      <button type="button" onClick={onSaveAll}>
        {save || "Save"}
      </button>
    </div>
  );
}
