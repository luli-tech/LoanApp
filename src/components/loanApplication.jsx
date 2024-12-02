import React, { useState, useEffect } from "react";
import "./loanApplication.css";
import { useDispatch, useSelector } from "react-redux";
import { getLoans } from "./store";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "./confirm";
import { v4 } from "uuid";

const LoanApplicationForm = () => {
  let [open, setopen] = useState(false);
  const dispatch = useDispatch();
  const { ActiveUser } = useSelector((state) => state.user);
  const [loanAmount, setLoanAmount] = useState(10000);
  const [tenure, setTenure] = useState(30);

  function confirm() {
    setopen(!open);
  }

  // Utility function for loan calculations
  const calculateLoanDetails = (amount, tenure) => {
    const interestRate = tenure === 30 ? 0.02 : 0.36;
    const interest = amount * interestRate;
    const totalAmountDue = amount + interest;
    return { interestRate, interest, totalAmountDue };
  };

  useEffect(() => {
    console.log(ActiveUser);
  }, []);

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

  const getLoanModel = () => {
    if (!ActiveUser) {
      alert("Please log in to apply for a loan!");
      return;
    }

    if (loanAmount < 4000 || loanAmount > 100000) {
      alert("Loan amount must be between ₦4,000 and ₦100,000");
      return;
    }

    dispatch(
      getLoans({
        loan: {
          id: v4(),

          loanAmount: loanAmount,
          tenure: tenure,
          interestRate: `${interestRate * 100}%`, // Corrected line
          interest: interest,
          totalAmountDue: totalAmountDue,
          status: "pending",
        },
      })
    );

    let active = ActiveUser.approved?.find(
      (approved) => approved.status === "approved"
    );
    if (active) {
      return;
    } else {
      setopen(!open);
    } // alert("Loan successfully applied!");
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
        <p className="loan-range">
          Your loan amount range is ₦4,000 to ₦100,000
        </p>
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

      {/* Repayment Schedule */}
      <div className="repayment-schedule">
        <h3>Repayment Schedule</h3>
        <p>
          <strong>Repayment Date:</strong> {new Date().toDateString()}
        </p>
        <p>
          <strong>Total Repayment:</strong> ₦
          {totalAmountDue.toFixed(2).toLocaleString()}
        </p>
      </div>

      {/* Apply Button */}
      <button onClick={getLoanModel} className="apply-btn">
        Take This Loan
      </button>
      {open && <ConfirmationDialog open={open} setopen={setopen} />}
    </div>
  );
};

export default LoanApplicationForm;
