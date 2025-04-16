import React, { useState, useEffect, useRef } from "react";
import "./NavBar.css";
import { IoIosArrowDropdown } from "react-icons/io";

const Navbar = ({pageTitle}) => {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const { firstname, lastname, userpictureurl } = userData;

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.clear();
    
    window.location.href = "/login";
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1 className="page-title">{pageTitle}</h1>
        </div>
        <div className="navbar-user" ref={dropdownRef}>
          <span className="user-name">{`${firstname || "User"} ${
            lastname || "Name"
          }`}</span>
          <div
            className="user-avatar"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            <img
              src={userpictureurl || "../Assets/student_pic.jpg"}
              className="avatar-img" 
              alt="Student"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.rawpixel.com/image_png_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsb2ZmaWNlNF8zZF9jaGFyYWN0ZXJfaWxsdXN0cmF0aW9uX29mX2FfYmxhY2tfY2h1YmJ5X3N0dV8xY2E5OThlNy0wYmQyLTRmZGEtOWRmYi0yMmMwMGMyYjU0NTIucG5n.png";
              }}
            />
            <i className="dropdown-icon"><IoIosArrowDropdown /></i>
          </div>
          {dropdownVisible && (
            <div className="dropdown-menu">
              <button 
                onClick={() => window.location.href = "/profile"} 
                className="dropdown-item"
              >
                Profile
              </button>
              <button 
                onClick={handleLogout} 
                className="dropdown-item"
              >
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


