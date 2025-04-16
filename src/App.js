import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import StudentDashboard from "./components/Student/Dashboard/StudentDashboard.jsx";
import GPA from "./components/Student/GPACalculator/GPA.jsx";
import Courses from "./components/Student/Courses/CoursesPreview/CoursesPreview.jsx";
import CourseDetails from "./components/Student/Courses/CourseDetails/CourseDetails.jsx";
import ExplainerSection from "./components/Student/ExplainerSection/ViewExplainerSection/ExplainerSection.jsx";
import PostExplainerVideo from "./components/Student/ExplainerSection/PostExplainerVideos/PostExplainerVideo.jsx";
import ProgressTracker from "./components/Student/ProgressTracker/ProgressTracker.jsx";
import DiscussionForum from "./components/Student/Courses/CourseDetails/DiscussionForum/DiscussionForum.jsx";
import DiscussionTopic from "./components/Student/Courses/CourseDetails/DiscussionForum/DiscussionTopic.jsx";
import MyProfile from "./components/Student/Profile/MyProfile.jsx";
import MultiChatbot from "./components/Chatbot/MultiPurposeChatbot/ChatbotMulti.jsx";
import CourseChatbot from "./components/Chatbot/MultiPurposeChatbot/ChatbotMulti.jsx";
import CourseSummarize from "./components/Student/Courses/CourseDetails/LectureSummarization/CourseSummarize.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/gpa" element={<GPA />} />
        <Route path="/Courses" element={<Courses />} />
        <Route path="/course-details/:id" element={<CourseDetails />} />
        <Route path="/discussion-forum" element={<DiscussionForum />} />
        <Route path="/discussion-topic" element={<DiscussionTopic />} />
        <Route path="/lecture-summarize" element={<CourseSummarize />} />

        <Route path="/explainer-section" element={<ExplainerSection />} />
        <Route path="/post-explainer-video" element={<PostExplainerVideo />} />
        <Route path="/progress-tracker" element={<ProgressTracker />} />
        <Route path="/my-profile" element={<MyProfile />} />

        <Route path="/multi-purpose-chatbot" element={<MultiChatbot />} />
        <Route path="/course-chatbot" element={<CourseChatbot />} />


      </Routes>
    </Router>
  );
}

export default App;
