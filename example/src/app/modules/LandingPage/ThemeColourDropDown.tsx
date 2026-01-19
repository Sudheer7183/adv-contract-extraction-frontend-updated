// import React, { useState, useEffect, useRef } from "react";
// import { Palette } from "lucide-react"; // use any icon lib

// type ColorTheme = "blue" | "green" | "purple" | "orange" | "pink";

// const colorMap: Record<ColorTheme, string> = {
//   blue: "#6366f1",
//   green: "#10b981",
//   purple: "#a855f7",
//   orange: "#f97316",
//   pink: "#ec4899",
// };

// const ThemeColorDropdown: React.FC = () => {
//   const [open, setOpen] = useState(false);
//   const [selected, setSelected] = useState<ColorTheme>("blue");
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     document.documentElement.style.setProperty("--accent", colorMap[selected]);
//   }, [selected]);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div ref={dropdownRef} style={{ position: "relative" }}>
//       <button
//         onClick={() => setOpen(!open)}
//         style={{
//           background: "transparent",
//           border: "none",
//           cursor: "pointer",
//           padding: "6px",
//         }}
//       >
//         <Palette size={20} />
//       </button>

//       {open && (
//         <div
//           style={{
//             position: "absolute",
//             top: "110%",
//             right: 0,
//             background: "#fff",
//             border: "1px solid #e5e7eb",
//             borderRadius: "8px",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//             padding: "10px",
//             zIndex: 999,
//             width: "140px",
//           }}
//         >
//           {Object.entries(colorMap).map(([name, hex]) => (
//             <div
//               key={name}
//               onClick={() => {
//                 setSelected(name as ColorTheme);
//                 setOpen(false);
//               }}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 cursor: "pointer",
//                 padding: "6px 8px",
//                 borderRadius: "6px",
//                 backgroundColor: selected === name ? "#f3f4f6" : "transparent",
//                 marginBottom: "4px",
//               }}
//             >
//               <span
//                 style={{
//                   display: "inline-block",
//                   width: "12px",
//                   height: "12px",
//                   borderRadius: "50%",
//                   background: hex,
//                   marginRight: "8px",
//                 }}
//               ></span>
//               <span style={{ fontSize: "14px", textTransform: "capitalize" }}>{name}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ThemeColorDropdown;

import React, { useState, useEffect, useRef } from "react";
import { Palette } from "lucide-react"; // use any icon lib

type ColorTheme = "blue" | "green" | "purple" | "orange" | "pink";

// const colorMap: Record<ColorTheme, string> = {
//   blue: "#6366f1",
//   green: "#10b981",
//   purple: "#a855f7",
//   orange: "#f97316",
//   pink: "#ec4899",
// };

const colorMap: Record<ColorTheme, { hex: string; className: string }> = {
  blue: { hex: "#6366f1", className: "p-3 bg-primary text-white" },
  green: { hex: "#10b981", className: "p-3 bg-success text-white" },
  purple: { hex: "#a855f7", className: "p-3 bg-info text-white" },
  orange: { hex: "#f97316", className: "p-3 bg-warning text-dark" },
  pink: { hex: "#ec4899", className: "p-3 bg-danger text-white" },
};

const ThemeColorDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ColorTheme>("blue");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedName = localStorage.getItem("themeColorName") as ColorTheme;
    const savedHex = localStorage.getItem("themeColorHex");

    if (savedName && colorMap[savedName]) {
      setSelected(savedName);
      document.documentElement.style.setProperty("--accent", savedHex || colorMap[savedName].hex);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "6px",
        }}
      >
        <Palette size={20} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            right: 0,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "10px",
            zIndex: 999,
            width: "140px",
          }}
        >
          {Object.entries(colorMap).map(([name, color]) => (
            <div
              key={name}
              onClick={() => {
                setSelected(name as ColorTheme);
                localStorage.setItem("themeColorName", name);
                localStorage.setItem("themeColorHex", color.hex);
                localStorage.setItem("themeColor", color.className); // 🔥 stores className used in Colors.tsx
                document.documentElement.style.setProperty("--accent", color.hex);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "6px 8px",
                borderRadius: "6px",
                backgroundColor: selected === name ? "#f3f4f6" : "transparent",
                marginBottom: "4px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: color.hex,
                  marginRight: "8px",
                }}
              ></span>
              <span style={{ fontSize: "14px", textTransform: "capitalize" }}>{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeColorDropdown;
