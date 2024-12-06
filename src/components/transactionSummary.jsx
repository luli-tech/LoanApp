import React from "react";
import "./transactionSummary.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
const TransactionSummary = () => {
  let { id } = useParams();
  let { ActiveUser } = useSelector(state => state.user)
  let { approved = [], loans = [] } = ActiveUser || {}
  const combinedLoans = [...approved, ...loans];
  console.log(combinedLoans)
  let current = combinedLoans?.find(loan => loan.id === id)
  console.log(current)
  return (
    <div className="transaction-summary">
      <h2>Transaction Summary</h2>
      <p>
        <strong>Loan Amount:</strong>{current?.loanAmount}
      </p>
      <p>
        <strong>Interest:</strong> {current?.interestRate}
      </p>
      <p>
        <strong>Interest Rate:</strong> {current?.interest}
      </p>
      <p>
        <strong>Total Repayment:</strong> {current?.totalAmountDue}
      </p>
      <p>
        <strong>Status:</strong> {current?.status}
      </p>
      <p>
        <strong>Date:</strong> {current?.date}
      </p>
      <button className="cta-primary">View Details</button>
    </div>
  );
};

export default TransactionSummary;
