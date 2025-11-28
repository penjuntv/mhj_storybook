// components/storybook/LanguageToggle.js

export default function LanguageToggle({ language, onChange }) {
  const buttonStyle = (active) => ({
    padding: "4px 12px",
    borderRadius: "999px",
    border: active ? "0" : "1px solid #d9a36b",
    background: active ? "#FF8C41" : "transparent",
    color: active ? "#fff" : "#7a4c25",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 600,
  });

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button
        type="button"
        style={buttonStyle(language === "en")}
        onClick={() => onChange("en")}
      >
        EN
      </button>
      <button
        type="button"
        style={buttonStyle(language === "ko")}
        onClick={() => onChange("ko")}
      >
        KO
      </button>
      <button
        type="button"
        style={buttonStyle(language === "zh")}
        onClick={() => onChange("zh")}
      >
        中文
      </button>
    </div>
  );
}
