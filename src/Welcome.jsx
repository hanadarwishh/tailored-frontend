import React from "react";
import './Welcome.css';


const Welcome = () => {
  return (
    <div className="Welcome">
      
      Welcome to Tailored!
      <div><img src={require('./tailored logo.png')} alt="Welcome" className="welcome-image" /> </div>
    </div>
  );
};


export default Welcome;
