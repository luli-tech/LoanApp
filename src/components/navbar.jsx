import React, { useState, useEffect } from "react";
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

  // Calculate user balance
  const balance = ActiveUser?.approved?.reduce(
    (total, loan) => total + (loan.loanAmount || 0),
    0
  ) || 0;

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 704);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 704);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle Sidebar
  const toggleSidebar = () => setIsSidebarOpen((prevState) => !prevState);

  // Logout Handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  function login() {
    navigate("/login");
  }

  return (
    <div className="navbar-layout">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <img
            className="user-pic"
            src={ActiveUser?.image || "default-image-url.jpg"}
            alt="User"
          />
          <h3 className="user-name">{ActiveUser?.name || "Guest"}</h3>
          <p className="user-status">{ActiveUser ? "Active" : "Not Logged In"}</p>
          <h3>Balance: ${balance.toFixed(2)}</h3>
        </div>
        <ul className="sidebar-menu">
          <NavLink to="/" className="sidebar-item">
            Home
          </NavLink>
          {ActiveUser && (
            <>
              <NavLink o to="/profile" className="sidebar-item">
                Profile
              </NavLink>
              <NavLink o to="/status" className="sidebar-item">
                Loan Status
              </NavLink>
              <NavLink o to="/history" className="sidebar-item">
                Loan History
              </NavLink>
            </>
          )}
          {ActiveUser ? (
            <button onClick={handleLogout} className="sidebar-item">
              Logout
            </button>
          ) : (
            <p onClick={login} className="sidebar-item">
              Login
            </p>
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
