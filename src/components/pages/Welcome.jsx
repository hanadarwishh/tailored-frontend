import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Welcome.css';
import logo from '../Assets/tailored logo.png';

const Welcome = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "student") {
      navigate("/student"); // Redirect to Student Page
    } else if (role === "instructor") {
      navigate("/instructor"); // Redirect to Instructor Page
    }
  };

  return (
    <div className="welcome-page">
      {/* Simplified Navbar */}
      <nav className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <ul className="navbar-links">
          <li><Link to="/Home">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/help">Help</Link></li>
        </ul>
      </nav>

      {/* Main Welcome Content */}
      <div className="welcome-container">
        <h1 className="welcome-title">Welcome to Tailored!</h1>
        <p className="welcome-subtitle">Select your role to proceed</p>
        <div className="role-selection">
          <button
            className="role-button"
            onClick={() => handleRoleSelection("student")}
          >
            Enter as Student
          </button>
          <button
            className="role-button"
            onClick={() => handleRoleSelection("instructor")}
          >
            Enter as Instructor
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
