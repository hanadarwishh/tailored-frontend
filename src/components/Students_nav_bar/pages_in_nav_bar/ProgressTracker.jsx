import React, { useState, useEffect } from 'react';
import './ProgressTracker.css';  // Updated styles for better design
import SidebarSmall from '../Sidenav/Sidenavsmall';

const ProgressTracker = () => {
    const [major, setMajor] = useState('');  // Track selected major
    const [courses, setCourses] = useState([]);  // Store fetched courses
    const [selectedCoreCourses, setSelectedCoreCourses] = useState([]);  // Selected Core courses
    const [selectedCrossCourses, setSelectedCrossCourses] = useState([]);  // Selected Cross Electives
    const [totalCredits, setTotalCredits] = useState(0);  // Track total credits
    const [error, setError] = useState(null);  // Handle errors
    const [isDataLoaded, setIsDataLoaded] = useState(false);  // Track if data is loaded from API
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const TOKEN = userData.token;


    // Fetch courses when the major is selected
    useEffect(() => {
        if (major) {
            fetchCourses(major);
        }
    }, [major]);

    const fetchCourses = async (major) => {
        try {
            const response = await fetch(`http://localhost:5002/api/progresstracker/courses/${major}`, {
                method: "GET",  // POST method
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            });

            // Handle API response
            if (!response.ok) throw new Error("Failed to fetch courses.");
            const data = await response.json();
            setCourses(data.courses || []);  // Save courses in state
            setIsDataLoaded(true);  // Indicate that data is loaded
            setError(null);  // Reset error state
        } catch (error) {
            setError(error.message);  // Set error message if the request fails
        }
    };

    const handleCourseSelection = (courseId, type) => {
        // Handle core course selection
        if (type === 'Core') {
            setSelectedCoreCourses(prevState =>
                prevState.includes(courseId)
                    ? prevState.filter(id => id !== courseId)
                    : [...prevState, courseId]
            );
        }
        // Handle cross-elective course selection
        else if (type === 'Cross-Elective') {
            setSelectedCrossCourses(prevState =>
                prevState.includes(courseId)
                    ? prevState.filter(id => id !== courseId)
                    : [...prevState, courseId]
            );
        }
    };

    useEffect(() => {
        // Calculate total credits based on selected courses
        const selectedCourses = [...selectedCoreCourses, ...selectedCrossCourses];
        const total = courses.reduce((acc, course) => {
            if (selectedCourses.includes(course.courseId)) {
                return acc + course.credits;
            }
            return acc;
        }, 0);
        setTotalCredits(total);  // Update total credits state
    }, [selectedCoreCourses, selectedCrossCourses, courses]);

    return (
        <div className="progress-tracker-container">
            <SidebarSmall/>
            <h2 className="page-title">Academic Progress Tracker</h2>

            {/* Major Selection Section */}
            <div className="major-selection-container">
                <label htmlFor="major" className="major-label">Select Major:</label>
                <select
                    id="major"
                    className="major-dropdown"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                >
                    <option value="">Select a major</option>
                    <option value="CS">Computer Science</option>
                    <option value="AI">Artificial Intelligence</option>
                </select>
            </div>

            {/* Course Selection Section */}
            {isDataLoaded && (
                <div className="courses-selection-container">
                    <div className="core-courses-section">
                        <h3 className="section-title">Core Courses</h3>
                        <div className="course-cards-container">
                            {courses
                                .filter(course => course.type === 'Core')
                                .map(course => (
                                    <div key={course.courseId} className="course-card">
                                        <input
                                            type="checkbox"
                                            id={course.courseId}
                                            checked={selectedCoreCourses.includes(course.courseId)}
                                            onChange={() => handleCourseSelection(course.courseId, 'Core')}
                                        />
                                        <div className="course-info">
                                            <h4>{course.name}</h4>
                                            <p>{course.credits} Credits</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="cross-elective-section">
                        <h3 className="section-title">Cross Elective Courses</h3>
                        <div className="course-cards-container">
                            {courses
                                .filter(course => course.type === 'Cross-Elective')
                                .map(course => (
                                    <div key={course.courseId} className="course-card">
                                        <input
                                            type="checkbox"
                                            id={course.courseId}
                                            checked={selectedCrossCourses.includes(course.courseId)}
                                            onChange={() => handleCourseSelection(course.courseId, 'Cross-Elective')}
                                        />
                                        <div className="course-info">
                                            <h4>{course.name}</h4>
                                            <p>{course.credits} Credits</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Total Credits Section */}
            <div className="credits-summary-container">
                <div className="credits-summary-card">
                    <h4>Total Credits Selected</h4>
                    <div className="total-credits">{totalCredits} Credits</div>
                </div>
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default ProgressTracker;
