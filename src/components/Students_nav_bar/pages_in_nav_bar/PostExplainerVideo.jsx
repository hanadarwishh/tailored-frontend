import React, { useState, useEffect } from 'react';
import './PostExplainerVideo.css';
import { useNavigate } from "react-router-dom";
import SidebarPage from '../Sidenav/Sidenav';
import { FaTachometerAlt, FaVideo, FaThumbsUp, FaRegClock } from "react-icons/fa";

const ExplainerSection = () => {
  const navigate = useNavigate();

  const [fileName, setFileName] = useState('No file chosen');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [topic, setTopic] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const TOKEN = userData.token;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/courses", {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        if (data.courses && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          setError("Invalid courses data format.");
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchCourses();
  }, [TOKEN]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : 'No file chosen');
    setIsFileUploaded(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setIsFileUploaded(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCourse || !selectedCourseName || !topic || !isFileUploaded) {
      setError("Please fill all fields and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append('courseId', selectedCourse);
    formData.append('courseName', selectedCourseName);
    formData.append('topic', topic);
    formData.append('video', document.getElementById('video-upload').files[0]);

    try {
      const response = await fetch('http://localhost:3005/api/explainersection', {
        method: 'POST',
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Successfully posted");
        navigate("/explainer-section");
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const getFieldClass = (field) => (field === '' ? 'pev-input-error' : '');

  return (
    <div className="pev-main-container">
      <div className="pev-content-layout">
        <div className="pev-form-section">
          <h2 className="pev-section-title">Post Your Explainer Video</h2>
          <form className="pev-form" onSubmit={handleSubmit}>
            <div className="pev-form-group">
              <label htmlFor="course-name">Course Name:</label>
              <select
                id="course-name"
                value={selectedCourse}
                onChange={(e) => {
                  const course = courses.find(c => String(c.id) === String(e.target.value));
                  if (course) {
                    setSelectedCourse(course.id);
                    setSelectedCourseName(course.fullname);
                  } else {
                    setSelectedCourse('');
                    setSelectedCourseName('');
                  }
                }}
                className={getFieldClass(selectedCourse)}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.fullname}
                  </option>
                ))}
              </select>
            </div>

            <div className="pev-form-group">
              <label htmlFor="topic">Topic:</label>
              <input
                type="text"
                id="topic"
                placeholder="Enter the topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={getFieldClass(topic)}
              />
            </div>

            <div className="pev-upload-section">
              <label htmlFor="video-upload">Upload Explainer Video:</label>
              <div
                className="pev-dropzone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <p>Drag & Drop your video here</p>
                <button
                  type="button"
                  className="pev-upload-button"
                  onClick={() => document.getElementById('video-upload').click()}
                >
                  Choose File
                </button>
                <input
                  type="file"
                  id="video-upload"
                  name="video"
                  accept="video/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="pev-file-name">{fileName}</div>
            </div>

            {error && <div className="pev-error-message">{error}</div>}

            <button type="submit" className="pev-submit-button">Submit</button>
          </form>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="pev-right-sidebar">
          <h2>Extra Tools</h2>
          <ul className="pev-tool-list">
            <li className="pev-tool-item" onClick={() => navigate("/student")}>
              <FaTachometerAlt className="pev-tool-icon" />
              <span>Back to Dashboard</span>
            </li>
            <li className="pev-tool-item" onClick={() => navigate("/my-profile")}>
              <FaVideo className="pev-tool-icon" />
              <span>My Videos</span>
            </li>
            <li className="pev-tool-item" onClick={() => navigate("/liked-videos")}>
              <FaThumbsUp className="pev-tool-icon" />
              <span>Liked Videos</span>
            </li>
            <li className="pev-tool-item">
              <FaRegClock className="pev-tool-icon" />
              <span>Under Review</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExplainerSection;
