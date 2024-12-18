import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, resetredirect } from "./store";
import "./login.css";
import { useNavigate } from "react-router-dom";

import { NavLink } from "react-router-dom";


const Login = () => {
  let navigate = useNavigate()
  const dispatch = useDispatch();
  const { redirect, resetredirect } = useSelector((state) => state.user);

  const [users, setUser] = useState({
    email: "",
    password: "",
  });
  // useEffect(() => {
  //   if (redirect) {
  //     navigate(redirect)
  //     resetredirect(redirect
  //   }
  // }, [redirect, resetredirect])

  const trackLogin = (e) => {
    setUser({ ...users, [e.target.name]: e.target.value });
  };

  const getUser = (e) => {
    e.preventDefault();
    dispatch(login(users));
    navigate('/')
  };

  return (
    <div className="body">
      <div className="login-container">
        <div className="login-left">
          <div className="logo">
            <h1>Loan App</h1>
          </div>
          <form onSubmit={getUser} className="login-form">
            <h2>Login</h2>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={users.email}
                onChange={trackLogin}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={users.password}
                onChange={trackLogin}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Login
            </button>
            <NavLink to='/register' className="forgot-password">Register</NavLink>
          </form>
        </div>
        <div className="login-right">
          <div className="illustration">
            {/* Illustration image */}
            <img
              src="public\digital-banking.jpg" // Replace with actual illustration URL
              alt="Illustration"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;