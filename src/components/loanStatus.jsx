import React, { useState, useEffect } from "react";
import "./loanStatus.css";
import { useSelector } from "react-redux";

const LoanStatus = () => {

  let { ActiveUser } = useSelector(state => state.user)


  return (
    <div className="loan-status">
      <h2>Your Loan Status</h2>
      {ActiveUser.approved && <div>You have an active loan</div>}
      {!ActiveUser.approved && <div>You currently don't have any active Loan</div>}
    </div>
  );
};

export default LoanStatus;
