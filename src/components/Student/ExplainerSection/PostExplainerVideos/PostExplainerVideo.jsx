import React, { useState, useEffect } from "react";
import "./PostExplainerVideo.css";
import { useNavigate } from "react-router-dom";
import SidebarPage from "../../../SideBar/Sidenav";

const ExplainerSection = () => {
  const navigate = useNavigate();

  const [fileName, setFileName] = useState("No file chosen");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [topic, setTopic] = useState("");
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
    setFileName(file ? file.name : "No file chosen");
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

    // Log the values of all fields to check what's missing
    console.log("Selected Course:", selectedCourse);
    console.log("Selected Course Name:", selectedCourseName);
    console.log("Topic:", topic);
    console.log("File Uploaded:", isFileUploaded);

    if (!selectedCourse || !selectedCourseName || !topic || !isFileUploaded) {
      setError("Please fill all fields and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("courseId", selectedCourse);
    formData.append("courseName", selectedCourseName);
    formData.append("topic", topic);
    formData.append("video", document.getElementById("video-upload").files[0]);

    try {
      const response = await fetch(
        "http://localhost:3005/api/explainersection",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert("Successfully posted");
        navigate("/explainer-section");
      } else {
        console.log(response);
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Helper function to get input field class based on validation
  const getFieldClass = (field) => {
    return field === "" ? "input-error" : "";
  };

  return (
    <div className="ep-explainer-sidebar">
      <SidebarPage />

      <div className="ep-explainer-section-container">
        <h2 className="ep-section-title">Post Your Explainer Video</h2>
        <form className="ep-explainer-form" onSubmit={handleSubmit}>
          <div className="ep-form-group">
            <label htmlFor="course-name">Course Name:</label>
            <select
              id="course-name"
              name="courseName"
              value={selectedCourse}
              onChange={(e) => {
                const selectedCourseId = e.target.value;

                // Find the course object based on the selected course ID
                const course = courses.find(
                  (course) => String(course.id) === String(selectedCourseId)
                ); // Ensure both are strings

                console.log("Selected Course Object:", course); // Log the course before updating state

                if (course) {
                  // Update the selected course ID and name
                  setSelectedCourse(selectedCourseId);
                  setSelectedCourseName(course.fullname); // Make sure fullname is available
                } else {
                  // Clear course name if no course is found
                  setSelectedCourse("");
                  setSelectedCourseName("");
                }
              }}
              className={getFieldClass(selectedCourse)}
            >
              <option value="">Select a course</option>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.fullname}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No courses available
                </option>
              )}
            </select>
          </div>

          <div className="ep-form-group">
            <label htmlFor="topic">Topic:</label>
            <input
              type="text"
              id="topic"
              name="topic"
              placeholder="Enter the topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={getFieldClass(topic)}
            />
          </div>

          <div className="ep-upload-container">
            <label htmlFor="video-upload">Upload Explainer Video:</label>
            <div
              className="ep-drag-drop-container"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <p>Drag & Drop your video here</p>
              <button
                type="button"
                className="ep-upload-button"
                onClick={() => document.getElementById("video-upload").click()}
              >
                Choose File
              </button>
              <input
                type="file"
                id="video-upload"
                className="ep-file-input"
                name="video"
                accept="video/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="ep-file-name">{fileName}</div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="ep-submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExplainerSection;
