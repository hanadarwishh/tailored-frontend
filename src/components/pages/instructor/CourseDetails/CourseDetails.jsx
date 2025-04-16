import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowDown,
  FaArrowUp,
  FaBook,
  FaFolderOpen,
  FaFileDownload,
  FaUpload,
  FaComments,
  FaClipboardList,
  FaRegFileAlt
} from "react-icons/fa";
import Modal from "react-modal";
import "./CourseDetails.css";
import Navbar from "../../../NavBar/NavBar";
import chatbotImage from '../../../Assets/chatbot_full-removebg-preview.png';
import AddResourceModal from '../ResourceModal/ResourceModal'; // Import the new modal component

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
  const [textSubmission, setTextSubmission] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const courseId = location.state?.course?.id;
  const courseName = location.state?.course?.fullname;
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const TOKEN = userData.token;
  console.log(TOKEN);
  console.log(courseId);

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

      const formData = new FormData();

      if (file) {
        formData.append("file", file);
      }

      const pluginData = {
        onlinetext_editor: {
          text: textSubmission || "",
          format: 1,
          itemid: 0,
        },
        files_filemanager: 0,
      };

      formData.append("pluginData", JSON.stringify(pluginData));

      setUploading(true);

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
    setTextSubmission("");
    setFile(null);
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

  const handleChatbotClick = () => {
    navigate("/course-chatbot", {
      state: {
        courseName: courseName,
        courseId: courseId
      }
    });
  };

  const handleSummarizeClick = (selectedFileUrl, selectedModuleId) => {
    const allLectures = [];

    sections.forEach((section) => {
      section.modules?.forEach((module) => {
        if (module.contents?.length > 0) {
          module.contents.forEach((content) => {
            allLectures.push({
              moduleId: module.id,
              name: content.filename,
              filename: content.filename,
              url: content.fileurl,
              fileurl: content.fileurl,
            });
          });
        }
      });
    });

    const selectedLecture = allLectures.find(
      (lecture) => lecture.url === selectedFileUrl
    );

    navigate("/lecture-summarize", {
      state: {
        selectedLecture,
        allLectures,
        courseName
      },
    });
  };

  const handleAddResource = (type, sectionId) => {
    alert(`Resource type "${type}" will be added to section ${sectionId}.`);
  };

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
      <Navbar />
      <div className="course-details-page">
        <div className="course-header">
          <h2>
            <FaBook className="cd-icon" /> {courseName}
          </h2>
          <button className="edit-toggle-button" onClick={() => setIsEditMode(!isEditMode)}>
            {isEditMode ? "Exit Edit Mode" : "Edit"}
          </button>
          <p>Explore the course details below:</p>
        </div>

        <div className="sections-list">
          {sections.length > 0 ? (
            sections.map((section) => (
              <div key={section.id} className="section-card">
                {console.log(section.id)}
                <div className="section-header" onClick={() => toggleSection(section.id)}>
                  <h4>
                    <FaFolderOpen className="cd-icon" /> {section.name}
                  </h4>
                  <span>
                    {expandedSections[section.id] ? <FaArrowUp /> : <FaArrowDown />}
                  </span>
                </div>

                {isEditMode && (
                  <AddResourceModal
                    sectionId={section.id}
                    onSelectResource={(type) => handleAddResource(type, section.id)}
                  />
                )}

                {expandedSections[section.id] && section.modules?.length > 0 && (
                  <div className="module-list">
                    {section.modules.map((module) => (
                      <div key={module.id} className="course-module-item">
                        {module.modname === "assign" ? (
                          <button
                            className="assignment-button"
                            onClick={() => openAssignmentModal(module.id)}
                          >
                            <FaUpload className="red-icon" /> {module.name}
                          </button>
                        ) : module.modname === "forum" ? (
                          <button
                            className="forum-button"
                            onClick={() =>
                              navigate("/discussion-forum", { state: { forumId: module.instance } })
                            }
                          >
                            <FaComments className="blue-icon" /> {module.name}
                          </button>
                        ) : (
                          <div>
                            <div className="lecture-summarization-icon">
                              <FaRegFileAlt
                                className="green-icon"
                                onClick={() => handleSummarizeClick(module.contents[0]?.fileurl, module.id)}
                              />
                            </div>
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
                                      href={`${content.fileurl}&token=${TOKEN}`}
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
      </div>
    </div>
  );
};

export default CourseDetails;
