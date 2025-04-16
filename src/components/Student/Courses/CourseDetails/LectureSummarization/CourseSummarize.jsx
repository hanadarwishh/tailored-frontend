import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './CourseSummarize.css';

export default function SummaryArticle() {
  const location = useLocation();
  const selectedLectureFromLocation = location.state?.selectedLecture;
  const allLectures = location.state?.allLectures || [];
  const course_name = location.state?.courseName;
  const TOKEN = JSON.parse(localStorage.getItem('userData'))?.token;  

  const [selectedLecture, setSelectedLecture] = useState(selectedLectureFromLocation);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const otherLectures = allLectures.filter((lecture) => lecture.fileurl !== selectedLecture?.fileurl);

  const fetchSummary = async (lecture) => {
    if (!lecture?.fileurl) return;

    setLoading(true);
    setError('');

    try {
      const fileUrlWithToken = `${lecture.fileurl}&token=${TOKEN}`;

      const responseFromUrl = await fetch(fileUrlWithToken);
      const blob = await responseFromUrl.blob();
      const fileName = lecture.filename || "uploaded-file.pdf";
      const file = new File([blob], fileName, { type: blob.type });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("course_name", course_name);

      const response = await fetch("http://localhost:3008/api/course/summarize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to summarize lecture.");
      }

      const data = await response.json();
      setSummary(data.summary || "No summary returned.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLecture) {
      fetchSummary(selectedLecture);
    }
  }, [selectedLecture, TOKEN, course_name]);

  const handleLectureSelect = (lecture) => {
    setSelectedLecture(lecture); 
  };

  // Format summary text with proper styling
  const formatSummary = (summaryText) => {
    const sections = summaryText.split(/\d+\./); // Split by numbers followed by a period
    const formattedSections = sections.map((section, index) => {
      if (index === 0 || section.trim() === '') return ''; // Skip first part and empty sections

      const [mainTopic, ...rest] = section.split('\n').filter(Boolean);
      return (
        <div key={index} className="summary-section">
          <h3 className="summary-section-title"><strong>{mainTopic.trim()}</strong></h3>
          <div className="summary-section-text">
            {rest.map((line, idx) => (
              <p key={idx} className={line.startsWith('-') ? 'summary-bullet' : 'summary-text'}>
                {line}
              </p>
            ))}
          </div>
        </div>
      );
    });

    return formattedSections;
  };

  return (
    <div className="summary-container">
      <h1 className="summary-title">Summary Article</h1>
      <p className="summary-subtitle">Explore content more deeply and effectively.</p>

      <div className="summary-grid">
        {/* History Panel */}
        <div className="history-panel">
          <div className="history-header">
            <h2 className="history-title">
              History <span className="summary-count">{allLectures.length} summaries</span>
            </h2>
          </div>

          <div className="history-section">
            <div className="history-day">Current</div>
            <div className="history-items">
              <div className="history-item selected">
                <div className="history-icon">📄</div>
                <div className="history-text">
                  <div className="history-item-title">{selectedLecture?.filename}</div>
                  <div className="history-item-site">Now</div>
                </div>
              </div>
            </div>

            {otherLectures.length > 0 && (
              <>
                <div className="history-day">Others</div>
                <div className="history-items">
                  {otherLectures.map((lecture, index) => (
                    <div 
                      className="history-item" 
                      key={index} 
                      onClick={() => handleLectureSelect(lecture)}  // On click, update selected lecture
                    >
                      <div className="history-icon">📄</div>
                      <div className="history-text">
                        <div className="history-item-title">{lecture.filename}</div>
                        <div className="history-item-site">File</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Summary Panel */}
        <div className="scope-panel">
          <h2 className="scope-title">Summary</h2>

          {loading ? (
            <p className="scope-text">Loading summary...</p>
          ) : error ? (
            <p className="scope-text error-text">⚠️ {error}</p>
          ) : (
            <div className="scope-text">
              {formatSummary(summary)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
