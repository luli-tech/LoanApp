import React, { useState } from "react";
import "./navbar.css";
import { Outlet } from "react-router-dom";
import Footer from "./footer";
import { logout } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { ActiveUser } = useSelector((state) => state.user); // Destructure ActiveUser from state

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Logout Handler
  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate("/");
  };

  return (
    <div>
      <div className="navbar-container">
        {/* Navbar */}
        <nav className="navbar">
          <button className="menu-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <NavLink to="/" className="navbar-title">
            LoanApp
          </NavLink>
        </nav>

        {/* Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            {/* Display user image or fallback */}
            <img
              className="user-pic"
              src={ActiveUser?.image || "default-image-url.jpg"}
              alt="User"
            />
            {/* Display user name or fallback */}
            <h3 className="user-name">{ActiveUser?.name || "Guest"}</h3>
            <p className="user-status">
              {ActiveUser ? "Active" : "Not Logged In"}
            </p>
          </div>

          <ul className="sidebar-menu">
            <NavLink to="/" className="sidebar-item">
              Home
            </NavLink>
            <NavLink to="/profile" className="sidebar-item">
              Profile
            </NavLink>
            <NavLink to="/status" className="sidebar-item">
              Loan Status
            </NavLink>
            <NavLink to="/history" className="sidebar-item">
              Loan History
            </NavLink>

            {/* Conditional Rendering for Login/Logout */}
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

        {/* Backdrop for Sidebar */}
        {isSidebarOpen && (
          <div className="backdrop" onClick={toggleSidebar}></div>
        )}
      </div>

      {/* Page Content */}
      <div className="outlet">
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Navbar;
