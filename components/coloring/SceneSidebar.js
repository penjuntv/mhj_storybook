// components/coloring/SceneSidebar.js
import React from "react";

export default function SceneSidebar({
  pages,
  selectedPageId,
  onSelectPage,
  locale,
}) {
  if (!pages || pages.length === 0) return null;

  return (
    <div className="scene-sidebar-list">
      {pages.map((page) => {
        const isActive = page.id === selectedPageId;
        return (
          <button
            key={page.id}
            type="button"
            className={`scene-card ${isActive ? "active" : ""}`}
            onClick={() => onSelectPage(page.id)}
          >
            <div className="scene-card-thumb">
              {page.lineArtUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={page.lineArtUrl} alt={page.title} />
              ) : (
                <div className="scene-card-thumb-placeholder">…</div>
              )}
            </div>
            <div className="scene-card-text">
              <div className="scene-card-title">{page.title}</div>
              <div className="scene-card-summary">{page.summary}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
