import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AgentChatSidebar from "../AgentChat/AgentChatSidebar";
import AgentChat from "../AgentChat/AgentChat";

function AgentChatContainer() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const location = useLocation();
  const users = location.state?.users || [];


  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };

  const handleBackToSidebar = () => {
    setIsSidebarVisible(true);
  };

  useEffect(() => {
    if (users.length > 0 && (!selectedUser || !users.includes(selectedUser))) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);


  const hasActiveCases = users.length > 0;

  return (
    <div className="flex bg-[#e9ecef] h-screen p-2">
      {hasActiveCases ? (
        <>
          <div
            className={`md:block ${isSidebarVisible ? "block" : "hidden"} w-full bg-white md:w-1/4`}
          >
            <AgentChatSidebar
              onSelectUser={handleUserSelect}
              users={users}
              selectedUser={selectedUser}
            />
          </div>

          {selectedUser !== null && (
            <div
              className={`md:block ${!isSidebarVisible ? "block" : "hidden"} w-full md:w-3/4`}
            >
              <AgentChat selectedUser={selectedUser} onBack={handleBackToSidebar} />
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center w-full h-full p-4">
          <p className="text-lg p-4 bg-red-100 text-red-600 rounded-md">
            No active cases <br /> Please accept cases to solve.
          </p>
        </div>
      )}
    </div>
  );
}

export default AgentChatContainer;
 