import React from "react";
import "./loanHistory.css";
import { useSelector } from "react-redux";

const LoanHistory = () => {
  // Extracting ActiveUser from Redux state
  const { ActiveUser } = useSelector((state) => state.user);

  // Defaulting approved and loans to empty arrays to avoid undefined errors
  const { approved = [], loans = [] } = ActiveUser || {};

  // Combine approved and pending loans into one list
  const combinedLoans = [...approved, ...loans];

  // Consolidate loan history, avoiding duplicates and prioritizing approved loans
  const history = combinedLoans.reduce((acc, currentLoan) => {
    const existingLoanIndex = acc.findIndex((loan) => loan.id === currentLoan.id);

    if (existingLoanIndex === -1) {
      // Add loan if it doesn't exist in the accumulated list
      acc.push(currentLoan);
    } else if (currentLoan.status === "approved") {
      // Replace existing loan with the approved one if duplicates exist
      acc[existingLoanIndex] = currentLoan;
    }

    return acc;
  }, []);

  return (
    <div className="loan-history">
      <h2>Loan History</h2>
      {history.length > 0 ? (
        <table className="loan-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Loan Amount</th>
              <th>Status</th>
              <th>Loan ID</th>
              <th>Interest</th>
              <th>Total Amount Due</th>
            </tr>
          </thead>
          <tbody>
            {history.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.date || "N/A"}</td>
                <td>${loan.loanAmount?.toFixed(2) || "0.00"}</td>
                <td>{loan.status || "Unknown"}</td>
                <td>{loan.id || "N/A"}</td>
                <td>${loan.interest?.toFixed(2) || "0.00"}</td>
                <td>${loan.loanAmountDue?.toFixed(2) || "0.00"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No loan history available.</p>
      )}
    </div>
  );
};

export default LoanHistory;
