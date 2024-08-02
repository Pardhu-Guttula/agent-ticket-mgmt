import React, { useState, useEffect } from "react";
import userIcon from "../../assets/user.png";

function AgentChatSidebar({ onSelectUser, users, selectedUser }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      const index = users.findIndex((user) => user.userId === selectedUser.userId);
      setSelectedCard(index);
      setUnreadMessages((prevUnreadMessages) => ({ //---->1
        ...prevUnreadMessages,
        [selectedUser.userId]: 0,
      }));
    }
  }, [selectedUser, users]);         //----->1

  const handleCardClick = (user, index) => {
    const newSelectedCard = selectedCard === index ? null : index;
    setSelectedCard(newSelectedCard);
    onSelectUser(user);
  };

  useEffect(() => {
    const handleMessageReceive = (data) => {
      if (!selectedUser || data.senderId !== selectedUser.userId) { //--->2
        setUnreadMessages((prevUnreadMessages) => ({
          ...prevUnreadMessages,
          [data.senderId]: (prevUnreadMessages[data.senderId] || 0) + 1,
        }));
      }
    };  //--->2

    // Ensure the socket is defined
    if (window.socket) {
      window.socket.on("getMessage", handleMessageReceive);
    }

    return () => {
      if (window.socket) {
        window.socket.off("getMessage", handleMessageReceive);
      }
    };
  }, [selectedUser]);   //---->3

  const sortedUsers = users.slice().sort((a, b) => {
    const unreadA = unreadMessages[a.userId] || 0;
    const unreadB = unreadMessages[b.userId] || 0;
    return unreadB - unreadA;
  }); // ---->3

  return (
    <div className="h-full shadow-custom rounded mr-1">
    <div className="overflow-hidden">
      <p className="text-3xl font-bold font-noto-sans text-textsecondarycolor p-3">
        Chats
      </p>
    </div>

    {sortedUsers.length === 0 ? (
      <div className="p-4 bg-red-100 text-red-600 rounded-md">
        <p>No active cases, please accept cases to solve</p>
      </div>
    ) : (
      sortedUsers.map((user, index) => (
        <div
          key={index}
          className={`flex items-center p-2 m-1 mx-2 my-3 rounded cursor-pointer ${
            selectedCard === index ? "bg-[#d5d8f2]" : "hover:bg-[#d5d8f2]"
          }`}
          onClick={() => handleCardClick(user)}
        >
          <div className="w-12 h-12 ml-1 mr-2 rounded-full overflow-hidden">
            <img
              src={userIcon}
              className="w-full h-full object-cover"
              alt="User Icon"
            />
          </div>
          <div>
            <p
              className={`text-base ${
                unreadMessages[user.userId] ? "font-bold" : "font-sm"
              }`}
            >
              {user.userName}
              {unreadMessages[user.userId] > 0 && (
                <span className="ml-2 text-xs bg-[#526bcc] text-white rounded-full px-2 py-0.5">
                  {unreadMessages[user.userId]}
                </span>
              )}
            </p>
          </div>
        </div>
      ))
    )}
  </div>
  );
}

export default AgentChatSidebar;
 