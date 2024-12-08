import "./App.css";
import 'aos/dist/aos.css';
import AOS from 'aos';
import Navbar from "./components/navbar";
import TermsAndConditions from "./components/TermsConditions";
import FAQ from "./components/faq";
import LoanApplicationForm from "./components/loanApplication";
import LoanStatus from "./components/loanStatus";
import Homepage from "./components/homepage";
import LoanHistory from "./components/loanHistory";
import Login from "./components/Login";
import Pay from "./components/pay";
import Register from "./components/register";
import UserProfile from "./components/userProfile";
import TransactionSummary from "./components/transactionSummary";
import SuccessMessage from "./components/successmessage";
import LoanApplication from "./components/approve";
import ConfirmationDialog from "./components/confirm";
import Spinner from "./components/spinner";
import Typewriter from "./components/typewriter";
import Error from "./components/error";
import CardPAyment from "./components/cardPAyment";
import LoanRepayment from "./components/LoanRepayment";
import { useEffect, useMemo } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

function App() {
  // Memoizing the AOS configuration
  const aosConfig = useMemo(() => ({
    duration: 2000, // Animation duration in milliseconds
    once: true,     // Whether animation should happen only once
  }), []); // Empty dependency array means it will not change after initial load

  useEffect(() => {
    AOS.init(aosConfig); // Initialize AOS with the memoized configuration
    return () => {
      AOS.refresh(); // Refresh AOS when the component unmounts
    };
  }, [aosConfig]); // Effect runs when aosConfig changes (though it's memoized and won't change)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Navbar />}>
        <Route index element={<Homepage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/status" element={<LoanStatus />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/history" element={<LoanHistory />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/error" element={<Error />} />
        <Route path="/repay" element={<LoanRepayment />} />
        <Route path="/spin" element={<Spinner />} />
        <Route path="/apply" element={<LoanApplicationForm />} />
        <Route path="/loan-details/:id" element={<TransactionSummary />} />
        <Route path="/success" element={<SuccessMessage />} />
        <Route path="/ask" element={<LoanApplication />} />
        <Route path="/type" element={<Typewriter />} />
        <Route path="/card" element={<CardPAyment />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/confirm" element={<ConfirmationDialog />} />
      </Route>
    )
  )


  return (
    <div><RouterProvider router={router} />

    </div>)
}

export default App;
