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
    <div className="fade-in">
      <header className="card mb-0" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, borderTop: 0 }}>
        <div className="card-body">
          <div className="modern-flex flex-between" style={{ alignItems: "center" }}>
            <img
              src="/media/Aavanamlogo.jpg"
              alt="Aavanam Logo"
              style={{ height: "50px", objectFit: "contain" }}
            />
            <div className="modern-flex" style={{ gap: "12px", alignItems: "center" }}>
              <div className="hide-mobile">
                <ThemeColorDropdown />
              </div>
              <Link to='/auth/login'>
                <button className="btn btn-light" type='button'>
                  Sign In
                </button>
              </Link>
              <Link to="/Signup">
                <button className="btn btn-primary" type="button">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
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
