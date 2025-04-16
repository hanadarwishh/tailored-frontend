import React, { useState, useEffect } from "react";
import "./Courses.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCommentDots } from "@fortawesome/free-solid-svg-icons";  
import studentPic from "../../../Assets/student_pic.jpg";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../NavBar/NavBar";
import SidebarPage from "../InstructorSidenav/InstructorSidenav";

const InstructorCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBubble, setShowBubble] = useState(true); 
  
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

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3002/api/courses", {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
  };

  const filteredCourses = courses.filter((course) =>
    course.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCourseClick = (course) => {
    navigate(`/course-details-instructor/${course.id}`, { state: { course } });
  };

  

  return (
    <div>
      <Navbar />
      <div className="course-sidebar">
        <div className="course-side">
          <SidebarPage />
        </div>

        <div className="courses-page">
          {loading ? (
            <p>Loading courses...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="course-list">
              <h1>Your Courses</h1>
              <ul>
                {filteredCourses.map((course) => {
                  const randomColor = generateRandomColor(); // Get a random color for the bar
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
                        {/* <div className="progress-container">
                          <div
                            className="progress-bar"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                          <span className="progress-percentage">
                            {course.progress}%
                          </span>
                        </div> */}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {filteredCourses.length === 0 && <p>No courses found.</p>}
            </div>
          )}
        </div>
      </div>

    
    </div>
  );
};

export default InstructorCourses;
