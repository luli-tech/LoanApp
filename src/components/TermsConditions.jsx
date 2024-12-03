import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TermsLoan.css"; // New modern CSS

const TermsAndConditions = () => {
  const [isAccepted, setIsAccepted] = useState(null);
  const navigate = useNavigate();

  const handleAccept = () => {
    setIsAccepted(true);
    navigate("/spin")
    setTimeout(() => {
      navigate("/apply"); // Redirect after animation
    }, 1000);
  };
  clearTimeout(handleAccept)
  const handleReject = () => {
    setIsAccepted(false);
    navigate("/spin")
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="modern-terms-page">
      <div className="card">
        <h1 className="title">Terms & Conditions</h1>
        <div className="content">
          <p>
            Please carefully review the terms and conditions before proceeding.
            By accepting, you agree to the following:
          </p>
          <ul className="terms-list">
            <li>🔒 Your data will be securely handled at all times.</li>
            <li>📜 You agree to comply with our usage policies.</li>
            <li>💳 Payments, if applicable, are non-refundable.</li>
            <li>⚠️ Misuse of the platform may result in account suspension.</li>
          </ul>
          <p>
            Declining the terms will restrict your access to certain features.
          </p>
        </div>

        <div className="actions">
          <button
            className={`accept-btn ${isAccepted === true ? "animate" : ""}`}
            onClick={handleAccept}
          >
            Accept
          </button>
          <button
            className={`reject-btn ${isAccepted === false ? "animate" : ""}`}
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
        {isAccepted !== null && (
          <div
            className={`status-message ${isAccepted ? "success" : "error"
              } fade-in`}
          >
            {isAccepted
              ? "Thank you! Redirecting to your dashboard..."
              : "Sorry to see you go. Redirecting to home..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsAndConditions;
