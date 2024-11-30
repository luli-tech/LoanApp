import React from "react";
import "./Confirm.css";
import { useSelector, useDispatch } from "react-redux";
import { confirmLoan } from "./store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmationDialog = ({ setopen, open }) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { ActiveUser } = useSelector((state) => state.user);
  const { id, interest, interestRate, loanAmount, tenure, totalAmountDue } =
    ActiveUser.loans[ActiveUser.loans.length - 1];
  useEffect(() => {
    console.log(ActiveUser);
  }, []);
  function confirm() {
    dispatch(
      confirmLoan({
        id,
        interest,
        interestRate,
        loanAmount,
        tenure,
        totalAmountDue,
        status: "approved",
      })
    );
    setopen(!open);
    if (ActiveUser.age == "" || ActiveUser.age < 18) {
      alert("oh no");
    } else {
      navigate("/success");
    }
  }

  return (
    <div className="confirmation-dialog-container">
      <div className="confirmation-dialog">
        <h2 className="dialog-title">Confirm Your Loan</h2>
        <p className="dialog-info">
          You are about to borrow <strong>₦{loanAmount}</strong> with a{" "}
          <strong>{interestRate}</strong> interest rate at ₦{interest}. This
          means you will repay a total of{" "}
          <strong>₦{totalAmountDue.toLocaleString()}</strong> after{" "}
          <strong>{tenure} days</strong>.
        </p>
        <p className="dialog-details">
          Ensure that you are comfortable with the repayment plan. Late payments
          may incur penalties.
        </p>
        <div className="dialog-buttons">
          <button className="confirm-btn" onClick={confirm}>
            Yes, Borrow Now
          </button>
          <button className="cancel-btn" onClick={() => setopen(!open)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
