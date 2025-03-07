import React from "react";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left Side - Dashboard Links */}
      <div className="navbar-left">
        <a href="#">Dashboard</a>
        <a href="#">Payment</a>
        <a href="#">Wallet</a>
      </div>

      {/* Right Side - Search and Profile */}
      <div className="navbar-right">
        <div className="search-container">
          <input type="text" placeholder="🔍 Search ..." />
        </div>
        <div className="profile-container">
          <div className="profile-icon">👤</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
