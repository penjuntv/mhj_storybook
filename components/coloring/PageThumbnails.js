// components/coloring/PageThumbnails.js
import React from "react";

export default function PageThumbnails({ pages, activePageId, onSelect }) {
  if (!pages || pages.length === 0) {
    return <div style={{ fontSize: 13 }}>아직 생성된 그림이 없습니다.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {pages.map((page, index) => {
        const isActive = page.id === activePageId;
        return (
          <button
            key={page.id}
            type="button"
            onClick={() => onSelect(page.id)}
            style={{
              borderRadius: 18,
              border: "none",
              padding: 6,
              background: isActive ? "#FFCC8A" : "#FFF5E5",
              boxShadow: isActive
                ? "0 0 0 2px rgba(255,140,65,0.7)"
                : "0 8px 20px rgba(0,0,0,0.06)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "3 / 4",
                borderRadius: 14,
                background: "#FFF",
                overflow: "hidden",
                marginBottom: 4,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={page.coloredDataUrl || page.imageUrl}
                alt={page.title || `page-${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#71411E",
              }}
            >
              {page.title || `Page ${index + 1}`}
            </div>
          </button>
        );
      })}
    </div>
  );
}
