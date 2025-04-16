import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  FaArrowDown,
  FaArrowUp,
  FaFolderOpen,
  FaFileDownload,
  FaUpload,
  FaComments,
  FaRegFileAlt,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import "./CourseDetails.css";
import Navbar from "../../../UpperNavBar/NavBar";
import chatbotImage from "../../../Assets/chatbot_full-removebg-preview.png";
import LoadingScreen from "../../../Loading/LoadingScreen";

const mockCourseData = {
  courses: [
    {
      id: 1,
      name: "Week 1",
      modules: [
        {
          id: 101,
          name: "Lecture 1",
          modname: "resource",
          url: "https://example.com/lecture1",
          contents: [
            {
              filename: "Lecture1.pdf",
              fileurl: "https://example.com/files/lecture1.pdf",
              filesize: 123456,
            },
          ],
        },
        {
          id: 102,
          name: "Assignment 1",
          modname: "assign",
        },
        {
          id: 103,
          name: "Discussion 1",
          modname: "forum",
          instance: 12,
        },
      ],
    },
    {
      id: 2,
      name: "Week 2",
      modules: [
        {
          id: 101,
          name: "Lecture 2",
          modname: "resource",
          url: "https://example.com/lecture1",
          contents: [
            {
              filename: "Lecture2a.pdf",
              fileurl: "https://example.com/files/lecture1.pdf",
              filesize: 123456,
            },
            {
              filename: "Lecture2b.pdf",
              fileurl: "https://example.com/files/lecture2.pdf",
              filesize: 21,
            },
          ],
        },
        {
          id: 102,
          name: "Assignment 1",
          modname: "assign",
        },
        {
          id: 103,
          name: "Discussion 1",
          modname: "forum",
          instance: 12,
        },
      ],
    },
  ],
};

const mockAssignmentData = {
  courses: {
    assignments: [
      {
        id: 555,
        name: "Assignment 1",
        duedate: "May 17, 2025",
        opened: "May 15, 2025",
        description: "Complete Assignment 1 following the instructions provided in the course materials.",
        title: "Assignment 1: Introduction to Course Concepts",
      },
    ],
  },
};

const CourseDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");

  const courseId = location.state?.course?.id || 1;
  const courseName = location.state?.course?.fullname || "Mock Course";

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
    if (!file) {
      alert("Please select a file for submission.");
      return;
    }

    setUploading(true);
    setTimeout(() => {
      alert("Assignment submitted successfully!");
      closeAssignmentModal();
      setUploading(false);
    }, 1500);
  };

  const openAssignmentModal = () => {
    const assign = mockAssignmentData.courses.assignments[0];
    setSelectedAssignment(assign);
    setIsModalOpen(true);
  };

  const closeAssignmentModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
    setFile(null);
  };

  useEffect(() => {
    const courseData = mockCourseData;
    setCourse(courseData);

    const initialExpanded = {};
    courseData.courses.forEach((section) => {
      initialExpanded[section.id] = true;
    });
    setExpandedSections(initialExpanded);
    setLoading(false);
  }, []);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (selectedAssignment?.duedate) {
        // Mock calculation since duedate is a string in our mock data
        setTimeRemaining("48h 30m 15s");
      }
    };

    calculateTimeRemaining();
    const intervalId = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(intervalId);
  }, [selectedAssignment]);

  const handleChatbotClick = () => {
    navigate("/course-chatbot", {
      state: { courseName, courseId },
    });
  };

  const handleSummarizeClick = (selectedFileUrl, selectedModuleId) => {
    const allLectures = [];

    const sections = course?.courses || [];
    sections.forEach((section) => {
      section.modules?.forEach((module) => {
        module.contents?.forEach((content) => {
          allLectures.push({
            moduleId: module.id,
            name: content.filename,
            filename: content.filename,
            url: content.fileurl,
            fileurl: content.fileurl,
          });
        });
      });
    });

    const selectedLecture = allLectures.find(
      (lecture) => lecture.url === selectedFileUrl
    );

    navigate("/lecture-summarize", {
      state: {
        selectedLecture,
        allLectures,
        courseName,
      },
    });
  };

  if (loading) return <LoadingScreen title="Loading course details..." />;
  if (!course) return <div className="error"><p>No course found.</p></div>;

  const sections = course.courses || [];

  return (
    <div>
      <div className="course-details-page">
        <Navbar pageTitle={courseName} />
        

        <div className="modules-list">
          <h3>Course Modules</h3>
          {sections.map((section) => (
            <div key={section.id} className="section-card">
              <div
                className="section-header"
                onClick={() => toggleSection(section.id)}
              >
                <h4>
                  <FaFolderOpen className="cd-icon" /> {section.name}
                </h4>
                <span
                  className={`toggle-arrow ${
                    expandedSections[section.id] ? "open" : ""
                  }`}
                >
                  {expandedSections[section.id] ? (
                    <FaArrowUp />
                  ) : (
                    <FaArrowDown />
                  )}
                </span>
              </div>

              {expandedSections[section.id] && section.modules?.length > 0 && (
                <div className="module-list">
                  {section.modules.map((module) => (
                    <div key={module.id} className="course-module-item">
                      {module.modname === "assign" ? (
                        <button
                          className="assignment-button"
                          onClick={() => openAssignmentModal()}
                        >
                          <FaUpload className="red-icon" /> {module.name}
                        </button>
                      ) : module.modname === "forum" ? (
                        <button
                          className="forum-button"
                          onClick={() =>
                            navigate("/discussion-forum", {
                              state: { forumId: module.instance },
                            })
                          }
                        >
                          <FaComments className="blue-icon" /> {module.name}
                        </button>
                      ) : (
                        <div style={{ position: "relative", width: "100%" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <a
                              href={module.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="module-link"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <FaRegFileAlt style={{ marginRight: "0.5rem", font: "1.3rem" }} /> {module.name}
                            </a>
                          </div>
                          {module.contents?.length > 0 && (
                            <div className="module-contents">
                              {module.contents.map((content, idx) => (
                                <div key={idx} className="content-item">
                                  <a
                                    href={content.fileurl}
                                    download
                                    className="content-link"
                                  >
                                    <FaFileDownload /> {content.filename}
                                  </a>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <p>{(content.filesize / 1024).toFixed(1)} KB</p>
                                    <FaRegFileAlt
                                      className="green-icon"
                                      onClick={() => handleSummarizeClick(content.fileurl, module.id)}
                                      title={`Generate summary for ${content.filename}`}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
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
          ))}
        </div>

        <div className="course-options">
          <button className="back-button" onClick={() => navigate("/courses")}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Courses
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeAssignmentModal}
          contentLabel="Assignment Details"
          className="assignment-modal"
          overlayClassName="assignment-modal-overlay"
          ariaHideApp={false}
        >
          {selectedAssignment && (
            <>
              <button
                className="close-modal-button"
                onClick={closeAssignmentModal}
                aria-label="Close modal"
              >
                <MdCancel />
              </button>
              <h3>{selectedAssignment.title}</h3>
              
              <div className="countdown-timer">
                Time Remaining: {timeRemaining}
              </div>
              
              <p>
                <strong>Opened:</strong> {selectedAssignment.opened}
              </p>
              <p>
                <strong>Due Date:</strong> {selectedAssignment.duedate}
              </p>
              <p>
              <strong>Description:</strong> {selectedAssignment.description}
              </p>

              <div className="file-upload-container">
                <h4>Upload Your Submission</h4>

                <div
                  className={`drag-drop-area ${dragging ? "dragging" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <p>Selected file: <strong>{file.name}</strong></p>
                  ) : (
                    <p>Drag and drop your file here, or click the button below to select a file</p>
                  )}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                    id="assignment-file"
                  />
                  <label
                    htmlFor="assignment-file"
                    className="file-select-button"
                  >
                    Select File
                  </label>
                </div>

                <div className="submit-button-wrapper">
                  <button
                    className="add-submission-button"
                    disabled={!file || uploading}
                    onClick={submitAssignment}
                  >
                    {uploading ? "Submitting..." : "Submit Assignment"}
                  </button>
                </div>
              </div>
            </>
          )}
        </Modal>
      </div>

      <div className="chatbot-container" onClick={handleChatbotClick}>
        <div className="chatbot-bubble">
          <p>
            Need help with your coursework? Chat with me or upload files for assistance!
          </p>
        </div>
        <div className="chatbot-icon">
          <img src={chatbotImage} alt="Chatbot Assistant" className="chatbot-image" />
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;