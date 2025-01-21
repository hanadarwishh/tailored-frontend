import React, { useState, useEffect } from "react";
import "./Courses.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import studentPic from "../Assets/student_pic.jpg";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/NavBar";
import SidebarPage from "./Sidenav/Sidenav";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        const token = "2aa9cad85973d3790f2f6c467317c6ac"; // Replace with the actual token
        const response = await fetch("http://localhost:3002/api/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
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
    navigate(`/course-details/${course.id}`, { state: { course } });
  };

  return (
    
    <div>
      <Navbar />
<div className="course-sidebar">
  <div className= "course-side">

  <SidebarPage />
  </div>

      <div className="courses-page">
        {/* <div className="top-navbar">
          <div className="navbar-right">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for a course..."
                className="search-bar"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="student-info-container">
              <div className="student-info">
                <p className="student-name">Hana Ayman</p>
                <p className="student-year">Year: 4</p>
              </div>
              <div className="user-dropdown">
                <div className="student-pic-container">
                  <img src={studentPic} alt="Student" className="student-pic" />
                </div>
                <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" />
              </div>
            </div>
          </div>
        </div> */}

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
                    {/* Random color bar above course name */}
                    {/* <div className="course-bar" style={{ backgroundColor: randomColor }}></div> */}

                    <div>
                      <div className="course-image-container">
                        <img
                          src={course.courseimage} // Append token if required
                          className="course-image"
                          alt="Course Thumbnail"
                        />
                      </div>

                      <h3>{course.fullname}</h3>
                      {/* Progress bar and percentage */}
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
    </div>
    </div>

  );
};

export default Courses;
