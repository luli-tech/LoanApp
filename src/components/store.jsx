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
        alert("User already exists");
      } else if (
        action.payload.name.length < 1 ||
        action.payload.password.length < 1
      ) {
        alert("Name and password cannot be empty");
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
          safeSetItem("activeUser", state.ActiveUser);
          safeSetItem("users", state.user);
        } else {
          alert("Incorrect password");
        }
      } else {
        alert("User not found");
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
      if (state.ActiveUser) {
        const updatedUser = {
          ...state.ActiveUser,
          loans: [...(state.ActiveUser.loans || []), action.payload.loan],
        };

        state.ActiveUser = updatedUser;

        state.user = state.user.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );

        safeSetItem("activeUser", updatedUser);
        safeSetItem("users", state.user);
      }
    },
    confirmLoan: (state, action) => {
      if (!state.ActiveUser) return;

      const { age, loans = [], approved = [] } = state.ActiveUser;

      if (!age) {
        console.log("Please, update your age");
        return;
      }

      if (age < 18) {
        console.log("You're too young to borrow; you're not eligible");
        return;
      }

      if (approved.includes(action.payload)) {
        console.log("This loan is already approved");
        return;
      }

      const updatedUser = {
        ...state.ActiveUser,
        approved: [...approved, action.payload],
      };

      state.ActiveUser = updatedUser;
      state.user = state.user.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );

      safeSetItem("activeUser", updatedUser);
      safeSetItem("users", state.user);
    },
  },
});

// Export actions
export const { newUser, login, logout, setProfile, getLoans, confirmLoan } =
  userSlice.actions;

// Configure the Redux store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;
