import { useNavigate } from "react-router-dom";
import "./TermsLoan.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { terms } from "./store";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { redirect } = useSelector((state) => state.user);

  // Navigate based on the redirect value
  useEffect(() => {
    if (redirect) {
      navigate(redirect);
    }
  }, [redirect, navigate]);

  const handleAccept = () => {
    dispatch(terms({ terms: "accepted" }));
  };

  const handleReject = () => {
    dispatch(terms({ terms: "rejected" }));
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
            <button className="terms-btn accept-btn" onClick={handleAccept}>
              Accept
            </button>
            <a href='' className="terms-btn reject-btn" onClick={handleReject}>
              Reject
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
