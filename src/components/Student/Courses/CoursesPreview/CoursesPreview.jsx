import React, { useState, useEffect } from "react";
import "./CoursesPreview.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCommentDots } from "@fortawesome/free-solid-svg-icons"; // Importing the chat icon
import { useNavigate } from "react-router-dom";

import chatbotImage from "../../../Assets/chatbot_full-removebg-preview.png";
import Navbar from "../../../UpperNavBar/NavBar";
import SidebarPage from "../../../SideBar/Sidenav";
import LoadingScreen from "../../../Loading/LoadingScreen";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBubble, setShowBubble] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const TOKEN = userData.token;

  // Function to generate a random color
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // // Fetch courses from backend
  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch("http://localhost:3002/api/courses", {
  //         headers: {
  //           Authorization: `Bearer ${TOKEN}`,
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch courses");
  //       }

  //       const data = await response.json();
  //       setCourses(data.courses || []);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCourses();
  // }, []);

  useEffect(() => {
    if (courses.length === 0) {
      // Static example data for preview
      setCourses([
        {
          id: "static1",
          fullname: "Introduction to AI",
          courseimage: "https://placehold.co/600x400?text=Introduction+to+AI",
          progress: 75,
        },
        {
          id: "static2",
          fullname: "Web Development Basics",
          courseimage: "https://placehold.co/600x400?text=Web+Development+Basics",
          progress: 100,
        },
        {
          id: "static3",
          fullname: "Data Structures",
          courseimage: "https://placehold.co/600x400?text=Data+Structures",
          progress: 90,
        },
        {
          id: "static1",
          fullname: "Introduction to AI",
          courseimage: "https://placehold.co/600x400?text=Introduction+to+AI",
          progress: 10,
        },
        {
          id: "static2",
          fullname: "Web Development Basics",
          courseimage: "https://placehold.co/600x400?text=Web+Development+Basics",
          progress: 45,
        },
        {
          id: "static3",
          fullname: "Data Structures",
          courseimage: "https://placehold.co/600x400?text=Data+Structures",
          progress: 55,
        },
      ]);
    }
  }, [courses]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
  };

  const filteredCourses = courses.filter((course) =>
    course.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCourseClick = (course) => {
    navigate(`/course-details/${course.id}`, { state: { course } });
  };

  const handleChatbotClick = () => {
    navigate("/multi-purpose-chatbot");
  };

  return (
    <div>
      <Navbar pageTitle="Your Courses" />
      <div
        className={`course-side ${
          sidebarCollapsed ? "course-side-collapsed" : ""
        }`}
      >
        <SidebarPage onCollapse={handleSidebarCollapse} />
      </div>

      <div
        className={`courses-page ${
          sidebarCollapsed ? "course-side-collapsed" : ""
        }`}
      >
        {loading ? (
          <LoadingScreen title="Loading Courses..." />
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="course-list">
            <ul>
              {filteredCourses.map((course) => {
                const randomColor = generateRandomColor();
                return (
                  <li
                    key={course.id}
                    className="course-item"
                    onClick={() => handleCourseClick(course)}
                  >
                    <div>
                      <div className="course-image-container">
                        <img
                          src={course.courseimage}
                          className="course-image"
                          alt="Course Thumbnail"
                        />
                      </div>

                      <h3>{course.fullname}</h3>
                      <div className="progress-container">
                        <div
                          className="progress-bar"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                        <span className="progress-percentage">
                          {course.progress}%
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {filteredCourses.length === 0 && <p>No courses found.</p>}
          </div>
        )}
      </div>

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

export default Courses;
