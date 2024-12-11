import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import Footer from "./footer";
import Error from "./error";
import "./navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ActiveUser, errormessage, successmessage } = useSelector((state) => state.user);

  // Calculate total amount due
  const realAmountDue =
    ActiveUser?.loans
      ?.filter((loan) => loan?.status === "approved")
      ?.reduce((total, loan) => total + loan.totalAmountDue, 0) || 0;

  // Sidebar open/close state
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 704);
  const width = window.innerWidth < 750;

  // Update sidebar state on window resize
  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth > 704);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => setIsSidebarOpen((prevState) => !prevState);

  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    if (width) {
      toggleSidebar()
    }
  };

  // Render Sidebar Links
  const renderLinks = () => {
    if (ActiveUser) {
      return (
        <>
          <NavLink onClick={width ? toggleSidebar : undefined} to="/" className="sidebar-item">Home</NavLink>
          <NavLink onClick={width ? toggleSidebar : undefined} to="/card" className="sidebar-item">Fund My Account</NavLink>
          <NavLink onClick={width ? toggleSidebar : undefined} to="/status" className="sidebar-item">Loan Status</NavLink>
          <NavLink onClick={width ? toggleSidebar : undefined} to="/repay" className="sidebar-item">Repayment</NavLink>
          <NavLink onClick={width ? toggleSidebar : undefined} to="/history" className="sidebar-item">Loan History</NavLink>
          <NavLink onClick={width ? toggleSidebar : undefined} to="/faq" className="sidebar-item">FAQ</NavLink>
          <NavLink onClick={handleLogout} className="sidebar-item">Logout</NavLink>
        </>
      );
    } else {
      return (
        <>
          {width && (
            <NavLink onClick={toggleSidebar} to="/login" className="sidebar-item">
              Login
            </NavLink>
          )}
          {!width && (
            <NavLink to="/login" className="sidebar-item">
              Login
            </NavLink>
          )}
        </>
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
            <NavLink
              className="profile"
              to="/profile"
              onClick={width ? toggleSidebar : undefined}
            >
              <img
                className="user-pic"
                src={ActiveUser.image || "/default-profile-image.jpg"}
                alt="User Profile"
              />
              <h3 className="user-name">{ActiveUser.name}</h3>
              <p className="user-status">Active</p>
              <div className="amounts">
                <h5>Amount Due: ₦{realAmountDue.toFixed(2)}</h5>
                <h5>
                  Loan Balance: ₦
                  {ActiveUser?.balance !== undefined
                    ? Math.abs(ActiveUser.balance.toFixed(2))
                    : "0.00"}
                </h5>
                <h5>
                  Account Balance: ₦
                  {ActiveUser?.accountBalance !== undefined
                    ? Math.abs(ActiveUser.accountBalance.toFixed(2))
                    : "0.00"}
                </h5>
              </div>
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
          {errormessage && <Error />}
          {successmessage && <Error />}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Navbar;
