import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { repayment, resetMessage } from "./store";
import "./loanRepayment.css";
// import SuccessMessage from "./successmessage";
// import Error from "./error";

const LoanRepayment = () => {
    const dispatch = useDispatch();
    const { ActiveUser, message } = useSelector((state) => state.user);

    const [selectedLoan, setSelectedLoan] = useState("");
    const [repaymentAmount, setRepaymentAmount] = useState("");

    const handleRepayment = () => {
        if (!selectedLoan || !repaymentAmount) {
            alert("Please select a loan and enter an amount.");
            return;
        }

        dispatch(
            repayment({
                id: selectedLoan,
                loanAmount: parseFloat(repaymentAmount),
                id: selectedLoan,
            })
        );

        setRepaymentAmount("");
        setSelectedLoan("");
    };

    const handleResetMessage = () => {
        dispatch(resetMessage());
    };

    return (
        <div className="bod">
            <div className="loan-repayment">
                <h2>Loan Repayment</h2>

                <select
                    value={selectedLoan}
                    onChange={(e) => setSelectedLoan(e.target.value)}
                >
                    <option value="">Select a Loan</option>
                    {ActiveUser?.loans?.filter(status => status.status === 'approved')?.map((loan) => (
                        <option key={loan.id} value={loan.id}>
                            Amount: {loan.totalAmountDue}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Enter Repayment Amount"
                    value={repaymentAmount}
                    onChange={(e) => setRepaymentAmount(e.target.value)}
                />

                <button onClick={handleRepayment}>Repay Loan</button>

                {message && (
                    <div>
                        <p>{message}</p>
                        <button onClick={handleResetMessage}>Clear Message</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoanRepayment;
