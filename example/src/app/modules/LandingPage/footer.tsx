import React from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-container">

        {/* Newsletter Section */}
        <div className="landing-newsletter">
          <h2>Stay Updated</h2>
          <p>Get the latest updates, tips, and insights delivered straight to your inbox.</p>
          <div className="landing-newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="landing-footer-columns">
          <div className="landing-footer-col">
            <h4>Product</h4>
            <ul>
              <li>Features</li>
              <li>Pricing</li>
              <li>API Documentation</li>
              <li>Integrations</li>
            </ul>
          </div>
          <div className="landing-footer-col">
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Blog</li>
            </ul>
          </div>
          <div className="landing-footer-col">
            <h4>Support</h4>
            <ul>
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Status</li>
              <li>Community</li>
            </ul>
          </div>
          <div className="landing-footer-col">
            <h4>Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
              <li>GDPR</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="landing-footer-bottom">
          <div className="landing-logo">
            <div className="landing-logo-icon" />
            <span>Aavanam Document Viewer</span>
          </div>
          <p>© 2025 Vanigam. All rights reserved.</p>
          <div className="landing-social-icons">
            <FaFacebookF />
            <FaTwitter />
            <FaLinkedinIn />
            <FaGithub />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
