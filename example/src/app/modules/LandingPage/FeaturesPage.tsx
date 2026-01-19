// import React from "react";
// import Features from "./Features";
// import Contact from "./Contact";
// import Pricing from "./Pricing";
// const FeaturesPage = () => {
//   return (
//     <main>
//       <Features />
//       <Pricing/>
//       <Contact/>
//     </main>
//   );
// };

// export default FeaturesPage;

import React from "react";
import Features from "./Features"; // Make sure it's updated to inline style if needed
import Pricing from "./Pricing";
import Contact from "./Contact";
import ThemeToggle from "./ThemeToggle"; // Optional
import HeroSection from "./Herosection";
import ThemeColorDropdown from "./ThemeColourDropDown";
import Footer from "./footer";
import { Link } from 'react-router-dom'
const FeaturesPage: React.FC = () => {
  return (
    <div style={{ fontFamily: "sans-serif", color: "#1f2937" }}>
      <header
        style={{
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb"
        }}
      >
        {/* <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--accent)" }}>Aavanam</h1> */}
        <img
          src="/media/Aavanamlogo.jpg"
          alt="Aavanam Logo"
          style={{ height: "50px", objectFit: "contain",border:"1px solidrgb(0, 0, 0)" }}
        />
        <div style={{ display: "flex", gap: "12px" }}>
          {/* <ThemeToggle /> */}
          <ThemeColorDropdown />
          <Link to='/auth/login'>
          <button
            style={{
              padding: "10px 20px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              backgroundColor: "#fff",
              cursor: "pointer"
              
            }}
            type='button'
          >
            Sign In
          </button>
          </Link>
          <Link to="/Signup">
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "var(--accent)",
              color: "#fff",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
            type="button"
          >
            Sign Up
          </button>
          </Link>

        </div>
      </header>

      <main>
        <HeroSection/>
        <Features />
        <Pricing />
        <Contact />
        <Footer/>
      </main>
    </div>
  );
};

export default FeaturesPage;
