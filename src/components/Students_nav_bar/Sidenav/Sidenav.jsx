// SidebarPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faMoneyBill,
  faBriefcase,
  faBookBookmark,
  faGraduationCap,
  faGroupArrowsRotate,
  faCalendarDays,
  faListCheck,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../Assets/tailored logo.png"; 

const SidebarPage = () => {
  return (
    <div className="sidebar-page">
      <nav className="side-nav">
        <div className="nav-logo">
          <img src={logo} alt="Tailored Logo" />
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/student">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="dashboard-icon" />
              Dashboard
            </Link>
          </li>
          {/* <li>
            <Link to="/payment-info">
              <FontAwesomeIcon icon={faMoneyBill} className="payment-icon" />
              Payment Info
            </Link>
          </li> */}
          <li>
            <Link to="/portfolio">
              <FontAwesomeIcon icon={faBriefcase} className="portfolio-icon" />
              Portfolio
            </Link>
          </li>
          <li>
            <Link to="/courses">
              <FontAwesomeIcon icon={faBookBookmark} className="courses-icon" />
              Courses
            </Link>
          </li>
          <li>
            <Link to="/gpa">
              <FontAwesomeIcon icon={faGraduationCap} className="gpa-icon" />
              GPA
            </Link>
          </li>
          <li>
            <Link to="/explainer-section">
              <FontAwesomeIcon icon={faGroupArrowsRotate} className="community-icon" />
              Explainer Section
            </Link>
          </li>
          {/* <li>
            <Link to="/schedule">
              <FontAwesomeIcon icon={faCalendarDays} className="schedule-icon" />
              Schedule
            </Link>
          </li> */}
          <li>
            <Link to="/progress-tracker">
              <FontAwesomeIcon icon={faListCheck} className="progress-tracker" />
              Progress Tracker
            </Link>
          </li>
          <li>
            <Link to="/account">
              <FontAwesomeIcon icon={faUser} className="account-icon" />
              Account
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              onClick={() => {
                console.log("User logged out");
                localStorage.removeItem("userToken");
              }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="logout-icon" />
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarPage;
