import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowDown,
  FaArrowUp,
  FaBook,
  FaFolderOpen,
  FaFileDownload,
  FaUpload,
} from "react-icons/fa";
import Modal from "react-modal";
import "./CourseDetails.css";
import Navbar from "../NavBar/NavBar";

Modal.setAppElement("#root");

const CourseDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [textSubmission, setTextSubmission] = useState(""); // Text for submission

  const courseId = location.state?.course?.id;
  const courseName = location.state?.course?.fullname;
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const TOKEN = userData.token;

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const submitAssignment = async () => {
    try {
      if (!file && !textSubmission) {
        alert("Please provide a text or file for submission.");
        return;
      }
  
      // Prepare FormData for the file upload
      const formData = new FormData();
  
      // Add file if provided
      if (file) {
        formData.append("file", file); // The file input field should match the backend handler's expected name
      }
  
      // Add pluginData for text submission and file draft area
      const pluginData = {
        onlinetext_editor: {
          text: textSubmission || "", // Add the text from the text area
          format: 1, // Default format (Moodle's default is HTML = 1)
          itemid: 0, // Set to 0 if no file is attached
        },
        files_filemanager: 0, // If a file is uploaded, this should match the draft area ID
      };
  
      formData.append("pluginData", JSON.stringify(pluginData));
  
      setUploading(true);
  
      // Make the API call
      const response = await fetch(
        `http://localhost:3002/api/courses/submit/assignment/${selectedAssignment.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          body: formData,
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        alert("Assignment submitted successfully!");
        closeAssignmentModal();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit the assignment.");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("An error occurred during submission. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  
  

  const openAssignmentModal = async (assignid) => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/courses/assignment/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assignment details");
      }

      const data = await response.json();
      const assign = data.courses.assignments[0];
      setSelectedAssignment(assign);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching assignment details:", error);
    }
  };

  const closeAssignmentModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
    setTextSubmission(""); // Clear the text submission field
    setFile(null); // Clear the file
  };

  useEffect(() => {
    if (courseId) {
      const fetchCourseDetails = async () => {
        try {
          const response = await fetch(
            `http://localhost:3002/api/courses/${courseId}`,
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch course details");
          }

          const data = await response.json();
          setCourse(data);

          const initialExpandedSections = data.courses.reduce((acc, section) => {
            acc[section.id] = true;
            return acc;
          }, {});

          setExpandedSections(initialExpandedSections);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCourseDetails();
    }
  }, [courseId]);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (selectedAssignment?.duedate) {
        const dueDate = new Date(selectedAssignment.duedate * 1000);
        const now = new Date();
        const timeDiff = dueDate - now;

        if (timeDiff > 0) {
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining("Time's up!");
        }
      }
    };

    calculateTimeRemaining();
    const intervalId = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(intervalId);
  }, [selectedAssignment]);

  if (loading) {
    return <p className="loading">Loading course details...</p>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate("/courses")}>Back to Courses</button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="error">
        <p>Course details not found.</p>
        <button onClick={() => navigate("/courses")}>Back to Courses</button>
      </div>
    );
  }

  const sections = course.courses || [];

  return (
    <div>
        <Navbar/>
    <div className="course-details-page">
      <div className="course-header">
        <h2>
          <FaBook className="cd-icon" /> {courseName}
        </h2>
        <p>Explore the course details below:</p>
      </div>

      <div className="sections-list">
        {sections.length > 0 ? (
          sections.map((section) => (
            <div key={section.id} className="section-card">
              <div
                className="section-header"
                onClick={() => toggleSection(section.id)}
              >
                <h4>
                  <FaFolderOpen className="cd-icon" /> {section.name}
                </h4>
                <span>
                  {expandedSections[section.id] ? <FaArrowUp /> : <FaArrowDown />}
                </span>
              </div>

              {expandedSections[section.id] && section.modules?.length > 0 && (
                <div className="module-list">
                  {section.modules.map((module) => (
                    <div key={module.id} className="module-item">
                      {module.modname === "assign" ? (
                        <button
                          className="assignment-button"
                          onClick={() => openAssignmentModal(module.id)}
                        >
                          <FaUpload className="red-icon" /> {module.name}
                        </button>
                      ) : (
                        <div>
                          <a
                            href={module.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="module-link"
                          >
                            {module.name}
                          </a>
                          {module.contents?.length > 0 && (
                            <div className="module-contents">
                              {module.contents.map((content, index) => (
                                <div key={index} className="content-item">
                                  <a
                                    href={`${content.fileurl}&token=2aa9cad85973d3790f2f6c467317c6ac`}
                                    download
                                    className="content-link"
                                  >
                                    <FaFileDownload /> {content.filename}
                                  </a>
                                  <p>Size: {content.filesize} bytes</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No sections available for this course.</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeAssignmentModal}
        className="assignment-modal"
        overlayClassName="assignment-modal-overlay"
      >
        {selectedAssignment ? (
          <div>
            <h3>{selectedAssignment.name}</h3>
            <p>
              <strong>Opened:</strong>{" "}
              {new Date(selectedAssignment.allowsubmissionsfromdate * 1000).toLocaleString()}
            </p>
            <p>
              <strong>Due:</strong>{" "}
              {new Date(selectedAssignment.duedate * 1000).toLocaleString()}
            </p>
            {selectedAssignment.intro && (
              <p dangerouslySetInnerHTML={{ __html: selectedAssignment.intro }} />
            )}
            {selectedAssignment.introattachments?.length > 0 && (
              <div>
                <h4>Assignment Files:</h4>
                {selectedAssignment.introattachments.map((file, index) => (
                  <a
                    key={index}
                    href={`${file.fileurl}&token=2aa9cad85973d3790f2f6c467317c6ac`}
                    download
                    className="content-link"
                  >
                    <FaFileDownload /> {file.filename}
                  </a>
                ))}
              </div>
            )}

            {/* Countdown Timer */}
            <div className="countdown-timer" style={{ color: "red" }}>
              <p><strong>Time Remaining:</strong> {timeRemaining}</p>
            </div>

            {/* Text Submission */}
            <div className="text-submission">
              <label htmlFor="textSubmission">Enter your text submission:</label>
              <textarea
                id="textSubmission"
                value={textSubmission}
                onChange={(e) => setTextSubmission(e.target.value)}
                placeholder="Type your submission here"
                rows="5"
              />
            </div>

            {/* File Upload Button */}
            <button
              className="file-select-button"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <FaUpload /> Select File
            </button>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className="file-input"
              style={{ display: "none" }}
            />

            {/* Drag and Drop Section */}
            <div
              className={`drag-drop-area ${dragging ? "dragging" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <p>
                {file ? `Selected File: ${file.name}` : dragging ? "Release to drop the file" : "Drag & drop a file here"}
              </p>
            </div>

            {/* Submit Assignment Button */}
            <div className="submit-button-wrapper">
              <button
                className="add-submission-button"
                onClick={submitAssignment}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Submit Assignment"}
              </button>
            </div>
          </div>
        ) : (
          <p>Loading assignment details...</p>
        )}
        <button className="close-modal-button" onClick={closeAssignmentModal}>
          Close
        </button>
      </Modal>

      <button className="back-button" onClick={() => navigate("/courses")}>
        Back to Courses
      </button>
    </div>
    </div>

  );
};

export default CourseDetails;
