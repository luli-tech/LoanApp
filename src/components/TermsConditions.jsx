import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TermsLoan.css";
import Spinner from "./spinner";

const TermsAndConditions = () => {
  const [isAccepted, setIsAccepted] = useState(null);
  const navigate = useNavigate();

  const handleAccept = () => {
    setIsAccepted(true);
    navigate("/apply"); // Redirect after the spin animation
  };

  const handleReject = () => {
    setIsAccepted(false);
    navigate("/"); // Redirect after the spin animation
  };

  return (
    <div className="body">
      <div className="modern-terms-page">
        <div className="terms-card">
          <h1 className="terms-title">Terms & Conditions</h1>
          <div className="terms-content">
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
            <p>Declining the terms will restrict your access to certain features.</p>
          </div>
          <div className="terms-actions">
            <button
              className={`terms-btn accept-btn ${isAccepted === true ? "animate" : ""}`}
              onClick={handleAccept}
            >
              Accept
            </button>
            <button
              className={`terms-btn reject-btn ${isAccepted === false ? "animate" : ""}`}
              onClick={handleReject}
            >
              Reject
            </button>
          </div>
          {isAccepted !== null && (
            <div className={`status-message ${isAccepted ? "success" : "error"} fade-in`}>
              {isAccepted
                ? "Thank you! Redirecting to your dashboard..."
                : "Sorry to see you go. Redirecting to home..."}
            </div>
          )}
        </div>
      </div>
      {isAccepted && <Spinner />}
    </div>
  );
};

export default TermsAndConditions;
