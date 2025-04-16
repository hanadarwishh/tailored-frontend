import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./MyProfile.css";
import Navbar from "../NavBar/NavBar";
import SidebarPage from "../Students_nav_bar/Sidenav/Sidenav";
import LoadingScreen from "../Students_nav_bar/LoadingScreen";

const MyProfile = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const TOKEN = userData.token;

  // Fetch user's posted videos
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

  // Helper function to format Google Drive video URL
  const getEmbedVideoUrl = (url) => {
    const fileId = url.split("/d/")[1]?.split("/")[0];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  // Handle video deletion
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

      setVideos((prevVideos) => prevVideos.filter((video) => video.videoId !== videoId));
    } catch (error) {
      console.error("Error deleting video:", error.message);
    }
  };

  // Navigate to edit page
  const handleEdit = (videoId) => {
    navigate(`/edit-video/${videoId}`);
  };

  if (loading) return <LoadingScreen title="Loading your Videos" />;

  return (
    <div className="sidenavbar-small-profile">
      <Navbar />
      <div className="small-profile">
        <SidebarPage />
        <div className="profile-section">
          <h1>My Profile - My Videos</h1>
          <div className="videos-container">
            {videos.length === 0 ? (
              <p>You haven't posted any videos yet.</p>
            ) : (
              videos.map((video) => (
                <div key={video.videoId} className="video-card">
                  <div className="video-container">
                    <iframe
                      src={getEmbedVideoUrl(video.videoUrl)}
                      width="640"
                      height="360"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="video-info">
                    <h3>{video.topic}</h3>
                    <p className="video-course">{video.courseName}</p>
                    <div className="video-actions">
                      <button className="edit-button" onClick={() => handleEdit(video.videoId)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(video.videoId)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;