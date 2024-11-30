import "./App.css";
import Navbar from "./components/navbar";
// import TransactionSummary from "./transactionSummary";
import TermsAndConditions from "./components/TermsConditions";
import FAQ from "./components/faq";
import LoanApplicationForm from "./components/loanApplication";
import LoanStatus from "./components/loanStatus";
import Homepage from "./components/homepage";
import LoanHistory from "./components/loanHistory";
import Login from "./components/Login";
import Register from "./components/register";
import UserProfile from "./components/userProfile";
import TransactionSummary from "./components/transactionSummary";
import SuccessMessage from "./components/successmessage";
import LoanApplication from "./components/approve";
import ConfirmationDialog from "./components/confirm";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

function App() {
  let router = createBrowserRouter(
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
        <Route path="/apply" element={<LoanApplicationForm />} />
        <Route path="/summary" element={<TransactionSummary />} />
        <Route path="/success" element={<SuccessMessage />} />
        <Route path="/ask" element={<LoanApplication />} />
        <Route path="/confirm" element={<ConfirmationDialog />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
