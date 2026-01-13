import React, { useState } from "react";

const Pricing = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cardStyle = {
          maxWidth: "360px",
          margin: "0 auto",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          // boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
          overflow: "hidden",
          boxShadow: isHovered ? "0 6px 16px rgba(0,0,0,0.1)" : "0 4px 12px rgba(0,0,0,0.05)",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
  }
  return (
    <section
      style={{
        padding: "80px 20px",
        textAlign: "center",
        background: "linear-gradient(to bottom, #f9fbff, #f0f4ff)",
      }}
    >
      <h2
        style={{
          fontSize: "40px",
          fontWeight: 700,
          marginBottom: "16px",
          color: "#111827",
        }}
      >
        Simple, Transparent{" "}
        <span style={{ color: "var(--accent)"  }}>Pricing</span>
      </h2>

      <p
        style={{
          fontSize: "18px",
          color: "#6b7280",
          marginBottom: "50px",
        }}
      >
        Choose the perfect plan for your team. No hidden fees, cancel anytime.
      </p>

      <div
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Banner */}
        <div
          style={{
            background: "var(--accent)",
            padding: "8px",
            color: "white",
            fontWeight: 600,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ⭐ Most Popular
        </div>

        {/* Card Content */}
        <div style={{ padding: "30px 24px" }}>
          <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px", color: "#111827" }}>
            Professional
          </h3>
          <p
            style={{
              fontSize: "28px",
              fontWeight: 800,
              marginBottom: "4px",
              color: "#111827",
            }}
          >
            Yet to decide <span style={{ fontWeight: 400, fontSize: "16px" }}>per month</span>
          </p>
          <p style={{ color: "var(--accent)", fontSize: "14px", marginBottom: "24px" }}>
            Ideal for faster extraction
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              textAlign: "left",
              marginBottom: "30px",
              lineHeight: "1.8",
              color: "#374151",
              fontSize: "15px",
            }}
          >
            <li>✔ Easy documents management</li>
            <li>✔ Faster data extraction</li>
            <li>✔ Required clauses on your fingre tip</li>
            <li>✔ Multiple files extraction</li>
          </ul>

          <button
            style={{
              backgroundColor: "var(--accent)",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
            }}
          >
            Contact Sales
          </button>
        </div>
        
      </div>

      {/* Footer Note */}
      <p
        style={{
          marginTop: "30px",
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        All plans include a 14-day free trial. No credit card required.
      </p>
      <p
        style={{
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        Need a custom solution?{" "}
        <span style={{ color: "var(--accent)", fontWeight: 600 }}>Contact our sales team</span>
      </p>
    </section>
  );
};

export default Pricing;
