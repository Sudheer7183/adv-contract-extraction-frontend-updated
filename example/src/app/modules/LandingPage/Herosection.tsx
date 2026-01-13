import React from "react";

const HeroSection: React.FC = () => {
  return (
    <div style={{
      background: "linear-gradient(to bottom right, #f0f4ff, #e6edff)",
      padding: "80px 20px",
      textAlign: "center"
    }}>
      <h1 style={{
        fontSize: "48px",
        fontWeight: 700,
        color: "#1a1a1a",
        marginBottom: "20px"
      }}>
        Transform Your <span style={{ color: "var(--accent)" }}>Business</span>
      </h1>

      <p style={{
        fontSize: "18px",
        color: "#555",
        maxWidth: "700px",
        margin: "0 auto 30px"
      }}>
        Effortlessly track key terms, dates, and obligations from all your contracts in a centralized repository.
      </p>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "16px",
        flexWrap: "wrap"
      }}>
        <button
        style={{
            backgroundColor: "var(--accent)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            cursor: "pointer"
        }}
        >
        Start Free Trial →
        </button>

        <button style={{
          padding: "12px 24px",
          background: "#fff",
          color: "#000",
          fontWeight: 600,
          fontSize: "16px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          cursor: "pointer"
        }}>
          ⏵ Watch Demo
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
