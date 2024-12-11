import { createSlice, configureStore, createAsyncThunk } from "@reduxjs/toolkit";


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
  errormessage: null,
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

// Loan validation function
const validateLoanEligibility = (user, loanAmount) => {
  if (loanAmount < 4000 || loanAmount > 100000) {
    return "Loan amount must be between ₦4,000 and ₦100,000.";
  }
  if (!user.age || user.age < 18) {
    return "You must be at least 18 years old to apply for a loan.";
  }
  if (user.loans?.some((loan) => loan.status === "approved")) {
    return "You have an unpaid loan. Please clear it before applying for another.";
  }
  return null;
};

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
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
          accountBalance: 0,
        };
        state.user.push(newUser);
        state.redirect = "/login";
        state.successmessage = "Account successfully created";
        safeSetItem("users", state.user);
      }
    },
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
          state.redirect = '/'
          state.ActiveUser = updatedUser;
          state.successmessage = "Login success";
          safeSetItem("activeUser", state.ActiveUser);
          safeSetItem("users", state.user);
        } else {
          state.errormessage = "Incorrect password";
        }
      } else {
        state.errormessage = "User not found";
      }
    },
    logout: (state) => {
      if (state.ActiveUser) {
        state.user = state.user.map((user) =>
          user.id === state.ActiveUser.id
            ? { ...user, isAuthenticated: false }
            : user
        );
        state.redirect = '/login'
        state.ActiveUser = null;
        safeSetItem("users", state.user);
        localStorage.removeItem("activeUser");
        state.successmessage = "Logout success";
      }
    },
    setProfile: (state, action) => {
      if (state.ActiveUser && state.ActiveUser.isAuthenticated) {
        const updatedUser = { ...state.ActiveUser, ...action.payload };
        state.ActiveUser = updatedUser;
        state.user = state.user.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        state.successmessage = "Profile updated successfully";
        safeSetItem("activeUser", updatedUser);
        safeSetItem("users", state.user);
      }
    },
    terms: (state, action) => {
      const { terms } = action.payload; // Extract only the terms field
      if (!state.ActiveUser) return;

      if (terms === "accepted") {
        state.redirect = '/apply'
        state.successmessage = "Terms accepted";
      } else if (terms === "rejected") {
        state.errormessage = "Loan not available at the moment";
        state.redirect = "/";
      }

      const updatedUser = { ...state.ActiveUser, terms };
      state.ActiveUser = updatedUser;
      state.user = state.user.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );

      safeSetItem("activeUser", updatedUser);
      safeSetItem("users", state.user);
    },

    getLoans: (state, action) => {
      if (!state.ActiveUser) {
        state.errormessage = "Please log in to apply for a loan!";
        return;
      }
      const loanAmount = action.payload.loan.loanAmount;
      const errorMessage = validateLoanEligibility(state.ActiveUser, loanAmount);
      if (errorMessage) {
        state.errormessage = errorMessage;
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
      state.redirect = "/confirm";
      safeSetItem("activeUser", updatedUser);
      safeSetItem("users", state.user);
      state.successmessage = "Loan application successful!";
    },
    confirmLoan: (state, action) => {
      if (!state.ActiveUser) return;
      const { loans = [] } = state.ActiveUser;
      const updatedLoans = loans.map((loan) =>
        loan.id === action.payload.id ? { ...loan, status: "approved" } : loan
      );
      const balance = updatedLoans
        .filter((loan) => loan.status === "approved")
        .reduce((total, loan) => total + loan.loanAmount, 0);
      const updatedUser = {
        ...state.ActiveUser,
        loans: updatedLoans,
        balance,
      };
      state.ActiveUser = updatedUser;
      state.user = state.user.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      state.redirect = "/success";
      safeSetItem("activeUser", updatedUser);
      safeSetItem("users", state.user);
    }, repayment: (state, action) => {
      if (!state.ActiveUser) {
        state.errormessage = "Please log in to repay a loan.";
        return;
      }

      const { id, loanAmount } = action.payload;

      // Validate loan existence and status
      const loan = state.ActiveUser.loans?.find((loan) => loan.id === id);
      if (!loan) {
        state.errormessage = "Loan not found.";
        return;
      }
      if (loan.status !== "approved") {
        state.errormessage = "Loan not approved for repayment.";
        return;
      }

      // Validate repayment amount
      if (loanAmount <= 0) {
        state.errormessage = "Repayment amount must be greater than zero.";
        return;
      }
      if (loanAmount > loan.totalAmountDue) {
        state.errormessage = "Repayment amount exceeds the total amount due.";
        return;
      }

      // Validate user account balance
      if (state.ActiveUser.accountBalance < loanAmount) {
        state.errormessage = "Insufficient balance, please fund your account.";
        return;
      }

      // Update loan details and status
      const updatedLoans = state.ActiveUser.loans.map((loanItem) =>
        loanItem.id === id
          ? {
            ...loanItem,
            totalAmountDue: loanItem.totalAmountDue - loanAmount,
            status: loanItem.totalAmountDue - loanAmount <= 0 ? "paid" : "approved",
          }
          : loanItem
      );

      // Deduct repayment amount from user account balance
      const updatedBalance = state.ActiveUser.accountBalance - loanAmount;

      // Add repayment record
      const repaymentRecord = {
        id,
        loanAmount,
        date: new Date().toISOString(),
        status: "repayment",
      };

      const updatedUser = {
        ...state.ActiveUser,
        loans: updatedLoans,
        accountBalance: updatedBalance,
        repayments: [...(state.ActiveUser.repayments || []), repaymentRecord],
      };

      // Update state
      state.ActiveUser = updatedUser;
      state.user = state.user.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );

      // Store data locally (assuming `safeSetItem` is a helper function for localStorage)
      safeSetItem("activeUser", updatedUser);
      safeSetItem("users", state.user);

      // Success message
      state.successmessage =
        updatedLoans.find((loan) => loan.id === id).status === "paid"
          ? "Loan fully repaid successfully."
          : "Partial repayment successful.";
    },

    accountFunding: (state, action) => {
      if (!state.ActiveUser) {
        state.errormessage = "Please log in to fund your account.";
        return;
      }
      const amount = action.payload;
      const updatedUser = {
        ...state.ActiveUser,
        accountBalance: (state.ActiveUser.accountBalance || 0) + amount,
      };
      state.ActiveUser = updatedUser;
      state.user = state.user.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      state.successmessage = "Account funded successfully!";
      safeSetItem("activeUser", updatedUser);
      safeSetItem("users", state.user);
    },
    resetredirect: (state) => {
      state.redirect = null;
    },
    resetMessage: (state) => {
      state.successmessage = null;
      state.errormessage = null;
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
  accountFunding,
  terms
} = userSlice.actions;

// Configure Redux store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;
