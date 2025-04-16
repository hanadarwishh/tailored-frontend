import React, { useState } from "react";
import axios from "axios";
import "./AddLecture.css"
const AddLecturePage = ({ sectionId }) => {
  const [lectureName, setLectureName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lectureName || !file) {
      alert("Lecture name and file are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", lectureName);
    formData.append("description", description);
    formData.append("sectionId", sectionId);

    setLoading(true);
    try {
      await axios.post("http://localhost:3010/api/add-lecture", formData);
      alert("Lecture uploaded successfully!");
      setLectureName("");
      setDescription("");
      setFile(null);
    } catch (err) {
      alert("Error uploading lecture.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-lecture-container">
      <h1>Add New Lecture</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Lecture Name <span className="required">*</span>
          </label>
          <input
            type="text"
            value={lectureName}
            onChange={(e) => setLectureName(e.target.value)}
            placeholder="Enter lecture name"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <div
          className="file-drop-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p>{file ? file.name : "Drag & drop a PDF file here, or click below"}</p>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Add Lecture"}
        </button>
      </form>
    </div>
  );
};

export default AddLecturePage;
