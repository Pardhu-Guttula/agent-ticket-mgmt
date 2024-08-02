import React from "react";
import userIcon from "../../assets/user.png"
import agentIcon from "../../assets/agent.jpg"

function ChatBubble({ message, isAgent }) {
  const icon = isAgent ? agentIcon : userIcon;

  return (
    <div className={`flex items-start my-2 ${isAgent ? "justify-end" : ""}`}>
      {!isAgent && (
        <div className="w-10 h-10 ml-1 mr-2 rounded-full overflow-hidden">
          <img src={icon} className="w-full h-full object-cover" alt="User Icon" />
        </div>
      )}
      <div className={`max-w-xs p-3 rounded-lg ${isAgent ? "bg-[#d5d8f2] text-black" : "bg-gray-300 text-black"}`} style={{ wordBreak: "break-word" }}>
        {message}
      </div>
      {isAgent && (
        <div className="w-10 h-10 ml-2 mr-1 rounded-full overflow-hidden">
          <img src={icon} className="w-full h-full object-cover" alt="Agent Icon" />
        </div>
      )}
    </div>
  );
}

export default ChatBubble;
