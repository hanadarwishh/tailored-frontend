import React, { useEffect, useState } from "react";
import "./ExplainerSection.css";
import { FaEye, FaThumbsUp } from 'react-icons/fa';
import Navbar from "../../NavBar/NavBar";
import LoadingScreen from "../LoadingScreen";
import { useNavigate } from "react-router-dom";

const LikedVideos = ({ userId }) => {
  const navigate = useNavigate();
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourses, setExpandedCourses] = useState({});

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const TOKEN = userData.token;

  const getEmbedVideoUrl = (url) => {
    const fileId = url.split("/d/")[1]?.split("/")[0];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await fetch(
          "http://localhost:3005/api/explainersection/videos/get/likes",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );
        if (!response.ok) throw new Error("Failed to fetch liked videos");
        const data = await response.json();
        setLikedVideos(data);
      } catch (error) {
        console.error("Error fetching liked videos:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, [TOKEN, userId]);

  const toggleViewMore = (courseName) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseName]: !prev[courseName],
    }));
  };

  if (loading) return <LoadingScreen title="Loading liked videos..." />;

  const groupedByCourse = likedVideos.reduce((acc, video) => {
    (acc[video.courseName] = acc[video.courseName] || []).push(video);
    return acc;
  }, {});

  return (
    <div className="explainer-main-container">
      <Navbar />
      <div className="sidebar-and-content">
        <div className="explainer-content">
          <h1 className="section-header">Liked Videos ❤️</h1>
          <div className="videos-display">
            {Object.entries(groupedByCourse).map(([courseName, videos]) => (
              <div key={courseName} className="course-section">
                <h2 className="course-title">{courseName}</h2>

                {expandedCourses[courseName] ? (
                  <div className="video-stack">
                    {videos.map((video) => (
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
                          <button className="like-btn">
                            👍 {video.likes.length}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="video-carousel">
                    {videos.map((video) => (
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
                          <button className="like-btn">
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
        </div>
      </div>
    </div>
  );
};

export default LikedVideos;
