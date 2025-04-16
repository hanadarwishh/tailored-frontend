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
import MyProfile from "./components/Students_nav_bar/pages_in_nav_bar/ExplainerSection/MyProfile.jsx";
import MultiChatbot from "./components/ChatbotMulti.jsx";
import CourseChatbot from "./components/CourseChatbot.jsx";
import CourseSummarize from "./components/CourseSummarize.jsx";
import Instructor from "./components/pages/instructor/Dashboard/InstructorDashboard.jsx";
import InstructorCourses from "./components/pages/instructor/Courses/Courses.jsx";
import InstructorCourseDetails from "./components/pages/instructor/CourseDetails/CourseDetails.jsx";
import AddLecturePage from "./components/pages/instructor/AddLecture/AddLecture.jsx";
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
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/multi-purpose-chatbot" element={<MultiChatbot />} />
        <Route path="/course-chatbot" element={<CourseChatbot />} />
        <Route path="/lecture-summarize" element={<CourseSummarize />} />
        <Route path="/instructor" element={<Instructor />} />
        <Route path="/instructor-courses" element={<InstructorCourses />} />
        <Route
          path="/course-details-instructor"
          element={<InstructorCourseDetails />}
        />
        <Route
          path="/course-details-instructor/:id"
          element={<InstructorCourseDetails />}
        />
        <Route path="/add-lecture" element={<AddLecturePage />} />
      </Routes>
    </Router>
  );
}

export default App;
