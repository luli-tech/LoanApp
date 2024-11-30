import React, { useState } from "react";
import SuccessMessage from "./successmessage";
import "./Successmessage.css";
import { useNavigate } from "react-router-dom";

const LoanApplication = () => {
  let navigate = useNavigate();
  const [loanApproved, setLoanApproved] = useState(true);

  const approveLoan = () => {
    // Simulate loan approval
    setLoanApproved(true);
  };

  const closeSuccessMessage = () => {
    setLoanApproved(false);
    navigate("/");
  };

  return (
    <div>
      <button onClick={approveLoan}>Approve Loan</button>

      {loanApproved && <SuccessMessage onClose={closeSuccessMessage} />}
    </div>
  );
};

export default LoanApplication;
