import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ title}) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
        <h2 className="loading-text">{title}</h2>
      </div>
    </div>
  );
};

export default LoadingScreen;