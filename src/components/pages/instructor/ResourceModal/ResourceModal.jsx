import React, { useState } from "react";
import Modal from "react-modal";
import { FaFileAlt, FaLink, FaRegFilePdf, FaVideo, FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // To navigate to another page
import "./ResourceModal.css"; // Custom styles for your modal

Modal.setAppElement("#root");

const AddResourceModal = ({ sectionId }) => {
    console.log(sectionId)
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // For navigation

  const toggleModal = () => setIsOpen(!isOpen);

  const handleOptionClick = (type) => {
    console.log("Selected resource type:", type);

    if (type === "file") {
      navigate("/add-lecture", { state: { sectionId } });
    }

    setIsOpen(false);
  };

  return (
    <div className="add-resource-wrapper">
      <button className="toggle-add-btn" onClick={toggleModal}>
        <FaPlusCircle /> {isOpen ? "Close" : "Add Resource"}
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        className="resource-modal-content"
        overlayClassName="resource-modal-overlay"
      >
        <h2 className="modal-title">Add a New Resource</h2>
        <div className="resource-options">
          <div className="resource-option" onClick={() => handleOptionClick("file")}>
            <FaRegFilePdf className="resource-icon pdf" />
            <p>Upload File</p>
          </div>
          <div className="resource-option" onClick={() => handleOptionClick("url")}>
            <FaLink className="resource-icon link" />
            <p>Add URL</p>
          </div>
          <div className="resource-option" onClick={() => handleOptionClick("text")}>
            <FaFileAlt className="resource-icon text" />
            <p>Add Page</p>
          </div>
          <div className="resource-option" onClick={() => handleOptionClick("video")}>
            <FaVideo className="resource-icon video" />
            <p>Embed Video</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddResourceModal;
