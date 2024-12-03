import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store";
import { NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Footer from "./footer";
import "./navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ActiveUser } = useSelector((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  // Logout Handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="navbar-layout">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img
            className="user-pic"
            src={ActiveUser?.image || "default-image-url.jpg"}
            alt="User"
          />
          <h3 className="user-name">{ActiveUser?.name || "Guest"}</h3>
          <p className="user-status">
            {ActiveUser ? "Active" : "Not Logged In"}
          </p>
        </div>
        <ul className="sidebar-menu">
          <NavLink onClick={toggleSidebar} to="/" className="sidebar-item">
            Home
          </NavLink>
          {ActiveUser && (<div>
            <NavLink onClick={toggleSidebar} to="/profile" className="sidebar-item">
              Profile
            </NavLink>
            <NavLink onClick={toggleSidebar} to="/status" className="sidebar-item">
              Loan Status
            </NavLink>
            <NavLink onClick={toggleSidebar} to="/history" className="sidebar-item">
              Loan History
            </NavLink></div>)}
          {ActiveUser ? (
            <NavLink onClick={handleLogout} to="/" className="sidebar-item">
              Logout
            </NavLink>
          ) : (
            <NavLink to="/login" className="sidebar-item">
              Login
            </NavLink>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <nav className="navbar">
          <button className="menu-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <NavLink to="/" className="navbar-title">
            LoanApp
          </NavLink>
        </nav>
        <div className="outlet">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Navbar;
