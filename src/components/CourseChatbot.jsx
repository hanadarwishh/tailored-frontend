import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";  // Import useLocation
import "./ChatbotMulti.css";
import { FaRegHeart } from "react-icons/fa";
import { FiCopy, FiEdit, FiSend } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import chatbotImage from "./Assets/chatbot.png";

const userData = JSON.parse(localStorage.getItem("userData")) || {};
const TOKEN = userData.token;

const formatTime = (timestamp) => {
  const now = Date.now();
  const diffInMs = now - timestamp;
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  if (diffInHours < 48) return "Yesterday";

  const dateObj = new Date(timestamp);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return dateObj.toLocaleDateString(undefined, options);
};

const ChatMessage = ({ isUser, message, timestamp, question }) => {
  const userProfilePic = userData.userpictureurl || "https://via.placeholder.com/40";
  const botProfilePic = chatbotImage;

  return (
    <div className={`chatbot-chat-message ${isUser ? "user" : "bot"}`}>
      <img
        src={isUser ? userProfilePic : botProfilePic}
        alt={isUser ? "User" : "Bot"}
        className="chatbot-avatar"
      />
      <div className={`chatbot-message-bubble ${isUser ? "chatbot-user-bubble" : "chatbot-bot-bubble"}`}>
        {question ? (
          <p className="font-semibold">{message}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => <p {...props} />,
              strong: ({ node, ...props }) => <strong {...props} />,
              ul: ({ node, ...props }) => <ul {...props} />,
              ol: ({ node, ...props }) => <ol {...props} />,
              li: ({ node, ...props }) => <li {...props} />,
              code: ({ node, ...props }) => <code className="chatbot-inline-code" {...props} />,
              pre: ({ node, ...props }) => <pre className="chatbot-code-block" {...props} />,
            }}
          >
            {message}
          </ReactMarkdown>
        )}
        <div className="chatbot-meta">
          <span>{formatTime(timestamp)}</span>
          <div className="chatbot-actions">
            <button><FaRegHeart /></button>
            <button><FiCopy /></button>
            <button><FiEdit /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const location = useLocation(); 
  const { courseName, courseId } = location.state || {}; 

  const sendMessageToServer = async (message) => {
    try {
      const formData = new FormData();
      if (message) formData.append("query", message);
      if (courseName) formData.append("course_name", courseName);  
      if (courseId) formData.append("course_code", courseId);  

      const response = await axios.post(
        "http://localhost:3006/api/chatbot/course/chatbot/upload",
        formData,
        {
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      return { response: error.response?.data?.message || "Something went wrong." };
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return; 

    const timestamp = Date.now();

    const newMessage = {
      isUser: true,
      message: input,
      timestamp,
      question: true,
    };
    setMessages((prev) => [...prev, newMessage]);

    const botResponse = await sendMessageToServer(input);

    setMessages((prev) => [
      ...prev,
      {
        isUser: false,
        message: botResponse.response || "No response from chatbot.",
        timestamp: Date.now(),
      },
    ]);

    setInput(""); // Clear input after sending
  };

  return (
    <div className="chatbot-chat-container">
      <div className="chatbot-header">💬 AI Assistant</div>

      <div className="chatbot-messages">
        {messages.length === 0 ? (
          <div className="chatbot-empty-chat">Start a conversation!</div>
        ) : (
          messages.map((msg, i) => <ChatMessage key={i} {...msg} />)
        )}
      </div>

      <div className="chatbot-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage} className="chatbot-send-btn">
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
