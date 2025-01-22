import React, { useEffect, useState } from "react";
import "./ExplainerSection.css";
import { 
  FaThumbsUp, 
  FaUser, 
  FaVideo, 
  FaRegClock, 
  FaBook, 
  FaFilter, 
  FaPlus 
} from 'react-icons/fa';
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
  
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const TOKEN = userData.token;

  // Helper function to format Google Drive video URL
  const getEmbedVideoUrl = (url) => {
    const fileId = url.split("/d/")[1]?.split("/")[0];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  // Fetch list of courses
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

  // Fetch videos based on selected course or initial feed
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

  // Handle video like action
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

  // Filter videos based on course and search query
  const filteredVideos = videos.filter((video) =>
    (selectedCourse === "" || video.courseName === selectedCourse) &&
    (searchQuery === "" || video.topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const handleAddButton = () => {
    navigate("/post-explainer-video")
  }

  if (loading) return <p>Loading videos...</p>;

  return (
    <div className="sidenavbar-small-exp">
      <Navbar />
      <div className="small-exp">
        <SidebarSmall />
        <div className="explainer-section">
          <h1>Explainer Section</h1>
          <div className="content-container">
            <div className="filter-column">
              <h2 className="filter-title">
                <FaFilter /> Filters
              </h2>
              <div className="filter-group">
                <h3>Courses</h3>
                <ul className="filter-list">
                  <li
                    className={selectedCourse === "" ? "active-filter" : ""}
                    onClick={() => setSelectedCourse("")}
                  >
                    All Courses
                  </li>
                  {courses.map((course) => (
                    <li
                      key={course.courseId}
                      className={selectedCourse === course.fullname ? "active-filter" : ""}
                      onClick={() => setSelectedCourse(course.fullname)}
                    >
                      {course.fullname}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="filter-group">
                <h3>Search</h3>
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="filter-search"
                />
              </div>
              <button onClick={handleAddButton} className="add-video-button">
                <FaPlus /> Add Video
              </button>
            </div>
            <div className="videos-container">
              {filteredVideos.map((video) => (
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
                    <div className="creator-info">
                      <img
                        src={video.creator.profileimageurl || "https://via.placeholder.com/50"}
                        alt="Creator"
                        className="creator-profile-img"
                      />
                      <div className="creator-details">
                        <h3>{video.creator.username}</h3>
                        <p className="creator-role">Creator</p>
                      </div>
                    </div>
                    <div className="video-stats">
                      <div className="stat-item">
                        <FaVideo /> <span>{video.topic}</span>
                      </div>
                      <div className="stat-item">
                        <FaBook /> <span>{video.courseName}</span>
                      </div>
                      <div className="stat-item">
                        <FaRegClock /> <span>{video.createdAt}</span>
                      </div>
                      <div className="stat-item">
                        <FaThumbsUp /> <span>{video.likes.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="video-actions">
                    <button onClick={() => handleLike(video.videoId)} className="like-button">
                      👍 Like
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainerSection;
