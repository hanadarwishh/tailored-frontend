import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaCalculator } from "react-icons/fa";
import "./GPA.css";
import Navbar from "../../UpperNavBar/NavBar";
import SidebarPage from "../../SideBar/Sidenav";
import LoadingScreen from "../../Loading/LoadingScreen";

function GPA() {
  const [currentGPA, setCurrentGPA] = useState("");
  const [totalCredits, setTotalCredits] = useState("");
  const [courses, setCourses] = useState([
    { name: "", grade: "", credits: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const [newGPA, setNewGPA] = useState(null);
  const [progressValue, setProgressValue] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [errors, setErrors] = useState({
    gpa: "",
    credits: "",
    grades: "",
  });

  const handleSidebarCollapse = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const studentId = userData.userid;

    const fetchGPAData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/gpa/${studentId}`
        );
        const data = await response.json();
        setCurrentGPA(data.currentGPA || "");
        setTotalCredits(data.totalCredits || "");
        setCourses(data.courses || [{ name: "", grade: "", credits: "" }]);
      } catch (error) {
        console.error("Error fetching GPA data:", error);
      }
    };

    const delay = new Promise((resolve) => setTimeout(resolve, 3000));
    const fetchData = fetchGPAData(); // fetch from API

    Promise.all([fetchData, delay]).then(() => {
      setLoading(false);
    });

    const gpaToUse = newGPA !== null ? newGPA : currentGPA;
    if (gpaToUse !== "") {
      const percent = (parseFloat(gpaToUse) / 4.0) * 100;
      setProgressValue(percent);
    }
  }, [newGPA, currentGPA]);

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { name: "", grade: "", credits: "" }]);
  };

  const removeCourse = (index) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  // uncomment it

  const handleCalcGPA = async () => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const studentId = userData.userid;
  
    // Input validation
    if (!studentId) {
      setErrors("Student ID not found. Please log in again.");
      return;
    }
  
    if (!currentGPA || isNaN(currentGPA)) {
      setErrors("Please enter a valid current GPA.");
      return;
    }
  
    if (!totalCredits || isNaN(totalCredits)) {
      setErrors("Please enter valid total credits.");
      return;
    }
  
    for (let i = 0; i < courses.length; i++) {
      const { name, grade, credits } = courses[i];
      if (!name || !grade || !credits || isNaN(credits)) {
        setErrors(`Please fill all fields correctly for Course ${i + 1}.`);
        return;
      }
    }
  
    const dataToSend = {
      currentGPA: parseFloat(currentGPA),
      totalCredits: parseFloat(totalCredits),
      courses: courses.map((course) => ({
        name: course.name,
        grade: course.grade,
        credits: parseFloat(course.credits),
      })),
    };

    // try this
  
    try {
      setErrors("");
  
      const getResponse = await fetch(`http://localhost:5001/api/gpa/${studentId}`, {
        method: "GET",
      });
  
      const method = getResponse.ok ? "PATCH" : "POST";
  
      const saveResponse = await fetch(`http://localhost:5001/api/gpa/${studentId}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!saveResponse.ok) {
        const errData = await saveResponse.json();
        throw new Error(errData.message || `Failed to ${method} GPA data.`);
      }
  
      const responseData = await saveResponse.json();
      setNewGPA(responseData.newGPA);
    } catch (error) {
      console.error("Error calculating GPA:", error);
    }
  };
  

  // remove it

  // const gradePointMap = {
  //   "A+": 4.0,
  //   A: 4.0,
  //   "A-": 3.7,
  //   "B+": 3.3,
  //   B: 3.0,
  //   "B-": 2.7,
  //   "C+": 2.3,
  //   C: 2.0,
  //   "C-": 1.7,
  //   "D+": 1.3,
  //   D: 1.0,
  //   "D-": 0.7,
  //   F: 0.0,
  // };

  // const handleCalcGPA = () => {
  //   let totalNewGradePoints = 0;
  //   let newErrors = { gpa: "", credits: "", grades: "" };
  //   let totalNewCredits = 0;

  //   for (const course of courses) {
  //     const grade = course.grade;
  //     const credits = parseFloat(course.credits);

  //     if (!grade || isNaN(credits)) continue;

  //     const gradePoint = gradePointMap[grade];
  //     totalNewCredits += credits;
  //     totalNewGradePoints += gradePoint * credits;
  //   }

  //   const currentGPAValue = parseFloat(currentGPA);
  //   const currentCreditsValue = parseFloat(totalCredits);

  //   if (isNaN(currentGPAValue) || currentGPAValue === "") {
  //     newErrors.gpa = "Please enter a valid GPA";
  //   }

  //   if (isNaN(currentCreditsValue) || currentCreditsValue === "") {
  //     newErrors.credits = "Please enter valid credits";
  //   }

  //   if (totalNewCredits === 0) {
  //     newErrors.grades = "Please enter valid course grades";
  //   }

  //   setErrors(newErrors);

  //   const hasErrors = Object.values(newErrors).some((msg) => msg !== "");
  //   if (!hasErrors) {
  //     const newGPAValue =
  //       (currentGPAValue * currentCreditsValue + totalNewGradePoints) /
  //       (currentCreditsValue + totalNewCredits);

  //     const roundedGPA = newGPAValue.toFixed(2);
  //     setNewGPA(roundedGPA);
  //   }
  // };

  if (loading) {
    return <LoadingScreen title="Loading GPA Calculator" />;
  }

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressValue / 100) * circumference;

  return (
    <div className="gpa-page">
      <SidebarPage onCollapse={handleSidebarCollapse} />
      <div className="gpa-content-wrapper">
        <Navbar pageTitle="GPA Calculator" />
        <div
          className={`gpa-main-container ${
            isSidebarCollapsed ? "sidebar-collapsed" : ""
          }`}
        >
          <div className="gpa-content-container">
            <div className="gpa-calculator-section">
              <div className="gpa-inputs">
                <div className="gpa-input-group">
                  <label className="gpa-input-label">Current GPA:</label>
                  <input
                    className="gpa-input"
                    type="number"
                    value={currentGPA}
                    onChange={(e) => setCurrentGPA(e.target.value)}
                    placeholder="Enter current GPA"
                    step="0.01"
                    min="0"
                    max="4.0"
                  />
                  {errors.gpa && (
                    <div className="error-message">{errors.gpa}</div>
                  )}
                </div>
                <div className="gpa-input-group">
                  <label className="gpa-input-label">Total Credits:</label>
                  <input
                    className="gpa-input"
                    type="number"
                    value={totalCredits}
                    onChange={(e) => setTotalCredits(e.target.value)}
                    placeholder="Enter total credits"
                    min="0"
                  />
                  {errors.credits && (
                    <div className="error-message">{errors.credits}</div>
                  )}
                </div>
              </div>

              <div className="courses-container">
                <div className="courses-header">
                  <div className="course-header-item">Course Name</div>
                  <div className="course-header-item">Grade</div>
                  <div className="course-header-item">Credits</div>
                  <div className="course-header-item action"></div>
                </div>

                <div className="courses-list">
                  {courses.map((course, index) => (
                    <div key={index} className="course-inputs">
                      <input
                        className="course-input"
                        type="text"
                        placeholder="Course Name"
                        value={course.name}
                        onChange={(e) =>
                          handleCourseChange(index, "name", e.target.value)
                        }
                      />
                      <select
                        className="course-input"
                        value={course.grade}
                        onChange={(e) =>
                          handleCourseChange(index, "grade", e.target.value)
                        }
                      >
                        <option value="">Select Grade</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="C-">C-</option>
                        <option value="D+">D+</option>
                        <option value="D">D</option>
                        <option value="D-">D-</option>
                        <option value="F">F</option>
                      </select>
                      <input
                        className="course-input"
                        type="number"
                        placeholder="Credits"
                        value={course.credits}
                        onChange={(e) =>
                          handleCourseChange(index, "credits", e.target.value)
                        }
                        min="0"
                        step="0.5"
                      />
                      <button
                        className="remove-course-btn"
                        onClick={() => removeCourse(index)}
                        disabled={courses.length <= 1}
                      >
                        <FaMinus />
                      </button>
                    </div>
                  ))}
                  {errors.grades && (
                    <div className="error-message">{errors.grades}</div>
                  )}
                </div>
              </div>

              <div className="gpa-actions">
                <button className="add-course-btn" onClick={addCourse}>
                  <FaPlus /> Add Course
                </button>

                <button className="calculate-gpa-btn" onClick={handleCalcGPA}>
                  <FaCalculator /> Calculate GPA
                </button>
              </div>
            </div>
            <div className="gpa-circle-container">
              <svg className="gpa-progress-ring" width="200" height="200">
                <circle
                  className="gpa-progress-ring-background"
                  stroke="#e6e6e6"
                  strokeWidth="12"
                  fill="transparent"
                  r={radius}
                  cx="100"
                  cy="100"
                />
                <circle
                  className="gpa-progress-ring-circle"
                  stroke="#7b4fe1"
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="transparent"
                  r={radius}
                  cx="100"
                  cy="100"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                  }}
                />
                <text
                  x="100"
                  y="90"
                  textAnchor="middle"
                  className="gpa-circle-text-label"
                >
                  {newGPA ? "New GPA" : "Current GPA"}
                </text>
                <text
                  x="100"
                  y="130"
                  textAnchor="middle"
                  className="gpa-circle-text"
                >
                  {newGPA || currentGPA}
                </text>
              </svg>
              <div className="gpa-total-credits">
                Total Credits: {totalCredits}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GPA;
