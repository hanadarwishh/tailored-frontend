import React, { useState } from "react";
import "./NavBar.css";

const Navbar = () => {
  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const { firstname, lastname, userpictureurl } = userData;

  // State for managing dropdown visibility
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userData"); // Clear user data
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo"></div>
        <div className="navbar-user">
          <span className="user-name">{`${firstname || "User"} ${
            lastname || "Name"
          }`}</span>
          <div
            className="user-avatar"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            {console.log(userpictureurl)}
            <img
              src={userpictureurl || "https://via.placeholder.com/40"}
              className="avatar-img"
            />
            <i className="dropdown-icon">▼</i>
          </div>
          {dropdownVisible && (
            <div className="dropdown-menu">
              <button onClick={handleLogout} className="dropdown-item">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
