// import React from "react";

// const features = [
//   { title: "Central Repository", desc: "All your contracts in one place." },
//   { title: "Auto Reminders", desc: "Never miss a renewal or deadline." },
//   { title: "Analytics Dashboard", desc: "Visualize your contract data." }
// ];

// const Features = () => {
//   return (
//     <section style={{ padding: "80px 20px", background: "#ffffff" }}>
//       <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: 700, marginBottom: "40px" }}>Features</h2>
//       <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
//         {features.map((f, i) => (
//           <div key={i} style={{ flex: "1", minWidth: "250px", maxWidth: "300px", background: "#f0f4ff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
//             <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "10px" }}>{f.title}</h3>
//             <p style={{ fontSize: "16px", color: "#555" }}>{f.desc}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Features;

import React, { useState } from "react";
import {
  FaFileContract,
  FaFolder,
  FaClock,
  FaHandshake
} from "react-icons/fa";

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;  // changed from string
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
}

const features: Feature[] = [
  {
    title: "Auto Extraction",
    description: "Extract key fields from contracts instantly using AI.",
    icon: <FaFileContract />
  },
  {
    title: "Smart Repository",
    description: "Search and manage all your legal documents in one place.",
    icon: <FaFolder />
  },
  // {
  //   title: "Alerts & Notifications",
  //   description: "Never miss a renewal date or compliance deadline.",
  //   icon: <FaClock />
  // },
  {
    title: "Work Flow",
    description: "Share and assign contracts to your legal and finance teams.",
    icon: <FaHandshake />
  }
];

const testimonials: Testimonial[] = [
  {
    name: "Anita Sharma",
    role: "Legal Head, Hightower Corp.",
    text: "This tool has transformed how we manage contracts. It's fast, reliable, and saves hours every week."
  },
  {
    name: "Ravi Iyer",
    role: "CFO, FinEdge",
    text: "From renewals to compliance, everything’s automated. Our legal team is in love with this solution."
  }
];

const FeaturesSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cardStyle = {
    padding: "24px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    boxShadow: isHovered ? "0 6px 16px rgba(0,0,0,0.1)" : "0 4px 12px rgba(0,0,0,0.05)",
    textAlign: "left",
    backgroundColor: "#f9f9ff",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    transform: isHovered ? "scale(1.05)" : "scale(1)",  // Optional: to scale the card when hovered
  };

  return (
    <div>
      {/* Features Section */}
      <div style={{
        backgroundColor: "#ffffff",
        padding: "80px 20px",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: "36px",
          fontWeight: 700,
          marginBottom: "16px",
          color: "#1a1a1a"
        }}>
          Powerful Features to<span style={{ color: "var(--accent)" }}> Supercharge Your Workflow</span>
        </h2>

        <p style={{
          fontSize: "18px",
          color: "#555",
          maxWidth: "700px",
          margin: "0 auto 40px"
        }}>
          Everything you need to track, manage, and stay ahead of your contracts.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "32px",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          {features.map((feature, index) => (
            <div key={index} style={cardStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            >
              <div style={{
                fontSize: "32px",
                marginBottom: "16px",
                color: "var(--accent)",

              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: "20px",
                fontWeight: 600,
                marginBottom: "8px",
                color: "#1a1a1a"
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: "16px",
                color: "#555"
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Section */}
      {/* <div style={{
        backgroundColor: "#f4f4fc",
        padding: "80px 20px",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: "32px",
          fontWeight: 700,
          marginBottom: "16px",
          color: "#1a1a1a"
        }}>
          What Our<span style={{ color: "var(--accent)" }}> Customers Say</span> 
        </h2>
        <p style={{
          fontSize: "18px",
          color: "#555",
          marginBottom: "48px"
        }}>
          Trusted by legal and finance teams across industries.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "32px",
          maxWidth: "900px",
          margin: "0 auto"
        }}>
          {testimonials.map((t, index) => (
            <div key={index} style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              textAlign: "left"
            }}>
              <p style={{
                fontSize: "16px",
                color: "#333",
                fontStyle: "italic",
                marginBottom: "16px"
              }}>
                “{t.text}”
              </p>
              <div style={{ fontWeight: 600, fontSize: "16px", color: "#111" }}>{t.name}</div>
              <div style={{ fontSize: "14px", color: "#777" }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default FeaturesSection;
