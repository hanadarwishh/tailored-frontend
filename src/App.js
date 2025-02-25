import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import Welcome from "./components/pages/Welcome.jsx";
import Student from "./components/pages/Student.jsx";
import GPA from "./components/Students_nav_bar/GPA.jsx";
import Courses from "./components/Students_nav_bar/Courses.jsx";
import QuizPage from "./components/Students_nav_bar/pages_in_nav_bar/QuizPage.jsx";
import ExplainerSection from "./components/Students_nav_bar/pages_in_nav_bar/ExplainerSection.jsx";
import ProgressTracker from "./components/Students_nav_bar/pages_in_nav_bar/ProgressTracker.jsx";
import CourseDetails from "./components/Students_nav_bar/CourseDetails.jsx";
import PostExplainerVideo from "./components/Students_nav_bar/pages_in_nav_bar/PostExplainerVideo.jsx";
import DiscussionForum from "./components/Students_nav_bar/discussion_forum/DiscussionForum.jsx";
import DiscussionTopic from "./components/Students_nav_bar/discussion_forum/DiscussionTopic.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Welcome" element={<Welcome />} />
        <Route path="/student" element={<Student />} />
        <Route path="/gpa" element={<GPA />} />
        <Route path="/Courses" element={<Courses />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/explainer-section" element={<ExplainerSection />} />
        <Route path="/progress-tracker" element={<ProgressTracker />} />
        <Route path="/course-details" element={<CourseDetails />} />
        <Route path="/course-details/:id" element={<CourseDetails />} />
        <Route path="/post-explainer-video" element={<PostExplainerVideo />} />
        <Route path="/discussion-forum" element={<DiscussionForum />} />
        <Route path="/discussion-topic" element={<DiscussionTopic />} />
      </Routes>
    </Router>
  );
}

export default App;
