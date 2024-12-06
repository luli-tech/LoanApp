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
  message: null,
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

// Utility function to validate loan eligibility
const validateLoanEligibility = (user, loanAmount) => {
  if (loanAmount < 4000 || loanAmount > 100000) {
    return "Loan amount must be between ₦4,000 and ₦100,000";
  }
  if (!user.age || user.age < 18) {
    return "You must be at least 18 years old to apply for a loan.";
  }
  if (user.loans?.find((loan) => loan.status === "approved")) {
    return "You have an unpaid loan.";
  }
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
        state.message = "User already exists";
        state.redirect = "/login";
      } else if (
        action.payload.name.length < 1 ||
        action.payload.password.length < 1
      ) {
        state.message = "Name and password cannot be empty";
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
        state.message = "Account successfully created";
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
          state.message = "Incorrect password";
        }
      } else {
        state.message = "User not found";
      }
    },

    // Action: Logout User
    logout: (state) => {
      if (state.ActiveUser) {
        state.user = state.user.map((user) =>
          user.id === state.ActiveUser.id
            ? { ...user, isAuthenticated: false }
            : user
        );
        state.ActiveUser = null;
        safeSetItem("users", state.user);
        localStorage.removeItem("activeUser");
      }
    },

    // Action: Update Profile
    setProfile: (state, action) => {
      if (state.ActiveUser && state.ActiveUser.isAuthenticated) {
        const updatedUser = { ...state.ActiveUser, ...action.payload };
        state.ActiveUser = updatedUser;
        state.user = state.user.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        safeSetItem("activeUser", updatedUser);
        safeSetItem("users", state.user);
      }
    },

    // Action: Apply for Loan
    getLoans: (state, action) => {
      if (!state.ActiveUser) {
        state.message = "Please log in to apply for a loan!";
        return;
      }

      let errorMessage = validateLoanEligibility(
        state.ActiveUser,
        action.payload.loan.loanAmount
      );
      if (errorMessage) {
        state.message = errorMessage;
        return;
      }

      const updatedUser = {
        ...state.ActiveUser,
        loans: [...(state.ActiveUser.loans || []), action.payload.loan],
      };

      state.ActiveUser = updatedUser;
      state.user = state.user.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      state.redirect = '/confirm'
      safeSetItem("activeUser", updatedUser);
      safeSetItem("users", state.user);
      state.message = "Loan application successful!";
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
        state.message = "Please log in to repay a loan.";
        return;
      }

      const { loanId, amount } = action.payload;
      let totalAmountDueExceeded = false;

      // Update loans to apply the repayment
      const updatedLoans = state.ActiveUser.loans?.map((loan) => {
        if (loan.id === loanId && loan.status === "approved") {
          const newTotal = loan.totalAmountDue - amount;

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
        state.message = "Repayment amount exceeds the total amount due.";
        return;
      }

      // Check if user balance is sufficient for repayment
      if (state.ActiveUser.balance < amount) {
        state.message = "Insufficient balance, please fund your account.";
        return;
      }

      // Deduct repayment amount from user's balance
      const updatedBalance = state.ActiveUser.balance - amount;

      // Update ActiveUser object
      const updatedUser = {
        ...state.ActiveUser,
        loans: updatedLoans,
        balance: updatedBalance, // Deducted balance after repayment
        repayments: [
          ...(state.ActiveUser.repayments || []),
          { loanId, amount, date: new Date().toISOString() }, // Record repayment
        ],
      };

      // Update state and persist changes to localStorage
      state.ActiveUser = updatedUser;
      state.user = state.user.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );

      state.message = "Repayment successful!";
      safeSetItem("activeUser", updatedUser);
      safeSetItem("users", state.user);
    },
    accountFunding: (state, action) => {
      if (!state.ActiveUser) {
        state.message = "Please log in to fund your account.";
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

      state.message = "Account funded successfully!";
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
