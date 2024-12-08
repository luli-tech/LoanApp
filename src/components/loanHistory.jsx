import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./loanHistory.css"; // Ensure the correct CSS path

const LoanHistory = () => {
  // Extracting ActiveUser from Redux state
  const { ActiveUser } = useSelector((state) => state.user);

  // Defaulting approved and loans to empty arrays to avoid undefined errors
  const { loans = [], repayments = [] } = ActiveUser || {};
  // Filter for only approved loans
  const approvedLoans = loans.filter((loan) => loan.status === "approved");
  let final = [...repayments, ...loans]
  console.log(final)
  return (
    <div className="loan-history">
      <h2>Loan History</h2>
      {loans.length > 0 ? (
        <div className="loan-history-table">
          {/* Table header */}
          <div className="loan-history-row header">
            <div className="loan-history-cell">Date</div>
            <div className="loan-history-cell">Loan Amount</div>
            <div className="loan-history-cell">Status</div>
            <div className="loan-history-cell">Loan ID</div>
            <div className="loan-history-cell">Interest</div>
            <div className="loan-history-cell">Total Amount Due</div>
          </div>

          {/* Table rows */}
          {final.map((loan, id) => (
            loan.id && (
              <NavLink
                to={`/loan-details/${loan.id}`}
                key={id}
                className="loan-history-row-link"
              >
                <div
                  className={`loan-history-row ${loan.status === "approved" ? "approved-loan" : ""}`}
                >
                  <div className="loan-history-cell">{loan.date || "Pending"}</div>
                  <div className="loan-history-cell">
                    ₦{loan.loanAmount?.toFixed(2) || "0.00"}
                  </div>
                  <div className="loan-history-cell">{loan.status || "Unknown"}</div>
                  <div className="loan-history-cell">{loan.id || "Pending"}</div>
                  <div className="loan-history-cell">
                    ₦{loan.interest?.toFixed(2) || "0.00"}
                  </div>
                  <div className="loan-history-cell">
                    ₦{loan.totalAmountDue?.toFixed(2) || "0.00"}
                  </div>
                </div>
              </NavLink>
            )
          ))}
        </div>
      ) : (
        <p>No loan history available.</p>
      )}
    </div>
  );
};

export default LoanHistory;
