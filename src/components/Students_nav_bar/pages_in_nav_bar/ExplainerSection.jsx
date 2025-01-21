import React, { useState } from 'react';
import './ExplainerSection.css';
import SidebarPage from '../Sidenav/Sidenav';

const ExplainerSection = () => {
    const [fileName, setFileName] = useState('No file chosen');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file ? file.name : 'No file chosen');
    };

    return (
        <div className='explainer-sidebar'>
                        <SidebarPage/>

        <div className="explainer-section-container">
            <h2 className="section-title">Add Your Explainer Video</h2>
            <form className="explainer-form">
                <div className="form-group">
                    <label htmlFor="course-name">Course Name:</label>
                    <input
                        type="text"
                        id="course-name"
                        name="courseName"
                        placeholder="Enter the course name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="topic">Topic:</label>
                    <input
                        type="text"
                        id="topic"
                        name="topic"
                        placeholder="Enter the topic"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="instructor">Approved By (Instructor):</label>
                    <input
                        type="text"
                        id="instructor"
                        name="instructor"
                        placeholder="Enter instructor's name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="video-upload">Upload Video:</label>
                    <div className="file-input-container">
                        <button
                            type="button"
                            className="custom-file-button"
                            onClick={() => document.getElementById('video-upload').click()}
                        >
                            Choose File
                        </button>
                        <input
                            type="file"
                            id="video-upload"
                            className="file-input"
                            name="videoUpload"
                            accept="video/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="file-name">{fileName}</div>
                </div>

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
        </div>
    );
};

export default ExplainerSection;
