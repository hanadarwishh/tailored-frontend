import React, { useState } from "react";
import { Link} from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Student.css";
import logo from "../Assets/tailored logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import {faMoneyBill} from "@fortawesome/free-solid-svg-icons";
import {faGraduationCap} from "@fortawesome/free-solid-svg-icons";
import {faBookBookmark} from "@fortawesome/free-solid-svg-icons";
import {faGroupArrowsRotate} from "@fortawesome/free-solid-svg-icons";
import {faCalendarDays} from "@fortawesome/free-solid-svg-icons";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import {faListCheck} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../NavBar/NavBar";
import SidebarPage from "../Students_nav_bar/Sidenav/Sidenav";


const Student = () => {

  const events = [
    { date: new Date(2025, 0, 5), title: "Math Quiz" },
    { date: new Date(2025, 0, 7), title: "Physics Assignment Due" },
    { date: new Date(2025, 0, 10), title: "Community Meeting" },
  ];

  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const hasEvent = (date) => {
    return events.find((event) => event.date.toDateString() === date.toDateString());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
  };

  return (
    <div>

    <Navbar/>

    <div className="student-page">
      <SidebarPage/>
      {/* <nav className="side-nav">
        <div className="nav-logo">
          <img src={logo} alt="Tailored Logo" />
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/dashboard">
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="dashboard-icon" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/payment-info">
              <FontAwesomeIcon icon={faMoneyBill} className="payment-icon"/>
              Payment Info
            </Link>
          </li>
          <li>
          <li>
            <Link to="/portfolio">
              <FontAwesomeIcon icon={faBriefcase} className="portfolio-icon" />
              Portfolio
            </Link>
          </li>

          </li>
          <li>
            <Link to="/courses">
             <FontAwesomeIcon icon={faBookBookmark} className="courses-icon"/>
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

          <li>
            <Link to="/schedule">
            <FontAwesomeIcon icon={faCalendarDays}className="schedule-icon" />
              Schedule
            </Link>
          </li>
          <li>
          <Link to="/progress-tracker">
          <FontAwesomeIcon icon={faListCheck}className="progress-tracker"  />
            Progress Tracker
          </Link>
        </li>
          <li>
            <Link to="/account">
            <FontAwesomeIcon icon={faUser} className="account-icon"/>
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
      </nav> */}

      <main className="main-content">
        <div className="calendar-container">
          <Calendar
            onClickDay={handleDateClick}
            tileContent={({ date }) =>
              hasEvent(date) ? <div className="event-dot"></div> : null
            }
          />
        </div>
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <button className="close-btn" onClick={closePopup}>
                &times;
              </button>
              <h2>{selectedDate?.toDateString()}</h2>
              {hasEvent(selectedDate) ? (
                <p>{hasEvent(selectedDate).title}</p>
              ) : (
                <p>No events for this day.</p>
              )}
            </div>
          </div>
        )}
        <div className="info-section">
          <div className="info-card">
            <h2>Notifications</h2>
            <ul>
              <li>Math Quiz on Jan 5</li>
              <li>Physics Assignment Due on Jan 7</li>
              <li>Community Meeting on Jan 10</li>
            </ul>
          </div>
          <div className="info-card">
            <h2>Upcoming Events</h2>
            <p>Stay tuned for more updates!</p>
          </div>
        </div>
      </main>
    </div>
    </div>

  );
};

export default Student;
