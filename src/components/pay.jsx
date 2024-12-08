import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import "./card.css"; // Modernized CSS
import { useDispatch } from "react-redux";
import { accountFunding } from "./store";

const Pay = () => {
    const [amount, setAmount] = useState(2000); // Default amount in kobo (NGN)
    const dispatch = useDispatch();

    const handleToken = (token) => {
        if (token) {
            console.log("Payment successful:", token);
            dispatch(accountFunding(amount / 100)); // Convert kobo to naira for Redux store
        } else {
            console.log("Payment error");
        }
    };

    return (
        <div className="body">
            <div className="card">
                <div className="card-content">
                    <h1 className="title">Fund Your Account</h1>
                    <p className="description">Enter the amount you'd like to fund and proceed with payment.</p>
                    <div className="input-container">
                        <label htmlFor="amount">Amount (₦):</label>
                        <input
                            id="amount"
                            type="number"
                            value={amount / 100} // Display amount in naira
                            onChange={(e) => {
                                const valueInNaira = parseFloat(e.target.value || 0); // Handle empty or invalid inputs
                                setAmount(valueInNaira * 100); // Convert naira to kobo
                            }}
                            placeholder="Enter amount (e.g., 2000)"
                        />
                    </div>
                    <StripeCheckout
                        token={handleToken}
                        name="Loan App Inc."
                        description={`Fund your account with ₦${amount / 100}`}
                        currency="NGN"
                        amount={amount} // Amount in kobo
                        stripeKey="pk_test_51QT6InDFDXEbOPO35RWv9SY8YW9XrFy9Uv4IiUtcHN3Pcu58m25iV4kRAmgFukMoFsLlFrADzsdmbneV9tNyryOG006RSQfnxl"
                    />

                </div>
            </div></div>
    );
};

export default Pay;
