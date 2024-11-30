import React, { useState, useEffect } from "react";
import "./loanStatus.css";

const LoanStatus = () => {
  const [loanStatus, setLoanStatus] = useState(null);

  useEffect(() => {
    // Fetch loan status from the server (mocked as "approved")
    setLoanStatus("Approved");
  }, []);

  return (
    <div className="loan-status">
      <h2>Your Loan Status</h2>
      {loanStatus ? (
        <p>
          Your loan is currently: <strong>{loanStatus}</strong>
        </p>
      ) : (
        <p>Loading loan status...</p>
      )}
    </div>
  );
};

export default LoanStatus;
