import { createSlice, configureStore } from "@reduxjs/toolkit";
import { redirect } from "react-router-dom";

// Initial State
const initialState = {
  user: JSON.parse(localStorage.getItem("users")) || [
    {
      id: 1,
      name: "John",
      email: "john@gmail.com",
      password: "1234",
      age: "24",
      gender: "male",
      address: "USA",
      phone: "1234567890",
      role: "user",
      isAuthenticated: false,
    },
  ],
  ActiveUser: JSON.parse(localStorage.getItem("activeUser")) || null,
  redirect: null,
  successmessage: null,
  errormessage: null
};

// Utility function to safely set items in localStorage
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      console.error("LocalStorage quota exceeded. Clearing storage...");
      localStorage.clear();
    } else {
      console.error("Error saving to localStorage:", error);
    }
  }
};

const validateLoanEligibility = (user, loanAmount) => {
  // Validate loan amount range
  if (loanAmount < 4000 || loanAmount > 100000) {
    return "Loan amount must be between ₦4,000 and ₦100,000.";
  }

  // Validate user's age
  if (!user.age || user.age < 18) {
    return "You must be at least 18 years old to apply for a loan.";
  }

  // Check for any unpaid loans
  if (user.loans?.some((loan) => loan.status === "approved")) {
    return "You have an unpaid loan. Please clear it before applying for another.";
  }

  // If all validations pass, return null
  return null;
};

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action: Register New User
    newUser: (state, action) => {
      const existingUser = state.user.find(
        (user) => user.email === action.payload.email
      );
      if (existingUser) {
        state.errormessage = "User already exists";
        state.redirect = "/login";
      } else if (
        action.payload.name.length < 1 ||
        action.payload.password.length < 1
      ) {
        state.errormessage = "Name and password cannot be empty";
      } else {
        const newUser = {
          ...action.payload,
          id: state.user.length + 1,
          isAuthenticated: false,
          loanBalance: 0,
          accountBalance: 0

        };
        state.user.push(newUser);
        state.redirect = "/login";
        state.successmessage = "Account successfully created";
        safeSetItem("users", state.user);
      }
    },

    // Action: Login User
    login: (state, action) => {
      const user = state.user.find(
        (user) => user.email === action.payload.email
      );
      if (user) {
        if (user.password === action.payload.password) {
          const updatedUser = { ...user, isAuthenticated: true };
          state.user = state.user.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          );
          state.ActiveUser = updatedUser;
          state.redirect = "/";
          safeSetItem("activeUser", state.ActiveUser);
          safeSetItem("users", state.user);
        } else {
          state.errormessage = "Incorrect password";
          return
        }
      } else {
        state.errormessage = "User not found";
        return
      }
    },

    // Action: Logout User
    logout: (state) => {
      state.successmessage = 'logout success'
      if (state.ActiveUser) {
        state.user = state.user.map((user) =>
          user.id === state.ActiveUser.id
            ? { ...user, isAuthenticated: false }
            : user
        );
        state.successmessage = 'logout success'
        state.ActiveUser = null;
        safeSetItem("users", state.user);
        localStorage.removeItem("activeUser");
      }
      state.successmessage = 'logout success'
    },

    // Action: Update Profile
    setProfile: (state, action) => {
      if (state.ActiveUser && state.ActiveUser.isAuthenticated) {
        const updatedUser = { ...state.ActiveUser, ...action.payload };
        state.ActiveUser = updatedUser;
        state.user = state.user.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        state.successmessage = 'profile set sussessfuly'
        safeSetItem("activeUser", updatedUser);
        safeSetItem("users", state.user);
      }
    },

    getLoans: (state, action) => {
      if (!state.ActiveUser) {
        state.errormessage = "Please log in to apply for a loan!";
        return;
      }

      const loanAmount = action.payload.loan.loanAmount;

      // Validate loan eligibility
      const errorMessage = validateLoanEligibility(state.ActiveUser, loanAmount);
      if (errorMessage) {
        state.errormessage = errorMessage; // Use error from validation function
        return;
      }

      // Ensure loan amount is within valid range
      if (loanAmount < 1 || loanAmount > 4000) {
        state.errormessage = "Loan amount must be between 1 and 4000.";

      }

      // Loan is approved
      const updatedUser = {
        ...state.ActiveUser,
        loans: [...(state.ActiveUser.loans || []), action.payload.loan], // Add new loan to user's loan list
      };

      // Update state
      state.ActiveUser = updatedUser;
      state.user = state.user.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      state.redirect = "/confirm"; // Mark redirect path
      safeSetItem("activeUser", updatedUser); // Save user state to storage
      safeSetItem("users", state.user); // Save all users to storage
      state.successmessage = "Loan application successful!";
    },


    // Action: Confirm Loan
    confirmLoan: (state, action) => {
      if (!state.ActiveUser) return;

      const { loans = [] } = state.ActiveUser;

      // Update the loan's status to 'approved'
      const updatedLoans = loans.map((loan) =>
        loan.id === action.payload.id ? { ...loan, status: "approved" } : loan
      );

      // Calculate the balance based on loans with 'approved' status
      const balance = updatedLoans
        .filter((loan) => loan.status === "approved")
        .reduce((total, loan) => total + loan.loanAmount, 0);

      const updatedUser = {
        ...state.ActiveUser,
        loans: updatedLoans,
        balance, // Set the new balance
      };

      // Update the state and localStorage
      state.ActiveUser = updatedUser;
      state.user = state.user.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      state.redirect = "/success";
      safeSetItem("activeUser", updatedUser);
      safeSetItem("users", state.user);
    },
    repayment: (state, action) => {
      if (!state.ActiveUser) {
        state.errormessage = "Please log in to repay a loan.";
        return;
      }

      const { id, loanAmount } = action.payload;
      let totalAmountDueExceeded = false;

      // Update loans to apply the repayment
      const updatedLoans = state.ActiveUser.loans?.map((loan) => {
        if (loan.id === id && loan.status === "approved") {
          const newTotal = loan.totalAmountDue - loanAmount;

          if (newTotal < 0) {
            totalAmountDueExceeded = true; // Prevent overpayment
          }

          return {
            ...loan,
            totalAmountDue: newTotal > 0 ? newTotal : 0,
            status: newTotal > 0 ? "approved" : "paid", // Update status if fully repaid
          };
        }
        return loan;
      });

      // Prevent repayment if it exceeds total amount due
      if (totalAmountDueExceeded) {
        state.errormessage = "Repayment amount exceeds the total amount due.";
        return;
      }

      // Check if user balance is sufficient for repayment
      if (state.ActiveUser.accountBalance < loanAmount) {
        state.errormessage = "Insufficient balance, please fund your account.";
        return;
      }

      // Deduct repayment amount from user's balance
      const updatedBalance = state.ActiveUser.accountBalance - loanAmount;

      // Update ActiveUser object
      const updatedUser = {
        ...state.ActiveUser,
        loans: updatedLoans,
        accountBalance: updatedBalance, // Deducted balance after repayment
        repayments: [
          ...(state.ActiveUser.repayments || []),
          { id, loanAmount, date: new Date().toISOString(), status: 'repayment' }, // Record repayment
        ],
      };

      // Update state and persist changes to localStorage
      state.ActiveUser = updatedUser;
      state.user = state.user.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );

      state.successmessage = "Repayment successful!";
      safeSetItem("activeUser", updatedUser);
      safeSetItem("users", state.user);
    },
    accountFunding: (state, action) => {
      if (!state.ActiveUser) {
        state.errormessage = "Please log in to fund your account.";
        return;
      }

      const amount = action.payload;

      // Update balance
      const updatedUser = {
        ...state.ActiveUser,
        accountBalance: (state.ActiveUser.accountBalance || 0) + amount,
      };

      // Update state and localStorage
      state.ActiveUser = updatedUser;
      state.user = state.user.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );

      state.successmessage = "Account funded successfully!";
      safeSetItem("activeUser", updatedUser);
      safeSetItem("users", state.user);
    },

    // Reset Temporary Redirect and Message
    resetredirect: (state) => {
      state.redirect = null;
    },
    resetMessage: (state) => {
      state.message = null;
    },
  },
});

// Export actions
export const {
  resetMessage,
  newUser,
  login,
  logout,
  setProfile,
  getLoans,
  confirmLoan,
  repayment,
  resetredirect,
  accountFunding
} = userSlice.actions;

// Configure the Redux store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;
