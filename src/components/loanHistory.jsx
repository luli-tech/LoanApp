import React from "react";
import "./loanHistory.css";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

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
        <div className="loan-history-table-container">
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
                <NavLink
                  to={`/loan-details/${loan.id}`}
                  key={loan.id}
                  className="loan-row-link"
                >
                  <tr className={loan.status === "approved" ? "approved-loan" : ""}>
                    <td>{loan.date || "N/A"}</td>
                    <td>${loan.loanAmount?.toFixed(2) || "0.00"}</td>
                    <td>{loan.status || "Unknown"}</td>
                    <td>{loan.id || "N/A"}</td>
                    <td>${loan.interest?.toFixed(2) || "0.00"}</td>
                    <td>${loan.loanAmountDue?.toFixed(2) || "0.00"}</td>
                  </tr>
                </NavLink>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No loan history available.</p>
      )}
    </div>
  );
};

export default LoanHistory;
