import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import "./error.css";
import Swal from "sweetalert2";
import { resetMessage } from "./store";

const Error = () => {
    let { errormessage = '', successmessage } = useSelector(state => state.user)
    const dispatch = useDispatch();
    let message = errormessage ? 'error' : 'success'
    let msg = errormessage ? errormessage : successmessage
    let comment = errormessage ? 'Oops' : 'success'
    useEffect(() => {
        // Show the SweetAlert2 error message
        Swal.fire({
            icon: message,
            title: comment,
            text: msg,
            confirmButtonText: "OK",
            timer: 3000, // Auto-close after 3 seconds
            timerProgressBar: true,
        }).then(() => {
            // Clear the message after the alert is closed
            dispatch(resetMessage());
        });
    }, [errormessage, dispatch]);

    return null
};

export default Error;
