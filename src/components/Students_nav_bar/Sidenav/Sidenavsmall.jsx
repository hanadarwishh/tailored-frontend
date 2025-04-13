// SidebarSmall.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Sidenavsmall.css"
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

const SidebarSmall = () => {
  return (
    <div className="sidebar-small">
      <nav className="side-nav-small">
        <ul className="nav-links">
          <li>
            <Link to="/student">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="dashboard-icon" />
            </Link>
          </li>
          {/* <li>
            <Link to="/payment-info">
              <FontAwesomeIcon icon={faMoneyBill} className="payment-icon" />
            </Link>
          </li> */}
          <li>
            <Link to="/portfolio">
              <FontAwesomeIcon icon={faBriefcase} className="portfolio-icon" />
            </Link>
          </li>
          <li>
            <Link to="/courses">
              <FontAwesomeIcon icon={faBookBookmark} className="courses-icon" />
            </Link>
          </li>
          <li>
            <Link to="/gpa">
              <FontAwesomeIcon icon={faGraduationCap} className="gpa-icon" />
            </Link>
          </li>
          <li>
            <Link to="/explainer-section">
              <FontAwesomeIcon icon={faGroupArrowsRotate} className="community-icon" />
            </Link>
          </li>
          {/* <li>
            <Link to="/schedule">
              <FontAwesomeIcon icon={faCalendarDays} className="schedule-icon" />
            </Link>
          </li> */}
          <li>
            <Link to="/progress-tracker">
              <FontAwesomeIcon icon={faListCheck} className="progress-tracker" />
            </Link>
          </li>
          <li>
            <Link to="/my-profile">
              <FontAwesomeIcon icon={faUser} className="account-icon" />
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
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarSmall;
