import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import "./error.css";
import Swal from "sweetalert2";
import { resetMessage } from "./store";

const Error = () => {
    let { message = '' } = useSelector(state => state.user)
    const dispatch = useDispatch();
    useEffect(() => {
        if (message) {
            // Show the SweetAlert2 error message
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: message,
                confirmButtonText: "OK",
                timer: 3000, // Auto-close after 3 seconds
                timerProgressBar: true,
            }).then(() => {
                // Clear the message after the alert is closed
                dispatch(resetMessage());
            });
        }
    }, [message, dispatch]);

    return null
};

export default Error;