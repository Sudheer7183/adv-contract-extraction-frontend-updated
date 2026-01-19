import axios from "axios";
import React, { useState } from "react";
import BASEURL from "../../config/baseurl";
import request, { gql } from "graphql-request";
import ThemeColorDropdown from "./ThemeColourDropDown";
import { Link } from "react-router-dom";

const SubmitSignupDetails = `
    mutation signUpDetails($input:SignUpInput!){
      signUpDetails(input:$input){
        Details{
          companyName
          companyWebsite
          country
          fullName
          email
          phoneNumber
          jobTitle
          prefferedLanguage
          documentVolume
          useCase
        }
      }
    }
`

interface FormData {
  companyName: string;
  companyWebsite: string;
  country: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  preferredLanguages: string;
  documentVolume: string;
  useCase: string;
  acceptTerms: boolean;
  uploadMethod: string;
}

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyWebsite: "",
    country: "",
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    preferredLanguages: "",
    documentVolume: "",
    useCase: "",
    acceptTerms: false,
    uploadMethod: "manual",
  });

  const [step, setStep] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const nextStep = () => {
    if (step ==1){
        if (formData.companyName && formData.companyWebsite && formData.country){
            setStep((s) => s + 1);

        }
        else{
            alert("please fill all the fields")
        }
    }
    if(step == 2){
        if(formData.fullName && formData.email && formData.phone){
            setStep(prevStep => prevStep + 1)
        }else{
            alert("please fill all the fields")
        }
    }
    if(step>2){
        setStep(prevStep => prevStep + 1)
    }

}
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      alert("You must accept the Terms and Privacy Policy.");
      return;
    }
    console.log("Form Submitted:", formData);
    const url = `${BASEURL}graphql/`
    const variables = {
      input: {
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        country: formData.country,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        jobTitle: formData.jobTitle,
        prefferedLanguage: formData.preferredLanguages,
        documentVolume: parseInt(formData.documentVolume),
        useCase: formData.useCase,
      }
    };

    axios.post(url,{
        query: SubmitSignupDetails,
        variables: variables
      },
      {
      headers:{
        'content-type':'application/json',

      },

    }).then((response:any)=>{
      console.log(response.data);
      console.log('succesfully submitted the form');
      setShowSuccessPopup(true);
      setFormData({
      companyName: "",
      companyWebsite: "",
      country: "",
      fullName: "",
      email: "",
      phone: "",
      jobTitle: "",
      preferredLanguages: "",
      documentVolume: "",
      useCase: "",
      acceptTerms: false,
      uploadMethod: "manual",
    });
    setStep(1);
    }).catch((error:any)=>{
      console.log(error)
    })
  };

  const containerStyle = {
    maxWidth: "1000px",
    width:"500px",
    margin: "60px auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
    fontFamily: "'Inter', sans-serif",
    color: "#1f2937",
  };

  const labelStyle = {
    display: "block",
    fontWeight: 500,
    marginBottom: "8px",
    color: "#374151",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    marginBottom: "20px",
    fontSize: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none" as const,
  };

  const buttonStyle = {
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    padding: "10px 24px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    marginTop: "20px",
  };
  const popupOverlayStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const popupBoxStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
  maxWidth: "400px",
  textAlign: "center" as const,
};

  return (
    <>
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
          src="/media/logos/Aavanam.png"
          alt="Aavanam Logo"
          style={{ height: "50px", objectFit: "contain",border:"1px solidrgb(0, 0, 0)" }}
        />
        <div style={{ display: "flex", gap: "12px" }}>
          <ThemeColorDropdown />
          {/* <Link to='/auth/login'>
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
          </Link> */}

        </div>
      </header>
      <form onSubmit={handleSubmit} style={containerStyle}>
      {step === 1 && (
        <>
          <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>🔒 Company / Organization Info</h2>
          <label style={labelStyle}>Company Name</label>
          <input style={inputStyle} name="companyName" value={formData.companyName} onChange={handleChange} required />

          <label style={labelStyle}>Company Website</label>
          <input style={inputStyle} name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} />

          <label style={labelStyle}>Country / Region</label>
          <input style={inputStyle} name="country" value={formData.country} onChange={handleChange} />

          <div style={{ textAlign: "right" }}>
            <button type="button" onClick={nextStep} style={buttonStyle}>Next</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>👤 Admin User Info</h2>
          <label style={labelStyle}>Full Name</label>
          <input style={inputStyle} name="fullName" value={formData.fullName} onChange={handleChange} required />

          <label style={labelStyle}>Email</label>
          <input style={inputStyle} type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label style={labelStyle}>Phone Number</label>
          <input style={inputStyle} name="phone" value={formData.phone} onChange={handleChange} />

          <label style={labelStyle}>Job Title</label>
          <input style={inputStyle} name="jobTitle" value={formData.jobTitle} onChange={handleChange} />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="button" onClick={prevStep} style={buttonStyle}>Back</button>
            <button type="button" onClick={nextStep} style={buttonStyle}>Next</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>⚙️ Technical Setup</h2>
          <label style={labelStyle}>Preferred Language(s)</label>
          <input style={inputStyle} name="preferredLanguages" value={formData.preferredLanguages} onChange={handleChange} />

          <label style={labelStyle}>Document Volume (monthly)</label>
          <input style={inputStyle} name="documentVolume" value={formData.documentVolume} onChange={handleChange} />

          <label style={labelStyle}>Use Case</label>
          <textarea
            style={{ ...inputStyle, height: "100px", resize: "vertical" }}
            name="useCase"
            value={formData.useCase}
            onChange={handleChange}
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="button" onClick={prevStep} style={buttonStyle}>Back</button>
            <button type="button" onClick={nextStep} style={buttonStyle}>Next</button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>📁 Upload & Legal</h2>

          <label style={labelStyle}>Upload Method</label>
          <select style={inputStyle} name="uploadMethod" value={formData.uploadMethod} onChange={handleChange}>
            <option value="manual">Manual Upload</option>
            <option value="cloud">Cloud Integration</option>
          </select>

          <label style={{ display: "block", marginBottom: "16px" }}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              style={{ marginRight: "10px" }}
            />
            I accept the{" "}
            <a href="/terms" target="_blank" style={{ color: "#6366f1" }}>
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" target="_blank" style={{ color: "#6366f1" }}>
              Privacy Policy
            </a>
          </label>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="button" onClick={prevStep} style={buttonStyle}>Back</button>
            <button type="submit" style={buttonStyle}>Submit</button>
          </div>
        </>
      )}
    
    </form>
        {showSuccessPopup && (
        <div style={popupOverlayStyle}>
          <div style={popupBoxStyle}>
            <h3 style={{ marginBottom: "12px", fontSize: "18px", color: "#1f2937" }}>🎉 Submission Successful</h3>
            <p style={{ marginBottom: "16px", fontSize: "15px", color: "#4b5563" }}>
              Your details have been submitted successfully. You will receive an email within 24 hours.
            </p>
            <button onClick={() => setShowSuccessPopup(false)} style={buttonStyle}>
              Close
            </button>
          </div>
        </div>
      )}
    </>

    
  );
};

export default SignUpForm;
