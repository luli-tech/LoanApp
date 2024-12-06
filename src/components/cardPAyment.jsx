import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import "./card.css";
import { useDispatch } from "react-redux";
import { accountFunding } from "./store";

const CardPayment = () => {
    const [amount, setAmount] = useState(Number); // Default amount in kobo (NGN)
    const dispatch = useDispatch();

    const handleToken = (token) => {
        if (token) {
            console.log("Payment successful:", token);

            // Dispatch action to fund the account after payment
            dispatch(accountFunding(amount / 100)); // Convert kobo to naira for Redux store
        } else {
            console.log("Payment error");
        }
    };

    return (
        <div className="card">
            <h3>Fund Your Account</h3>
            <label>
                Amount (₦):
                <input
                    type="number"
                    value={amount / 100} // Display amount in naira
                    onChange={(e) => {
                        const valueInNaira = parseFloat(e.target.value); // Handle empty or invalid inputs
                        setAmount(valueInNaira * 100); // Convert naira to kobo
                    }}
                />
            </label>
            <StripeCheckout
                token={handleToken}
                name="Loan App Inc."
                currency="NGN"
                amount={amount} // Amount in kobo
                stripeKey="pk_test_51QT6InDFDXEbOPO35RWv9SY8YW9XrFy9Uv4IiUtcHN3Pcu58m25iV4kRAmgFukMoFsLlFrADzsdmbneV9tNyryOG006RSQfnxl"
            />
        </div>
    );
};

export default CardPayment;
