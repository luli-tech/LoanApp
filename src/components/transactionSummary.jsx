import React from "react";
import "./transactionSummary.css";

const TransactionSummary = () => {
  return (
    <div className="transaction-summary">
      <h2>Transaction Summary</h2>
      <p>
        <strong>Loan Amount:</strong> $5,000
      </p>
      <p>
        <strong>Interest Rate:</strong> 2%
      </p>
      <p>
        <strong>Total Repayment:</strong> $5,100
      </p>
      <p>
        <strong>Status:</strong> Approved
      </p>
      <button className="cta-primary">View Details</button>
    </div>
  );
};

export default TransactionSummary;
