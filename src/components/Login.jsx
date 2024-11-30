import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login } from "./store";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Login = () => {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let { user, ActiveUser } = useSelector((state) => state.user);
  let [users, setUser] = useState({
    email: "",
    password: "",
  });
  useEffect(() => console.log(user), []);
  function trackLogin(e) {
    setUser({ ...users, [e.target.name]: e.target.value });
  }
  useEffect(() => {
    console.log(ActiveUser);
  });
  function getUser(e) {
    e.preventDefault();
    dispatch(login(users));
    console.log(user);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }
  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={getUser}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={users.email}
            onChange={trackLogin}
            placeholder="Enter your email"
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
          />
        </div>

        <button type="submit" className="cta-primary">
          Login
        </button>
      </form>
      <div>
        <NavLink to="/register">Don't have an account? Register</NavLink>
      </div>
    </div>
  );
};

export default Login;
