import React from "react";
import "./Successmessage.css";
import { useNavigate } from "react-router-dom";

const SuccessMessage = () => {
  let navigate = useNavigate();
  function close() {
    navigate("/");
  }
  return (
    <div className="success-message-container">
      <div className="success-message-card">
        <div className="success-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="green"
            width="64px"
            height="64px"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.59l-3.29-3.3 1.42-1.41 1.88 1.88 4.59-4.58L17 11l-6 6z" />
          </svg>
        </div>
        <h2 className="success-title">Loan Approved!</h2>
        <p className="success-message">
          Congratulations! Your loan has been approved and will be credited into
          your account shortly. Thank you for choosing our service!
        </p>
        <button className="success-close-btn" onClick={close}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
