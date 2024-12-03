import { createSlice, configureStore } from "@reduxjs/toolkit";

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
  message: null
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
        state.message = "User already exists"
        state.redirect = '/login'
      } else if (
        action.payload.name.length < 1 ||
        action.payload.password.length < 1
      ) {
        state.message = "Name and password cannot be empty"
      } else {
        state.user.push({
          ...action.payload,
          id: state.user.length + 1,
          isAuthenticated: false,
        });
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
          state.user = state.user.map((u) =>
            u.id === user.id ? updatedUser : u
          );
          state.ActiveUser = updatedUser;
          state.redirect = '/'
          safeSetItem("activeUser", state.ActiveUser);
          safeSetItem("users", state.user);

        } else {
          state.message = "Incorrect password"
          state.redirect = '/login'
          return
        }
      } else {
        state.message = "User not found"
        state.redirect = '/register'
      }
    },
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
    getLoans: (state, action) => {
      if (!state.ActiveUser) {
        state.message = "Please log in to apply for a loan!";
        return;
      }

      const { loanAmount, tenure } = action.payload.loan;

      if (loanAmount < 4000 || loanAmount > 100000) {
        state.message = "Loan amount must be between ₦4,000 and ₦100,000";
        return;
      }

      if (!state.ActiveUser.age || state.ActiveUser.age < 18) {
        state.message = "You must be at least 18 years old to apply for a loan.";
        return;
      }

      const activeLoan = state.ActiveUser.approved?.find(
        (loan) => loan.status === "approved"
      );
      if (activeLoan) {
        state.message = "You already have an active loan.";
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

      state.message = "Loan successfully applied!";
      safeSetItem("activeUser", updatedUser);
      safeSetItem("users", state.user);
    },

    confirmLoan: (state, action) => {
      if (!state.ActiveUser) return;

      const { age, loans = [], approved = [] } = state.ActiveUser;

      if (!age) {
        state.message = "Please, update your age"

      }

      if (age < 18) {
        state.message = "You're too young to borrow; you're not eligible"

      }

      if (approved.includes(action.payload)) {
        state.message = "This loan is already approved"

      }
      let activeLoan = state.ActiveUser?.approved?.find(
        (active) => active.status === "approved"
      );
      if (activeLoan) {
        state.message = "you have an active loan"

      } if (age) {
        const updatedUser = {
          ...state.ActiveUser,
          approved: [...approved, action.payload],
        };

        state.ActiveUser = updatedUser;
        state.user = state.user.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        state.redirect = '/success'
        safeSetItem("activeUser", updatedUser);
        safeSetItem("users", state.user);
      }
    },
    resetredirect: (state) => {
      state.redirect = null
    },
    resetMessage: (state) => {
      state.message = null;
    },
  },
});

// Export actions
export const { resetMessage, newUser, login, logout, setProfile, getLoans, confirmLoan, resetredirect } =
  userSlice.actions;

// Configure the Redux store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;
