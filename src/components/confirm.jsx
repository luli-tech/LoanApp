import React, { useEffect } from "react";
import "./confirm.css";
import { useSelector, useDispatch } from "react-redux";
import { confirmLoan, resetredirect } from "./store";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Error from "./error";

const ConfirmationDialog = ({ setopen, open }) => {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const { message, ActiveUser, redirect } = useSelector((state) => state.user);

    const loanDetails = ActiveUser?.loans?.length
        ? ActiveUser.loans[ActiveUser.loans.length - 1]
        : null;

    const {
        id = null,
        interest = 0,
        interestRate = 0,
        loanAmount = 0,
        tenure = 0,
        totalAmountDue = 0,
    } = loanDetails || {};

    let date = new Date().toLocaleDateString();

    // Handle redirect after loan confirmation
    useEffect(() => {
        if (redirect) {
            navigate(redirect);
            dispatch(resetredirect());
        }
    }, [redirect, navigate, dispatch]);

    function confirm() {
        if (!loanDetails) return;

        // Dispatch loan confirmation
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

        // Display SweetAlert2 success message
        Swal.fire({
            icon: "success",
            title: "Loan Confirmed!",
            text: `You have successfully borrowed ₦${loanAmount.toLocaleString()} at a ${interestRate} interest rate. Please ensure timely repayment.`,
            confirmButtonText: "OK",
        });

        // Close the dialog
        setopen(false);
    }

    if (!loanDetails) {
        return <div>No active loan details available to confirm.</div>;
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
