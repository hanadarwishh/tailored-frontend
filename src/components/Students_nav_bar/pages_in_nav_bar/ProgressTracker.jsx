import React, { useState } from 'react';
import './ProgressTracker.css';

const ProgressTracker = () => {
    // Updated course data
    const generalEducationCourses = [
        { id: 1, name: "Writing Skills", creditHours: 3 },
        { id: 2, name: "Presentation and Communication Skills", creditHours: 3 },
        { id: 3, name: "Critical Thinking", creditHours: 3 },
        { id: 4, name: "Key Concepts in Business & Management", creditHours: 3 },
        { id: 5, name: "Key Issues in Entrepreneurship & Innovation", creditHours: 3 },
        { id: 6, name: "Project Management", creditHours: 3 },
    ];

    const electiveCourses = [
        { id: 7, name: "Selected Topics in Humanities", creditHours: 3 },
    ];

    const facultyCourses = [
        { id: 8, name: "Ethics in Technology", creditHours: 3 },
    ];

    const mathCourses = [
        { id: 9, name: "Pre-Calculus", creditHours: 0 },
        { id: 10, name: "Calculus I", creditHours: 3 },
        { id: 11, name: "Calculus II", creditHours: 3 },
        { id: 12, name: "Linear Algebra", creditHours: 3 },
        { id: 13, name: "Discrete Mathematics", creditHours: 3 },
        { id: 14, name: "Probability and Statistics", creditHours: 3 },
        { id: 15, name: "Differential Equations", creditHours: 3 },
    ];

    const biomedicalInformaticsCourses = [
        { id: 16, name: "Introduction to Bio-informatics", creditHours: 3 },
    ];

    const computingCourses = [
        { id: 17, name: "Introduction to Computing", creditHours: 0 },
        { id: 18, name: "Digital Logic Design", creditHours: 3 },
        { id: 19, name: "Introduction to Programming", creditHours: 3 },
        { id: 20, name: "Programming II", creditHours: 3 },
        { id: 21, name: "Data Structures and Algorithms", creditHours: 3 },
        { id: 22, name: "Software Engineering", creditHours: 3 },
        { id: 23, name: "Database Systems", creditHours: 3 },
        { id: 24, name: "Introduction to Data Science", creditHours: 3 },
        { id: 25, name: "Analysis and Design of Algorithms", creditHours: 3 },
        { id: 26, name: "Theory of Computing", creditHours: 3 },
        { id: 27, name: "Operating Systems", creditHours: 3 },
        { id: 28, name: "Industrial Training I", creditHours: 3 },
        { id: 29, name: "Computer Networks", creditHours: 3 },
        { id: 30, name: "Introduction to Artificial Intelligence", creditHours: 3 },
        { id: 31, name: "Senior Project I", creditHours: 3 },
        { id: 32, name: "Senior Project II", creditHours: 3 },
    ];

    const letterGrades = ["A+","A","A-", "B+", "B", "B-", "C+","C", "C-" ,"D+","D","D-", "F"];

    const [selectedCourses, setSelectedCourses] = useState({
        generalEducation: [],
        elective: [],
        faculty: [],
        math: [],
        biomedical: [],
        computing: [],
    });

    const [totalCreditHours, setTotalCreditHours] = useState(0);

    const handleAddCourse = (category, courseId) => {
        const courseList =
            category === 'generalEducation'
                ? generalEducationCourses
                : category === 'elective'
                ? electiveCourses
                : category === 'faculty'
                ? facultyCourses
                : category === 'math'
                ? mathCourses
                : category === 'biomedical'
                ? biomedicalInformaticsCourses
                : computingCourses;

        const course = courseList.find((course) => course.id === parseInt(courseId));
        if (course && !selectedCourses[category].some((c) => c.id === course.id)) {
            setSelectedCourses((prev) => ({
                ...prev,
                [category]: [...prev[category], { ...course, grade: null }],
            }));
            setTotalCreditHours((prev) => prev + course.creditHours);
        }
    };

    const handleGradeChange = (category, courseId, grade) => {
        setSelectedCourses((prev) => ({
            ...prev,
            [category]: prev[category].map((course) =>
                course.id === courseId ? { ...course, grade } : course
            ),
        }));
    };

    const renderCourseContainer = (category, title, courseList) => (
        <div className="progress-tracker-category">
            <h3 className="category-title">{title}</h3>
            <select
                className="course-dropdown"
                onChange={(e) => handleAddCourse(category, e.target.value)}
                defaultValue=""
            >
                <option value="" disabled>
                    Select a course
                </option>
                {courseList.map((course) => (
                    <option key={course.id} value={course.id}>
                        {course.name} ({course.creditHours} hrs)
                    </option>
                ))}
            </select>
            <ul className="course-list">
                {selectedCourses[category].map((course) => (
                    <li key={course.id} className="course-item completed">
                        {course.name} - {course.creditHours} hrs
                        <select
                            className="grade-dropdown"
                            onChange={(e) => handleGradeChange(category, course.id, e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select Grade
                            </option>
                            {letterGrades.map((grade) => (
                                <option key={grade} value={grade}>
                                    {grade}
                                </option>
                            ))}
                        </select>
                        {course.grade && <span> - Grade: {course.grade}</span>}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="progress-tracker-container">
            <h2 className="progress-tracker-title">Student Progress Tracker</h2>
            <div className="progress-tracker-grid">
                {renderCourseContainer('generalEducation', 'General Education Courses', generalEducationCourses)}
                {renderCourseContainer('elective', 'Elective Courses', electiveCourses)}
                {renderCourseContainer('faculty', 'Faculty Courses', facultyCourses)}
                {renderCourseContainer('math', 'Math Courses', mathCourses)}
                {renderCourseContainer('biomedical', 'Biomedical Informatics Courses', biomedicalInformaticsCourses)}
                {renderCourseContainer('computing', 'Computing Courses', computingCourses)}
            </div>
            <div className="total-credit-hours">
                <h3>Total Credit Hours: {totalCreditHours}</h3>
            </div>
        </div>
    );
};

export default ProgressTracker;
