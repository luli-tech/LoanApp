import "./loanHistory.css";
import { useSelector } from "react-redux";

const LoanHistory = () => {
  let { ActiveUser } = useSelector((state) => state.user);
  let { approved, loans } = ActiveUser;
  let total = [...approved, ...loans];
  let history = total.reduce((acc, currentLoan) => {
    const existingLoanIndex = acc.findIndex(
      (loan) => loan.id === currentLoan.id
    );

    if (existingLoanIndex === -1) {
      // If no duplicate is found, add the loan
      acc.push(currentLoan);
    } else if (currentLoan.status === "approved") {
      // If a duplicate is found and current loan is "approved", replace the existing one
      acc[existingLoanIndex] = currentLoan;
    }

    return acc;
  }, []);

  return (
    <div className="loan-history">
      <h2>Loan History</h2>
      <table className="loan-history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Loan Amount</th>
            <th>Status</th>
            <th>id</th>
            <th>interest</th>
            <th>totalAmountDue</th>
          </tr>
        </thead>
        <tbody>
          {history.map((loan, index) => (
            <tr key={loan.id}>
              <td>date</td>
              <td>${loan.loanAmount}</td>
              <td>{loan.status}</td>
              <td>{loan.id}</td>
              <td>${loan.interest}</td>
              <td>{loan.loanAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanHistory;
