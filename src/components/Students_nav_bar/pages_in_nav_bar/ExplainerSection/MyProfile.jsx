import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaTachometerAlt,
  FaVideo,
  FaRegClock,
  FaThumbsUp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./MyProfile.css";
import Navbar from "../../../NavBar/NavBar";
import LoadingScreen from "../../LoadingScreen";

const MyProfile = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const TOKEN = userData.token;

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const response = await fetch(
          "http://localhost:3005/api/explainersection/videos/user/posts",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch videos");

        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching user videos:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserVideos();
  }, [TOKEN]);

  const getEmbedVideoUrl = (url) => {
    const fileId = url.split("/d/")[1]?.split("/")[0];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const response = await fetch(
        `http://localhost:3005/api/explainersection/videos/${videoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete video");

      setVideos((prevVideos) =>
        prevVideos.filter((video) => video.videoId !== videoId)
      );
    } catch (error) {
      console.error("Error deleting video:", error.message);
    }
  };

  const handleEdit = (videoId) => {
    navigate(`/edit-video/${videoId}`);
  };

  if (loading) return <LoadingScreen title="Loading your Videos" />;

  return (
    <div className="my-profile-explainer-main-container">
      <Navbar />
      <div className="my-profile-sidebar-and-content">
        {/* Main Content */}
        <div className="my-profile-explainer-content">
          <h1 className="my-profile-section-header">My Profile - My Videos</h1>
          <div className="my-profile-videos-display">
            {videos.length === 0 ? (
              <p>You haven't posted any videos yet.</p>
            ) : (
              videos.map((video) => (
                <div key={video.videoId} className="my-profile-video-card-modern">
                  <iframe
                    src={getEmbedVideoUrl(video.videoUrl)}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="my-profile-video-embed"
                  ></iframe>
                  <h3 className="my-profile-video-topic">{video.topic}</h3>
                  <p className="my-profile-video-course">{video.courseName}</p>
                  <div className="my-profile-video-actions">
                    <button
                      className="my-profile-edit-button"
                      onClick={() => handleEdit(video.videoId)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="my-profile-delete-button"
                      onClick={() => handleDelete(video.videoId)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="my-profile-right-sidebar">
          <h2>Extra Tools</h2>
          <ul className="my-profile-tool-list">
            <li className="my-profile-tool-item" onClick={() => navigate("/student")}>
              <FaTachometerAlt className="my-profile-tool-icon" />
              <span>Back to Dashboard</span>
            </li>
            <li className="my-profile-tool-item" onClick={() => navigate("/my-profile")}>
              <FaVideo className="my-profile-tool-icon" />
              <span>My Videos</span>
            </li>
            <li className="my-profile-tool-item" onClick={() => navigate("/liked-videos")}>
              <FaThumbsUp className="my-profile-tool-icon" />
              <span>Liked Videos</span>
            </li>
            <li className="my-profile-tool-item">
              <FaRegClock className="my-profile-tool-icon" />
              <span>Under Review</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
