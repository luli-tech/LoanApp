import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoans, resetMessage } from "./store";
import { v4 as uuidv4 } from "uuid";
import ConfirmationDialog from "./confirm";
import "./loanApplication.css";
import Error from "./error";

const LoanApplicationForm = () => {
  const dispatch = useDispatch();
  const { ActiveUser, message } = useSelector((state) => state.user);

  const [loanAmount, setLoanAmount] = useState(10000);
  const [tenure, setTenure] = useState(30);
  const [open, setOpen] = useState(false);

  const calculateLoanDetails = (amount, tenure) => {
    const interestRate = tenure === 30 ? 0.02 : 0.36;
    const interest = amount * interestRate;
    const totalAmountDue = amount + interest;
    return { interestRate, interest, totalAmountDue };
  };

  const { interestRate, interest, totalAmountDue } = calculateLoanDetails(
    loanAmount,
    tenure
  );

  const handleLoanAmountChange = (type) => {
    if (type === "increment" && loanAmount < 100000) {
      setLoanAmount(loanAmount + 10000);
    } else if (type === "decrement" && loanAmount > 4000) {
      setLoanAmount(loanAmount - 1000);
    }
  };

  const handleApplyLoan = () => {
    dispatch(
      getLoans({
        loan: {
          id: uuidv4(),
          loanAmount,
          tenure,
          interestRate: `${interestRate * 100}%`,
          interest,
          totalAmountDue,
          status: "pending",
        },
      })
    );
  };

  const closeDialog = () => {
    dispatch(resetMessage());
    setOpen(false);
  };

  return (
    <div className="loan-app-container">
      <h1 className="app-title">EasyLoan</h1>

      {/* Loan Amount Selector */}
      <div className="loan-amount-section">
        <h2>Choose Amount</h2>
        <div className="loan-amount-control">
          <button
            className="amount-btn"
            onClick={() => handleLoanAmountChange("decrement")}
          >
            −
          </button>
          <div className="amount-display">₦{loanAmount.toLocaleString()}</div>
          <button
            className="amount-btn"
            onClick={() => handleLoanAmountChange("increment")}
          >
            +
          </button>
        </div>
        <p className="loan-range">Your loan amount range is ₦4,000 to ₦100,000</p>
      </div>

      {/* Loan Tenure Selector */}
      <div className="loan-tenure-section">
        <h2>Choose a Loan Tenure</h2>
        <div className="tenure-options">
          <button
            className={`tenure-btn ${tenure === 30 ? "active" : ""}`}
            onClick={() => setTenure(30)}
          >
            30 Days <br /> 2% Monthly
          </button>
          <button
            className={`tenure-btn ${tenure === 91 ? "active" : ""}`}
            onClick={() => setTenure(91)}
            disabled
          >
            91 Days <br /> Locked
          </button>
        </div>
      </div>

      {/* Loan Summary */}
      <div className="loan-summary">
        <h3>Loan Summary</h3>
        <p>
          <strong>Tenure:</strong> {tenure} days
        </p>
        <p>
          <strong>Received Amount:</strong> ₦{loanAmount.toLocaleString()}
        </p>
        <p>
          <strong>Interest:</strong> ₦{interest.toFixed(2).toLocaleString()}
        </p>
        <p>
          <strong>Total Amount Due:</strong> ₦
          {totalAmountDue.toFixed(2).toLocaleString()}
        </p>
      </div>

      {/* Apply Button */}
      <button onClick={handleApplyLoan} className="apply-btn">
        Take This Loan
      </button>
      {message && <Error />}
      {open && <ConfirmationDialog />}
    </div>
  );
};

export default LoanApplicationForm;
