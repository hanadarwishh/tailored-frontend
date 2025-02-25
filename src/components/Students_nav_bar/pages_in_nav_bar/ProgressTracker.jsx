import React, { useState, useEffect } from 'react';
import './ProgressTracker.css'; // Updated styles
import SidebarSmall from '../Sidenav/Sidenavsmall';

const ProgressTracker = () => {
    const [major, setMajor] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCoreCourses, setSelectedCoreCourses] = useState([]);
    const [selectedCrossCourses, setSelectedCrossCourses] = useState([]);
    const [totalCredits, setTotalCredits] = useState(0);
    const [error, setError] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const TOKEN = userData.token;

    // Fetch courses when major is selected
    useEffect(() => {
        if (major) {
            fetchCourses(major);
        }
    }, [major]);

    const fetchCourses = async (major) => {
        try {
            const response = await fetch(`http://localhost:5002/api/progresstracker/courses/${major}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${TOKEN}` },
            });
            if (!response.ok) throw new Error('Failed to fetch courses.');
            const data = await response.json();
            setCourses(data.courses || []);
            setIsDataLoaded(true);
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCourseSelection = (courseId, type) => {
        if (type === 'Core') {
            setSelectedCoreCourses((prevState) =>
                prevState.includes(courseId) ? prevState.filter((id) => id !== courseId) : [...prevState, courseId]
            );
        } else if (type === 'Cross-Elective') {
            setSelectedCrossCourses((prevState) =>
                prevState.includes(courseId) ? prevState.filter((id) => id !== courseId) : [...prevState, courseId]
            );
        }
    };

    useEffect(() => {
        const selectedCourses = [...selectedCoreCourses, ...selectedCrossCourses];
        const total = courses.reduce((acc, course) => {
            if (selectedCourses.includes(course.courseId)) {
                return acc + course.credits;
            }
            return acc;
        }, 0);
        setTotalCredits(total);
    }, [selectedCoreCourses, selectedCrossCourses, courses]);

    return (
        <div style={{flexDirection: "row", display: "flex"}}>
            <SidebarSmall/>

        <div className="pt-container">
            <h1 className="pt-header">Academic Progress Tracker</h1>

            {/* Major Selection */}
            <div className="pt-card">
                <h2 className="pt-section-title">Select Your Major</h2>
                <select
                    className="pt-select"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                >
                    <option value="">Select a Major</option>
                    <option value="CS">Computer Science</option>
                    <option value="AI">Artificial Intelligence</option>
                </select>
            </div>

            {/* Courses Section */}
            {isDataLoaded && (
                <div className="pt-card">
                    <h2 className="pt-section-title">Courses</h2>

                    <div>
                        <h3>Core Courses</h3>
                        {courses.filter(course => course.type === 'Core').map(course => (
                            <div key={course.courseId} className="pt-course-card">
                                <div className="pt-course-info">
                                    <h4>{course.name}</h4>
                                    <p>{course.credits} Credits</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selectedCoreCourses.includes(course.courseId)}
                                    onChange={() => handleCourseSelection(course.courseId, 'Core')}
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <h3>Cross-Elective Courses</h3>
                        {courses.filter(course => course.type === 'Cross-Elective').map(course => (
                            <div key={course.courseId} className="pt-course-card">
                                <div className="pt-course-info">
                                    <h4>{course.name}</h4>
                                    <p>{course.credits} Credits</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selectedCrossCourses.includes(course.courseId)}
                                    onChange={() => handleCourseSelection(course.courseId, 'Cross-Elective')}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Progress Summary */}
            <div className="pt-card">
                <h2 className="pt-section-title">Your Progress</h2>
                <div className="pt-progress-bar-container">
                    <div
                        className="pt-progress-bar"
                        style={{ width: `${(totalCredits / 120) * 100}%` }}
                    ></div>
                </div>
                <div className="pt-total-credits">{totalCredits} / 120 Credits</div>
            </div>

            {/* Error Message */}
            {error && <div className="pt-error-message">{error}</div>}
        </div>
        </div>

    );
};

export default ProgressTracker;
