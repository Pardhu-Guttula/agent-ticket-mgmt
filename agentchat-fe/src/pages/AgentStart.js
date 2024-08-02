import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/startLogo.jpg";

function AgentStart() {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#D5D8F2] to-[#666ee2] flex items-center justify-center">
      <div className="max-w-lg px-8 py-12 bg-white shadow-lg rounded-lg text-center transform transition duration-500 hover:scale-105">
  
        <div className="flex items-center justify-center mb-6">
          <div className="rounded-full bg-white p-3 shadow-md">
     
            <img
              src={logo}
              alt="Logo"
              className="rounded-full w-40 h-40 shadow-lg"
            />
          </div>
        </div>
 
        <h2 className="text-4xl font-bold text-[#666ee2] mb-4">
          Welcome to Agent Chatbot
        </h2>
        <p className="text-[#2f2f31] mb-8">
          This is your gateway to streamlined customer interactions and support
          management. Improve your efficiency with our advanced tools and
          features.
        </p>
  
        <button
          className="bg-[#666ee2] text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 transform hover:bg-[#4f54c4] hover:scale-105"
          onClick={handleButtonClick}
        >
          Click Here
        </button>
      </div>
    </div>
  );
}

export default AgentStart;
