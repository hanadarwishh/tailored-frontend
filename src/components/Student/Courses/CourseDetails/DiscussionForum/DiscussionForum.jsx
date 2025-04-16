import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlusCircle, FaComments } from "react-icons/fa";
import "./DiscussionForum.css";

const DiscussionForum = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const forumId = location.state?.forumId;
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const TOKEN = userData.token;

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`http://localhost:3008/api/discussion/topics/${forumId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch discussion topics");
        }

        const data = await response.json();
        setTopics(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [forumId, TOKEN]);

  if (loading) {
    return <p className="loading">Loading discussion topics...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }
  const handleTopicClick = (topicId) => {
    navigate("/discussion-topic", { state: { topicId } });
  };


  return (
    <div className="discussion-forum">
      <div className="forum-header">
        <h2>
          <FaComments className="forum-icon" /> Discussion Forum
        </h2>
        <button className="add-topic-btn">
          <FaPlusCircle /> Add Topic
        </button>
      </div>

      <div className="topics-container">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <div 
            key={topic.id} 
            className="topic-card"
            onClick={() => handleTopicClick(topic.id)}
          >
              <h3>{topic.name}</h3>
              <p className="topic-message">{topic.message}</p>
            </div>
          ))
        ) : (
          <p className="no-topics">No discussion topics available.</p>
        )}
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default DiscussionForum;
