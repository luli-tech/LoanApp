import React from "react";
import "./confirm.css";
import { useSelector, useDispatch } from "react-redux";
import { confirmLoan } from "./store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resetredirect } from "./store";
import Error from "./error";

const ConfirmationDialog = ({ setopen, open }) => {
    let navigate = useNavigate();
    let { message } = useSelector(state => state.user)
    console.log(message)
    const dispatch = useDispatch();
    const { ActiveUser, redirect } = useSelector((state) => state.user);
    const { id, interest, interestRate, loanAmount, tenure, totalAmountDue } =
        ActiveUser.loans[ActiveUser.loans.length - 1];
    let date = new Date().toLocaleDateString();
    useEffect(() => {
        if (redirect) {
            navigate(redirect)
            dispatch(resetredirect)
        }
        console.log(ActiveUser);
    }, [redirect]);
    function confirm() {
        dispatch(
            confirmLoan({
                id,
                date,
                interest,
                interestRate,
                loanAmount,
                tenure,
                totalAmountDue,
                status: "approved",
            })
        );
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
            <Error />
        </div>
    );
};

export default ConfirmationDialog;
