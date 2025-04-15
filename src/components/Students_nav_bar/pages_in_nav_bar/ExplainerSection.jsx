import React, { useEffect, useState } from "react";
import "./ExplainerSection.css";
import { FaEye, FaThumbsUp, FaUser, FaVideo, FaRegClock, FaBook, FaFilter, FaPlus } from 'react-icons/fa';

import SidebarSmall from "../Sidenav/Sidenavsmall";
import Navbar from "../../NavBar/NavBar";
import { useNavigate } from "react-router-dom";


const ExplainerSection = ({ courseId, userId }) => {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCourses, setExpandedCourses] = useState({});

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const TOKEN = userData.token;

  const getEmbedVideoUrl = (url) => {
    const fileId = url.split("/d/")[1]?.split("/")[0];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/courses", {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    };
    fetchCourses();
  }, [TOKEN]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const url = selectedCourse
          ? `http://localhost:3005/api/explainersection/${selectedCourse}`
          : "http://localhost:3005/api/explainersection/videos/feed";

        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${TOKEN}` },
        });

        if (!response.ok) throw new Error("API request failed");
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [TOKEN, selectedCourse]);

  const handleLike = async (videoId) => {
    try {
      const response = await fetch(`http://localhost:3005/api/explainersection/${videoId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to like video");

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.videoId === videoId
            ? { ...video, likes: [...video.likes, userId] }
            : video
        )
      );
    } catch (error) {
      console.error("Error liking video:", error.message);
    }
  };

  const filteredVideos = videos.filter((video) =>
    (selectedCourse === "" || video.courseName === selectedCourse) &&
    (searchQuery === "" || video.topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddButton = () => {
    navigate("/post-explainer-video");
  };

  const toggleViewMore = (courseName) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseName]: !prev[courseName],
    }));
  };

  if (loading) return <p>Loading videos...</p>;

  return (
    <div className="explainer-main-container">
      <Navbar />
      <div className="sidebar-and-content">

        <div className="explainer-content">
          <h1 className="section-header">Welcome to ExplainED!</h1>

          <div className="filter-and-search">
            <div className="filters">
              <h2><FaFilter /> Filter by Course</h2>
              <ul>
                <li 
                  className={selectedCourse === "" ? "active-filter" : ""}
                  onClick={() => setSelectedCourse("")}
                >
                  All Courses
                </li>
                {courses.map(course => (
                  <li
                    key={course.courseId}
                    className={selectedCourse === course.fullname ? "active-filter" : ""}
                    onClick={() => setSelectedCourse(course.fullname)}
                  >
                    {course.fullname}
                  </li>
                ))}
              </ul>
              <input 
                type="text" 
                placeholder="Search topics..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="add-video-btn" onClick={handleAddButton}>
                <FaPlus /> Add Video
              </button>
            </div>

            <div className="videos-display">
              {Object.entries(
                filteredVideos.reduce((acc, video) => {
                  (acc[video.courseName] = acc[video.courseName] || []).push(video);
                  return acc;
                }, {})
              ).map(([courseName, courseVideos]) => (
                <div key={courseName} className="course-section">
                  <h2 className="course-title">{courseName}</h2>

                  {expandedCourses[courseName] ? (
                    <div className="video-stack">
                      {courseVideos.map(video => (
                        <div key={video.videoId} className="video-card-modern">
                          <iframe
                            src={getEmbedVideoUrl(video.videoUrl)}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="video-embed"
                          ></iframe>
                          <h3 className="video-topic">{video.topic}</h3>
                          <div className="video-meta">
                            <div className="creator-info">
                              <img src={video.creator.profileimageurl} alt="creator" />
                              {video.creator.username}
                            </div>
                            <button 
                              onClick={() => handleLike(video.videoId)} 
                              className="like-btn"
                            >
                              👍 {video.likes.length}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="video-carousel">
                      {courseVideos.map(video => (
                        <div key={video.videoId} className="video-card-modern">
                          <iframe
                            src={getEmbedVideoUrl(video.videoUrl)}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="video-embed"
                          ></iframe>
                          <h3 className="video-topic">{video.topic}</h3>
                          <div className="video-meta">
                            <div className="creator-info">
                              <img src={video.creator.picture} alt="creator" />
                              {video.creator.username}
                            </div>
                            <button 
                              onClick={() => handleLike(video.videoId)} 
                              className="like-btn"
                            >
                              👍 {video.likes.length}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    className="view-more-btn"
                    onClick={() => toggleViewMore(courseName)}
                  >
                    <FaEye /> {expandedCourses[courseName] ? "Show Less" : "View More"}
                  </button>
                </div>
              ))}
            </div>

            <div className="right-sidebar">
              <h2>Extra Tools</h2>
              <p>Future widgets or suggested content can go here.</p>
              <SidebarSmall/>
              
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainerSection;