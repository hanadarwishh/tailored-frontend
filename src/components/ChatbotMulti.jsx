import React, { useState } from "react";
import axios from "axios";
import "./ChatbotMulti.css";
import { FaRegHeart } from "react-icons/fa";
import { FiCopy, FiEdit, FiUpload, FiPlus } from "react-icons/fi";

const userData = JSON.parse(localStorage.getItem("userData")) || {};
const TOKEN = userData.token;

const ChatMessage = ({ isUser, message, time, question }) => {
  const userProfilePic = userData.userpictureurl || "https://via.placeholder.com/40";

  return (
    <div className={`chatbot flex ${isUser ? "justify-end" : "justify-start"} mb-4 items-center`}>
      <div className={`p-4 rounded-lg max-w-md ${isUser ? "bg-red-100 text-black" : "bg-gray-100 text-black"}`}>
        {question ? <p className="font-semibold">{message}</p> : <p>{message}</p>}
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>{time} ago</span>
          <div className="flex space-x-2">
            <button className="hover:text-black">
              <FaRegHeart />
            </button>
            <button className="hover:text-black">
              <FiCopy />
            </button>
            <button className="hover:text-black">
              <FiEdit />
            </button>
          </div>
        </div>
      </div>
      {isUser && <img src={userProfilePic} alt="User" className="w-10 h-10 rounded-full ml-3" />}
    </div>
  );
};

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  const sendMessageToServer = async (message, uploadedFile = null) => {
    try {
      const formData = new FormData();
      if (message) formData.append("query", message);
      if (uploadedFile) formData.append("file", uploadedFile);
      console.log(uploadedFile)
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await axios.post("http://localhost:3006/api/chatbot/upload", formData, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "multipart/form-data", // Ensure correct format

        },
      });

      return response.data; 
    } catch (error) {
      console.error("Error sending message:", error);
      return { reply: error.response?.data?.message || "Something went wrong. Please try again." };
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !file) return;

    const newMessage = {
      isUser: true,
      message: input || "File sent",
      time: "Just now",
      question: true,
    };
    setMessages([...messages, newMessage]);

    // Send to backend
    const botResponse = await sendMessageToServer(input, file);

    // Update chat with bot response
    setMessages((prev) => [
      ...prev,
      { isUser: false, message: botResponse.reply || "No response from chatbot.", time: "Just now" },
    ]);

    // Reset input
    setInput("");
    setFile(null);
  };

  return (
    <div className="chatbot bg-white min-h-screen p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Design Thinking</h2>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">Start Chatting!</div>
        ) : (
          messages.map((msg, index) => <ChatMessage key={index} {...msg} />)
        )}
      </div>

      {/* Input Area */}
      <div className="chatbot flex items-center mt-6">
        <label htmlFor="file-upload" className="flex items-center px-4 py-2 bg-black text-white rounded-lg cursor-pointer">
          <FiUpload className="mr-2" /> Upload File
        </label>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          type="text"
          placeholder="Ask Me anything ...."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="ml-4 flex-1 p-3 border rounded-lg"
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        
        <button onClick={handleSendMessage} className="ml-3 bg-black text-white p-3 rounded-lg">
          <FiPlus />
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
