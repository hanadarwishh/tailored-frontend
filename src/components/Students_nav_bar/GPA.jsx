import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaCalculator } from 'react-icons/fa';
import './GPA.css';
import SidebarPage from './Sidenav/Sidenav';
import Navbar from '../NavBar/NavBar';

function GPA() {
  const [currentGPA, setCurrentGPA] = useState('');
  const [totalCredits, setTotalCredits] = useState('');
  const [courses, setCourses] = useState([{ name: '', grade: '', credits: '' }]); // Default one course
  const [loading, setLoading] = useState(true);
  const [newGPA, setNewGPA] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const studentId = userData.userid;
    if (studentId) {
      fetch(`http://localhost:5001/api/gpa/${studentId}`)
        .then((response) => response.json())
        .then((data) => {
          setCurrentGPA(data.currentGPA || '');
          setTotalCredits(data.totalCredits || '');
          setCourses(data.courses || [{ name: '', grade: '', credits: '' }]); // Ensure at least one course
        })
        .catch((error) => console.error('Error fetching GPA data:', error))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { name: '', grade: '', credits: '' }]);
  };

  const removeCourse = (index) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  const handleCalcGPA = async () => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const studentId = userData.userid;

    try {
      const response = await fetch(`http://localhost:5001/api/gpa/${studentId}`, {
        method: "GET",
      });

      if (!response.ok) {
        if (studentId) {
          const dataToSend = {
            currentGPA: parseFloat(currentGPA),
            totalCredits: parseFloat(totalCredits),
            courses: courses.map(course => ({
              name: course.name,
              grade: course.grade,
              credits: parseFloat(course.credits)
            }))
          };

          fetch(`http://localhost:5001/api/gpa/${studentId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('GPA calculation data sent:', data);
              setNewGPA(data.newGPA); // Set the new GPA when received from API
            })
            .catch((error) => {
              console.error('Error posting GPA data:', error);
            });
        }
      }

      if (studentId) {
        const dataToSend = {
          currentGPA: parseFloat(currentGPA),
          totalCredits: parseFloat(totalCredits),
          courses: courses.map(course => ({
            name: course.name,
            grade: course.grade,
            credits: parseFloat(course.credits)
          }))
        };

        fetch(`http://localhost:5001/api/gpa/${studentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('GPA calculation data sent:', data);
            setNewGPA(data.newGPA); // Set the new GPA when received from API
          })
          .catch((error) => {
            console.error('Error posting GPA data:', error);
          });
      }
    } catch (err) {
      console.error(err.message || "An unexpected error occurred.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="gpa-navbar">
      <Navbar />

      <div className="gpa-side-container">
        <SidebarPage />
        <div className="gpa-container">
          <h1 className="gpa-title">GPA Calculator</h1>

          {/* Current GPA and Credits Inputs */}
          <div className="gpa-inputs">
            <div className="gpa-input-group">
              <label className="gpa-input-label">Current GPA:</label>
              <input
                className="gpa-input"
                type="number"
                value={currentGPA}
                onChange={(e) => setCurrentGPA(e.target.value)}
                placeholder="Enter current GPA"
              />
            </div>
            <div className="gpa-input-group">
              <label className="gpa-input-label">Total Credits:</label>
              <input
                className="gpa-input"
                type="number"
                value={totalCredits}
                onChange={(e) => setTotalCredits(e.target.value)}
                placeholder="Enter total credits"
              />
            </div>
          </div>

          {/* Courses List */}
          {courses.map((course, index) => (
            <div key={index} className="course-inputs">
              <input
                className="course-input"
                type="text"
                placeholder="Course Name"
                value={course.name}
                onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
              />
              <select
                className="course-input"
                value={course.grade}
                onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
              >
                <option value="">Select Grade</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
              <input
                className="course-input"
                type="number"
                placeholder="Credits"
                value={course.credits}
                onChange={(e) => handleCourseChange(index, 'credits', e.target.value)}
              />
              <button className="remove-course-btn" onClick={() => removeCourse(index)}>
                <FaMinus />
              </button>
            </div>
          ))}

          {/* Add Course Button */}
          <button className="add-course-btn" onClick={addCourse}>
            <FaPlus /> Add Course
          </button>

          {/* Calculate GPA Button */}
          <div className="calculate-gpa-btn" onClick={handleCalcGPA}>
            <FaCalculator /> Calculate GPA
          </div>

          {/* Result */}
          <div className="gpa-result">
            {newGPA === null ? (
              <h2 className="gpa-result-text">Click Calculate to calculate</h2>
            ) : (
              <h2 className="gpa-result-text">New GPA: {newGPA}</h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GPA;
