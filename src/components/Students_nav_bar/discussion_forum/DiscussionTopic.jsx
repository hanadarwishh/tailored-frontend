import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaUser, FaReply, FaCommentDots, FaPlus, FaTimes, FaPaperPlane } from "react-icons/fa";
import "./DiscussionTopic.css";

const DiscussionTopic = () => {
  const location = useLocation();
  const topicId = location.state?.topicId;
  const postId= topicId;
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const TOKEN = userData.token;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    console.log(topicId);
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3008/api/discussion/posts/${topicId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch discussion posts");
        }

        const data = await response.json();
        console.log("Fetched Posts:", data);
        setPosts(data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchPosts();
    }
  }, [topicId]);

  // Function to handle adding a reply
  const handleSendReply = async () => {
    if (!replySubject || !replyMessage) {
      alert("Please enter both subject and message.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3008/api/discussion/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          subject: replySubject,
          message: replyMessage,
          postid: postId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reply");
      }

      const responseData = await response.json();
      console.log("Reply sent:", responseData);

      // Close modal and clear input fields
      setShowReplyModal(false);
      setReplySubject("");
      setReplyMessage("");

      // Refresh the posts list after sending the reply
      setPosts([...posts, responseData]);
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  return (
    <div className="discussion-topic">
      <h2><FaCommentDots /> Discussion Topic</h2>

      {loading && <p>Loading posts...</p>}
      {error && <p className="error">{error}</p>}

      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img
                  src={post.author?.urls?.profileimage || "/default-avatar.png"}
                  alt="Author"
                  className="author-image"
                />
                <div>
                  <h3 className="author-name"><FaUser /> {post.author?.fullname}</h3>
                  <p className="post-subject">{post.replysubject}</p>
                </div>
              </div>
              <p className="post-message">{post.message}</p>

              {/* Display Replies */}
              {post.replies && post.replies.length > 0 && (
                <div className="replies-section">
                  <h4><FaReply /> Replies:</h4>
                  {post.replies.map((reply, index) => (
                    <div key={index} className="reply-card">
                      <p className="reply-subject"><strong>{reply.replySubject}</strong></p>
                      <p className="reply-message">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="empty-discussion">No one has posted yet. Be the first to reply!</p>
        )}
      </div>

      {/* Floating + Button to Open Reply Modal */}
      <button className="add-reply-btn" onClick={() => setShowReplyModal(true)}>
        <FaPlus />
      </button>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="reply-modal">
          <div className="reply-modal-content">
            <button className="close-modal-btn" onClick={() => setShowReplyModal(false)}>
              <FaTimes />
            </button>
            <h3><FaReply /> Add Reply</h3>
            <input
              type="text"
              placeholder="Enter Subject"
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
            />
            <textarea
              placeholder="Enter Message"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows="4"
            ></textarea>
            <button className="send-reply-btn" onClick={handleSendReply}>
              <FaPaperPlane /> Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionTopic;
