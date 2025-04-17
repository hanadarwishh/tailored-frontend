import React, { useEffect, useState } from "react";
import "./InstructExpSec.css";
import {
  FaEye, FaThumbsUp, FaUser, FaVideo,
  FaRegClock, FaTachometerAlt, FaCheckCircle,
  FaTimesCircle, FaFilter
} from 'react-icons/fa';
import Navbar from "../../../NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../../Students_nav_bar/LoadingScreen";

const ReviewExplainerPage = () => {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourses, setExpandedCourses] = useState({});

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const TOKEN = userData.token;

  const getEmbedVideoUrl = (url) => {
    const fileId = url.split("/d/")[1]?.split("/")[0];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  useEffect(() => {
    const fetchUnapprovedVideos = async () => {
      try {
        const response = await fetch("http://localhost:3005/api/explainersection/videos/not/approved", {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        if (!response.ok) throw new Error("Failed to fetch videos");
        const data = await response.json();
        console.log(data);
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUnapprovedVideos();
  }, [TOKEN]);

  const handleApprove = async (videoId) => {
    try {
      const response = await fetch(`http://localhost:3005/api/explainersection/videos/approve/${videoId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Approval failed");

      setVideos((prev) => prev.filter(video => video.videoId !== videoId));
    } catch (error) {
      console.error("Error approving video:", error.message);
    }
  };

  const handleDisapprove = (videoId) => {
    setVideos((prev) => prev.filter(video => video.videoId !== videoId));
    // You can later implement an actual API call for disapproval if needed
  };

  const toggleViewMore = (courseName) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseName]: !prev[courseName],
    }));
  };

  if (loading) return <LoadingScreen title="Loading videos for review..." />;

  return (
    <div className="explainer-main-container">
      <Navbar />
      <div className="sidebar-and-content">
        <div className="explainer-content">
          <h1 className="section-header">Review Pending Videos</h1>

          <div className="filter-and-search">
            <div className="videos-display">
              {Object.entries(
                videos.reduce((acc, video) => {
                  (acc[video.courseName] = acc[video.courseName] || []).push(video);
                  return acc;
                }, {})
              ).map(([courseName, courseVideos]) => (
                <div key={courseName} className="course-section">
                  <h2 className="course-title">{courseName}</h2>

                  {(expandedCourses[courseName] ? courseVideos : courseVideos.slice(0, 3)).map(video => (
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
                        <div className="review-buttons">
                          <button className="approve-btn" onClick={() => handleApprove(video.videoId)}>
                            <FaCheckCircle /> Approve
                          </button>
                          <button className="disapprove-btn" onClick={() => handleDisapprove(video.videoId)}>
                            <FaTimesCircle /> Disapprove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {courseVideos.length > 3 && (
                    <button
                      className="view-more-btn"
                      onClick={() => toggleViewMore(courseName)}
                    >
                      <FaEye /> {expandedCourses[courseName] ? "Show Less" : "View More"}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="right-sidebar">
              <h2>Extra Tools</h2>
              <ul className="tool-list">
                <li className="tool-item" onClick={() => navigate("/instructor")}>
                  <FaTachometerAlt className="tool-icon" />
                  <span>Back to Dashboard</span>
                </li>
                <li className="tool-item" onClick={() => navigate("/instructor-explained")}>
                  <FaVideo className="tool-icon" />
                  <span>My Feed</span>
                </li>
                <li className="tool-item">
                  <FaThumbsUp className="tool-icon" />
                  <span>Liked Videos</span>
                </li>
                <li className="tool-item active">
                  <FaRegClock className="tool-icon" />
                  <span>Review & Approve</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewExplainerPage;
