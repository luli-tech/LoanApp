import "./register.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { newUser } from "./store";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Register = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let [getuser, setgetUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  let { user } = useSelector((state) => state.user);
  useEffect(() => {
    console.log(user);
  }, []);
  function getSetname(e) {
    setgetUser({
      ...getuser,
      [e.target.name]: e.target.value,
    });
  }
  function getRegister() {
    dispatch(
      newUser({
        name: getuser.name,
        email: getuser.email,
        password: getuser.password,
      })
    );
    getuser.name = "";
    getuser.email = "";
    getuser.password = "";
    navigate("/login");
  }
  return (
    <div className="register-form">
      <h2>Create an Account</h2>
      <form onClick={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Name</label>
          <input
            value={getuser.name}
            type="text"
            name="name"
            placeholder="Enter your name"
            onChange={getSetname}
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            value={getuser.email}
            onChange={getSetname}
            type="email"
            name="email"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            value={getuser.password}
            name="password"
            onChange={getSetname}
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <button
          onClick={() => getRegister()}
          type="submit"
          className="cta-primary"
        >
          Register
        </button>
      </form>
      <NavLink to="/login">Alredy have an account? Login</NavLink>
    </div>
  );
};

export default Register;
