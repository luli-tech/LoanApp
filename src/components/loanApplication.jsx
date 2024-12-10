import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoans, resetMessage, resetredirect } from "./store";
import { v4 as uuidv4 } from "uuid";
import ConfirmationDialog from "./confirm";
import "./loanApplication.css";
import Error from "./error";
import { useNavigate } from "react-router-dom";

const LoanApplicationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ActiveUser, successmessage, errormessage, redirect } = useSelector((state) => state.user);
  const loanExist = ActiveUser?.loans?.filter(user => user?.status === 'approved')
  const [loanAmount, setLoanAmount] = useState("");
  const [tenure, setTenure] = useState(30);
  const [open, setOpen] = useState(false);

  const date = new Date().toLocaleString();

  // Calculate loan details based on the selected tenure and loan amount
  const calculateLoanDetails = (amount) => {
    const rates = { 30: 0.02, 91: 0.03, 180: 0.05, 365: 0.08 }; // Dynamic interest rates
    const interestRate = rates[tenure] || 0;
    const interest = amount * interestRate || 0;
    const totalAmountDue = amount + interest;

    return { interestRate, interest, totalAmountDue };
  };

  const { interestRate, interest, totalAmountDue } = calculateLoanDetails(
    parseFloat(loanAmount) || 0
  );

  // Redirect handling
  useEffect(() => {
    if (redirect) {
      navigate(redirect);
      dispatch(resetredirect());
    }
  }, [redirect, dispatch, navigate]);

  // Handle applying for the loan
  const handleApplyLoan = () => {
    const amount = parseFloat(loanAmount) || 0;

    // Reset erro

    // Validation for loan amount range
    // if (amount < 4000 || amount > 100000) {
    //   setError("Loan amount must be between ₦4,000 and ₦100,000.");
    //   return;
    // }

    // Dispatch the loan application to Redux store
    dispatch(
      getLoans({
        loan: {
          date,
          id: uuidv4(),
          loanAmount: amount,
          tenure,
          interestRate: `${(interestRate * 100).toFixed(2)}%`,
          interest,
          totalAmountDue,
          status: "pending",
        },
      })
    );

    // If the user has an existing loan that's pending approval, open the confirmation dialog
    if (ActiveUser?.loans?.find((user) => user.status !== 'approved')) {
      setOpen(true);
    }
  };

  // Close the confirmation dialog and reset messages
  const closeDialog = () => {
    dispatch(resetMessage());
    setOpen(false);
  };

  return (
    <div className="bod">
      <div className="loan-app-container">
        <h1 className="app-title">EasyLoan</h1>

        {/* Loan Amount Input */}
        <div className="loan-amount-section">
          <h2>Enter Loan Amount</h2>
          <input
            type="text"
            className="loan-input"
            value={loanAmount}
            onChange={(e) =>
              setLoanAmount(e.target.value.replace(/[^0-9]/g, ""))
            }
            placeholder="₦ Enter amount (e.g., 10,000)"
          />
          <p className="loan-range">
            Your loan amount range is ₦4,000 to ₦100,000
          </p>
          {/* {error && <p className="error-message">{error}</p>} */}
        </div>

        {/* Loan Tenure Selector */}
        <div className="loan-tenure-section">
          <h2>Choose a Loan Tenure</h2>
          <div className="tenure-options">
            <button
              className={`tenure-btn ${tenure === 30 ? "active" : ""}`}
              onClick={() => setTenure(30)}
            >
              30 Days <br /> 2% Interest
            </button>
            <button
              className={`tenure-btn ${tenure === 91 ? "active" : ""}`}
              onClick={() => setTenure(91)}
            >
              91 Days <br /> 3% Interest
            </button>
            <button
              className={`tenure-btn ${tenure === 180 ? "active" : ""}`}
              onClick={() => setTenure(180)}
            >
              6 Months <br /> 5% Interest
            </button>
            <button
              className={`tenure-btn ${tenure === 365 ? "active" : ""}`}
              onClick={() => setTenure(365)}
            >
              1 Year <br /> 8% Interest
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
            <strong>Loan Amount:</strong> ₦{loanAmount ? loanAmount.toLocaleString() : 0}
          </p>
          <p>
            <strong>Interest:</strong> ₦{interest.toFixed(2).toLocaleString()}
          </p>
          <p>
            <strong>Total Amount Due:</strong> ₦
            {totalAmountDue.toFixed(2).toLocaleString()}
          </p>
        </div>

        {/* Apply for Loan Button */}
        <button onClick={handleApplyLoan} className="apply-btn">
          Take This Loan
        </button>

        {/* Confirmation Dialog */}
        {!loanExist && <ConfirmationDialog setOpen={setOpen} open={open} closeDialog={closeDialog} />}
      </div>
    </div>
  );
};

export default LoanApplicationForm;
