import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { newUser } from "./store";
import "./register.css";


const Register = () => {
  const navigate = useNavigate();
  function log() {
    navigate('/login')
  }
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { redirect } = useSelector((state) => state.user);
  useEffect(() => {
    if (redirect) {
      navigate(redirect);
    }
  }, [redirect, navigate]);

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(
      newUser({
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password,
      })
    );
    setUserDetails({ name: "", email: "", password: "" });
  };

  return (
    <div className="body">
      <div className="register-container">
        <div className="register-left">
          <div className="register-content">
            <h2>Create an Account</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={userDetails.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={userDetails.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>
              <button type="submit" className="btn-primary">
                Register
              </button>
            </form>
            <button onClick={log} className="login-link">
              Already have an account? Login
            </button>
          </div>
        </div>
        <div className="register-right">
          <div className="illustration">
            <img
              src="https://via.placeholder.com/400x400" /* Replace with your illustration */
              alt="Illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;