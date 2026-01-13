import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import './contact.css'; // Import the CSS file

const Contact: React.FC = () => {
  return (
    <section className="contact-section">
      <h2>Ready to Get Started?</h2>
      <p>
        Contact our team today and discover how we can transform your business
      </p>

      <div className="contact-items-container">
        <div className="contact-details">
          <h3>Get in Touch</h3>
          <p>
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
          <ContactItem icon={<FaEnvelope />} title="Email Us" value="info@vanigamsoftware.com" />
          <ContactItem icon={<FaPhone />} title="Call Us" value="+91 99625-49198" />
          <ContactItem icon={<FaMapMarkerAlt />} title="Visit Us" value={`Flat No:1,"PRITHVI", No:7, Seetha Nagar IInd Street,\nNungambakkam, Chennai-600034, Tamil Nadu`} />
        </div>

        {/* Form */}
        <div className="form-container">
          <h3>Send us a Message</h3>
          <p>
            Fill out the form below and we'll get back to you within 24 hours.
          </p>
          <form>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <input type="text" placeholder="Your full name" required />
              <input type="email" placeholder="your@email.com" required />
            </div>
            <input type="text" placeholder="Your company name" />
            <select required>
              <option value="">Select a subject</option>
              <option value="demo">General Inquiry</option>
              <option value="support">Sales Question</option>
              <option value="custom">Technical support</option>
            </select>
            <textarea
              placeholder="Tell us about your project or question..."
              rows={4}
              required
            />
            <button type="submit">
              Send Message <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const ContactItem = ({ icon, title, value }: { icon: JSX.Element; title: string; value: string }) => (
  <div className="contact-item">
    <div className="icon-container">
      {icon}
    </div>
    <div className="text-container">
      <div>{title}</div>
      <div className="value-container">{value}</div>
    </div>
  </div>
);

export default Contact;
