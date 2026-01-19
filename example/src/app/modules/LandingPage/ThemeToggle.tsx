import React, { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";
type ColorTheme = "blue" | "green" | "purple" | "orange" | "pink";

const ThemeToggle: React.FC = () => {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [color, setColor] = useState<ColorTheme>("blue");

  const colorMap: Record<ColorTheme, string> = {
    blue: "#6366f1",
    green: "#10b981",
    purple: "#a855f7",
    orange: "#f97316",
    pink: "#ec4899",
  };

  const updateTheme = (themeMode: ThemeMode, themeColor: ColorTheme) => {
    const root = document.documentElement;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = themeMode === "dark" || (themeMode === "system" && prefersDark);
    root.setAttribute("data-theme", isDark ? "dark" : "light");

    // Set accent color
    root.style.setProperty("--accent", colorMap[themeColor]);
  };

  useEffect(() => {
    updateTheme(mode, color);
  }, [mode, color]);

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px 12px",
        zIndex: 1000,
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        width: "180px",
        fontSize: "14px",
      }}
    >
      <div style={{ marginBottom: "10px", fontWeight: 600 }}>Theme Mode:</div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        {["light", "dark", "system"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as ThemeMode)}
            style={{
              padding: "6px 10px",
              borderRadius: "5px",
              border: mode === m ? "2px solid black" : "1px solid #ccc",
              cursor: "pointer",
              background: "#f9fafb",
              flex: 1,
            }}
          >
            {m[0].toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ fontWeight: 600, marginBottom: "6px" }}>Color Theme:</div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {(Object.keys(colorMap) as ColorTheme[]).map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: color === c ? "2px solid black" : "1px solid #ccc",
              background: colorMap[c],
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
