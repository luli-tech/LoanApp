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

  // Calculate total amount due
  const realAmountDue = ActiveUser?.loans?.filter((user) => user.status === 'approved')?.reduce((total, loan) => total + loan.totalAmountDue, 0) || 0;

  // Sidebar open/close state
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 704);

  // Update sidebar state on window resize
  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth > 704);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => setIsSidebarOpen((prevState) => !prevState);
  let width = window.innerWidth < 800
  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const renderLinks = () => {
    if (ActiveUser) {
      if (width) {
        // Render compact sidebar for small screens
        return (
          <>
            <NavLink onClick={toggleSidebar} to="/" className="sidebar-item">Home</NavLink>
            <NavLink onClick={toggleSidebar} to="/card" className="sidebar-item">Fund My Account</NavLink>
            <NavLink onClick={toggleSidebar} to="/status" className="sidebar-item">Loan Status</NavLink>
            <NavLink onClick={toggleSidebar} to="/repay" className="sidebar-item">Repayment</NavLink>
            <NavLink onClick={toggleSidebar} to="/history" className="sidebar-item">Loan History</NavLink>
            <button onClick={handleLogout} className="sidebar-item">Logout</button>
          </>
        );
      } else {
        // Render full sidebar for larger screens
        return (
          <>
            <NavLink to="/" className="sidebar-item">Home</NavLink>
            <NavLink to="/card" className="sidebar-item">Fund My Account</NavLink>
            <NavLink to="/status" className="sidebar-item">Loan Status</NavLink>
            <NavLink to="/repay" className="sidebar-item">Repayment</NavLink>
            <NavLink to="/history" className="sidebar-item">Loan History</NavLink>
            <NavLink onClick={handleLogout} className="sidebar-item">Logout</NavLink>
          </>
        );
      }
    } else {
      // Render login option if user is not logged in
      return (
        <NavLink to='/login' className="sidebar-item">
          Login
        </NavLink>
      );
    }
  };


  return (
    <div className="navbar-layout">
      {/* Sidebar */}
      <div
        className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}
        aria-hidden={!isSidebarOpen}
        role="navigation"
      >
        <div className="sidebar-header">
          {ActiveUser ? (
            <NavLink className="profile" to="/profile">
              <img
                className="user-pic"
                src={ActiveUser.image || "/default-profile-image.jpg"}
                alt="User Profile"
              />
              <h3 className="user-name">{ActiveUser.name}</h3>
              <p className="user-status">Active</p>
              <h3>Amount Due: ₦{realAmountDue.toFixed(2)}</h3>
              <h3>Balance: ₦{Math.abs(ActiveUser.balance?.toFixed(2)) || "0.00"}</h3>
            </NavLink>
          ) : (
            <p className="user-status">Not Logged In</p>
          )}
        </div>
        <ul className="sidebar-menu">{renderLinks()}</ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <nav className="navbar">
          <button
            className="menu-btn"
            onClick={toggleSidebar}
            aria-expanded={isSidebarOpen}
          >
            ☰
          </button>
          <NavLink to="/" className="navbar-title">LoanApp</NavLink>
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
