import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faBriefcase,
  faBookBookmark,
  faGraduationCap,
  faGroupArrowsRotate,
  faListCheck,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../../Assets/tailored logo.png";
import "./InstructorSidenav.css";

const SidebarPage = ({ onCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleSidebarClick = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    
    if (onCollapse) {
      onCollapse(newCollapsedState);
    }
  };

  useEffect(() => {
    if (onCollapse) {
      onCollapse(isCollapsed);
    }
  }, [isCollapsed, onCollapse]);

  return (
    <div className="sidebar-page">
      <nav
        className={`side-nav ${isCollapsed ? "collapsed" : ""}`}
        onClick={handleSidebarClick}
      >
        <div className="nav-logo">
          <img src={logo} alt="Tailored Logo" className="logo-img" />
          {!isCollapsed && <p className="logo-title">TailorED</p>}
        </div>

        <hr className="logo-divider" />

        <ul className="nav-links">
          <li>
            <Link to="/instructor">
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="dashboard-icon nav-icon"
              />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          {/* <li>
            <Link to="/portfolio">
              <FontAwesomeIcon icon={faBriefcase} className="portfolio-icon nav-icon" />
              {!isCollapsed && <span>Portfolio</span>}
            </Link>
          </li> */}
          <li>
            <Link to="/instructor-courses">
              <FontAwesomeIcon icon={faBookBookmark} className="courses-icon nav-icon" />
              {!isCollapsed && <span>Courses</span>}
            </Link>
          </li>
          {/* <li>
            <Link to="/gpa">
              <FontAwesomeIcon icon={faGraduationCap} className="gpa-icon nav-icon" />
              {!isCollapsed && <span>GPA</span>}
            </Link>
          </li> */}
          <li>
            <Link to="/explainer-section">
              <FontAwesomeIcon
                icon={faGroupArrowsRotate}
                className="community-icon nav-icon"
              />
              {!isCollapsed && <span>Explainer Section</span>}
            </Link>
          </li>
          {/* <li>
            <Link to="/progress-tracker">
              <FontAwesomeIcon
                icon={faListCheck}
                className="progress-tracker nav-icon"
              />
              {!isCollapsed && <span>Progress Tracker</span>}
            </Link>
          </li> */}
          <li>
            <Link to="/profile">
              <FontAwesomeIcon icon={faUser} className="account-icon nav-icon" />
              {!isCollapsed && <span>Account</span>}
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
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="logout-icon nav-icon"
              />
              {!isCollapsed && <span>Logout</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarPage;