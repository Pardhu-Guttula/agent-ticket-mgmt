import React, { useState, useEffect, useRef, useContext } from "react";
import { IoMdSend, IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import userIcon from "../../assets/user.png";
import ChatBubble from "../AgentChat/ChatBubble";
import { io } from "socket.io-client";
import CloseTicketModal from "../../components/CloseTicketModal";
import { AuthContext } from "../../AuthContext";
import { FaRegCopy, FaCheck } from "react-icons/fa";

function AgentChat({ selectedUser, onBack }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const msgEnd = useRef(null);
  const socket = useRef();
  const { authState } = useContext(AuthContext);
  const [ticketUrl, setTicketUrl] = useState("");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [uniqueTicketId, setUniqueTicketId] = useState("");
  const agentId = authState.agentId;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cases?caseType=Accepted`
      );
      setCards(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketUrl = async (uniqueCaseId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cases/ticketId/${uniqueCaseId}`
      );
      setUniqueTicketId(response.data.uniqueTicketId);
    } catch (error) {
      console.error("Error fetching ticket URL:", error.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(uniqueTicketId).then(
      () => {
        console.log("Unique ticket ID copied to clipboard");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Revert back after 2 seconds
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  const createTicketUrl = async (uniqueCaseId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cases/create-ticket`,
        { uniqueCaseId, agentId }
      );
      const { ticketUrl } = response.data;
      console.log(
        "Case status updated and ticket URL fetched successfully:",
        ticketUrl
      );
      fetchData();
    } catch (error) {
      console.error(
        "Error updating case status or fetching ticket URL:",
        error.message
      );
    }
  };

  const handleEscalatedCase = async (uniqueCaseId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/chat/escalate/${uniqueCaseId}`
      );
      console.log("Case status updated successfully");
      createTicketUrl(uniqueCaseId);
      setTimeout(() => fetchTicketUrl(uniqueCaseId),10);
    } catch (error) { 
      console.error("Error updating case status:", error.message);
    }
    fetchData();
  };

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (!window.socket) {
      window.socket = io("ws://localhost:5000");
      socket.current = window.socket;
    } else {
      socket.current = window.socket;
    }

    if (socket.current) {
      socket.current.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
        });
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("getMessage");
      }
    };
  }, []);

  useEffect(() => {
    if (arrivalMessage && arrivalMessage.sender === selectedUser.userId) {
      setMessages((prev) => [
        ...prev,
        { message: arrivalMessage.text, senderType: "User" },
      ]);
    }
  }, [arrivalMessage, selectedUser]);

  useEffect(() => {
    if (socket.current) {
      socket.current.emit("addUser", agentId);
      socket.current.on("getUsers", (users) => {
        console.log(users);
      });
    }
  }, [agentId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chat/${selectedUser.uniqueCaseId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.log("Failed to fetch messages:", error);
      }
    };

    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  const sendMessage = async () => {
    if (question.trim()) {
      const newMessage = {
        uniqueCaseId: selectedUser.uniqueCaseId,
        senderType: "Agent",
        message: question,
      };

      setMessages([...messages, { message: question, senderType: "Agent" }]);
      setQuestion("");

      console.log("UserId from agent:", selectedUser.userId);
      if (socket.current) {
        socket.current.emit("sendMessage", {
          senderId: agentId,
          receiverId: selectedUser.userId,
          text: question,
        });
      }

      try {
        await axios.post(`http://localhost:5000/api/chat`, newMessage);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const handleEnter = async (e) => {
    if (e.key === "Enter") await sendMessage();
  };

  return (
    <div className="h-full shadow-custom rounded bg-[#f5f5f5] flex flex-col">
      <div className="flex justify-between rounded-t bg-white p-2 items-center">
        <IoMdArrowRoundBack
          className="text-3xl text-[#829BFF] hover:text-[#5058e5] cursor-pointer ml-1 md:hidden"
          onClick={onBack}
        />
        <div className="w-10 h-10 ml-1 mr-2 rounded-full overflow-hidden">
          <img
            src={userIcon}
            className="w-full h-full object-cover"
            alt="User Icon"
          />
        </div>
        <span>
          <p className="text-xl font-poppins font-bold">
            {selectedUser.userName}
          </p>
        </span>
        <div className="ml-auto flex space-x-2">
          <button
            className="border font-poppins bg-green-600 text-white mx-2 py-1 px-2 text-center rounded-md"
            onClick={() => setOpen(true)}
          >
            Close Ticket
          </button>
          {uniqueTicketId ? (
            <div className="flex items-center">
              <span className="border font-poppins bg-white text-black py-1 px-2 text-center rounded-md mr-2">
                {uniqueTicketId}
              </span>
              {isCopied ? (
                <FaCheck className="text-2xl text-green-500" />
              ) : (
                <FaRegCopy
                  className="text-2xl text-[#829BFF] hover:text-[#5058e5] cursor-pointer"
                  onClick={handleCopy}
                />
              )}
            </div>
          ) : (
            <button
              className="border font-poppins bg-red-600 text-white py-1 px-2 text-center rounded-md"
              onClick={() => handleEscalatedCase(selectedUser.uniqueCaseId)}
            >
              Create Ticket
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto p-4 scroll-smooth custom-scrollbar">
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            message={msg.message}
            isAgent={msg.senderType === "Agent"}
          />
        ))}

        <div ref={msgEnd} />
      </div>
      <div className="mt-auto w-full flex flex-col items-center">
        <div className="flex md:w-4/6 items-center pt-2 pb-1 px-1 w-full">
          <div className="flex w-full items-center border border-[#C9C9C9] bg-white rounded-xl p-1 focus-within:border-black focus-within:ring-1 focus-within:ring-black">
            <input
              type="text"
              className="w-full p-2 resize-none outline-none"
              placeholder="Type a message"
              value={question}
              onKeyDown={handleEnter}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <IoMdSend
            className="text-3xl text-[#829BFF] hover:text-[#5058e5] cursor-pointer ml-1"
            onClick={sendMessage}
          />
        </div>
      </div>
      <CloseTicketModal
        open={open}
        onClose={() => setOpen(false)}
        uniqueCaseId={selectedUser.uniqueCaseId}
      />
    </div>
  );
}

export default AgentChat;
 