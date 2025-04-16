import React, { useState } from "react";
import Calendar from "react-calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faListCheck,
  faClipboardList,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "../../Calendar.css";
import "./InstructorDashboard.css";
import Navbar from "../../../NavBar/NavBar";
import SidebarPage from "../InstructorSidenav/InstructorSidenav";
import { useNavigate } from "react-router-dom";
import chatbotImage from "../../../Assets/chatbot_full-removebg-preview.png";

const InstructorDashboard = () => {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDayPopup, setShowDayPopup] = useState(false);
  const [dayTasks, setDayTasks] = useState([]);
  const [dueAssignments, setDueAssignments] = useState([
    {
      id: 1,
      title: "Big Data Assignment 3",
      course: "Big Data",
      dueDate: "2025-04-17",
    },
    {
      id: 2,
      title: "Python Lab 1",
      course: "Programming 1",
      dueDate: "2025-04-20",
    },
    {
      id: 3,
      title: "Linked Lists Lab ",
      course: "Data Structires",
      dueDate: "2025-04-25",
    },
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: "Defence 3",
      date: "2025-04-25",
      time: "1:00 PM",
      location: "Room G-007",
    },
    {
      id: 2,
      title: "HPC Final Project",
      date: "2025-04-30",
      time: "1:00 PM",
      location: "Room S-16",
    },
  ]);

  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const assignmentsForDay = dueAssignments.filter(
      (assignment) => assignment.dueDate === dateStr
    );

    const eventsForDay = upcomingEvents.filter(
      (event) => event.date === dateStr
    );

    const allTasks = [
      ...assignmentsForDay.map((assignment) => ({
        ...assignment,
        type: "assignment",
      })),
      ...eventsForDay.map((event) => ({
        ...event,
        type: "event",
      })),
    ];

    setDayTasks(allTasks);
    setShowDayPopup(true);
  };

  const closePopup = () => {
    setShowDayPopup(false);
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const hasAssignment = dueAssignments.some(
      (assignment) => assignment.dueDate === dateStr
    );

    const hasEvent = upcomingEvents.some((event) => event.date === dateStr);

    return (
      <div className="tile-content">
        {(hasAssignment || hasEvent) && <div className="indicator"></div>}
      </div>
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;

    const currentMonth = selectedDate.getMonth();
    if (date.getMonth() !== currentMonth) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const hasAssignment = dueAssignments.some(
      (assignment) => assignment.dueDate === dateStr
    );

    const hasEvent = upcomingEvents.some((event) => event.date === dateStr);

    if (hasAssignment && hasEvent) return "has-both";
    if (hasAssignment) return "has-assignment";
    if (hasEvent) return "has-event";
    return null;
  };

  const handleChatbotClick = () => {
    navigate("/multi-purpose-chatbot");
  };

  return (
    <div
      className={`student-dashboard ${sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
    >
      <SidebarPage onCollapse={handleSidebarCollapse} />
      <div className="main-content">
        <Navbar pageTitle="Student Dashboard" />

        <div className="dashboard-container">
          <div className="dashboard-content">
            <div className="dashboard-layout">
              <section className="calendar-section">
                <div className="section-header">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="section-icon"
                  />
                  <h2>Calendar</h2>
                </div>

                <div className="calendar-wrapper">
                  <Calendar
                    locale="en-US"
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                  />
                </div>
              </section>

              <div className="right-column">
                <section className="due-dates-section">
                  <div className="section-header">
                    <FontAwesomeIcon
                      icon={faListCheck}
                      className="section-icon"
                    />
                    <h2>Upcoming Work</h2>
                  </div>

                  <div className="assignments-container">
                    {dueAssignments.length > 0 ? (
                      dueAssignments.map((assignment) => (
                        <div key={assignment.id} className={`assignment-card`}>
                          <div className="assignment-info">
                            <h3>{assignment.title}</h3>
                            <p className="course-name">{assignment.course}</p>
                            <p className="due-date">
                              Due:{" "}
                              {new Date(assignment.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-message">
                        <p>No upcoming work at this time</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Upcoming Events Section */}
                <section className="events-section">
                  <div className="section-header">
                    <FontAwesomeIcon
                      icon={faClipboardList}
                      className="section-icon"
                    />
                    <h2>Upcoming Events</h2>
                  </div>

                  <div className="events-container">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => (
                        <div key={event.id} className="event-card">
                          <h3>{event.title}</h3>
                          <p className="event-date">
                            <strong>Date:</strong>{" "}
                            {new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="event-time">
                            <strong>Time:</strong> {event.time}
                          </p>
                          <p className="event-location">
                            <strong>Location:</strong> {event.location}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="empty-message">
                        <p>No upcoming events at this time</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDayPopup && (
        <div className="day-popup-overlay">
          <div className="day-popup">
            <div className="day-popup-header">
              <h2>
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
              <button className="close-popup" onClick={closePopup}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="day-popup-content">
              {dayTasks.length > 0 ? (
                <div className="day-tasks">
                  {dayTasks.map((task) => (
                    <div
                      key={`${task.type}-${task.id}`}
                      className={`day-task-card ${task.type}`}
                    >
                      <h3>{task.title}</h3>
                      {task.type === "assignment" && (
                        <>
                          <p className="task-due">
                            {new Date(task.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                          <p className="task-course">{task.course}</p>
                        </>
                      )}
                      {task.type === "event" && (
                        <>
                          <p className="task-time">{task.time}</p>
                          <p className="task-location">{task.location}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="day-no-tasks">
                  <p>No tasks or events scheduled for this day</p>
                </div>
              )}
            </div>
          </div>
        </div>
    
      )}
      <div className="chatbot-container" onClick={handleChatbotClick}>
        <div className="chatbot-bubble">
          {" "}
          <p>
            Upload ANY file for help! The chatbot can assist you with anything.
          </p>
        </div>
        <div className="chatbot-icon">
          <img src={chatbotImage} alt="Chatbot" className="chatbot-image" />
        </div>
      </div>
    </div>

    
  );
};

export default InstructorDashboard;