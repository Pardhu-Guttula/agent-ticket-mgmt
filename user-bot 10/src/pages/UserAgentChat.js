import React, { useRef, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import Logo from "../assests/agent.jpg";
import userLogo from "../assests/user.png";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import agenticon from "../assests/agenticon.png";
import { MdLogout } from "react-icons/md";
import { AuthContext } from "../AuthContext";


const backgroundStyle = {
  backgroundImage: `url(${agenticon})`,
  backgroundSize: "30%",
  backgroundColor: "#f5f5f5",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};

function UserAgentChat() {
  const {logout,authState} = useContext(AuthContext)
  const msgEnd = useRef(null);

  const [question, setQuestion] = useState("");
  const [agentId, setAgentId] = useState(null);
  const [caseId, setCaseId] = useState(null);
  const [messages, setMessages] = useState([
    {
      text: "Hi, Welcome. How can I help you today?",
      isBot: true,
    },
  ]);

  const [botResponse, setBotResponse] = useState(null);
  const socket = useRef();
  const userId = authState.userId; 

  useEffect(() => {
    const fetchAgentId = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/agent/${userId}`); 
            const agent = response.data.uniqueAgentId;
            const caseNo = response.data.uniqueCaseId;
            setAgentId(agent);
            setCaseId(caseNo);
           
        } catch (error) {
            console.error('Error fetching agentId:', error);
        }
    };

    fetchAgentId(userId);
}, [userId]);


  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.on("getMessage", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.text, isBot: true },
      ]);
    })
  });

  useEffect(() => {

    socket.current.emit("addUser", userId);
    socket.current.on("getUsers", (users) => {
    });

    socket.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.current.disconnect();
    };
  });

  const handleSend = async () => {
    const text = question;
    setQuestion("");
    const newMessage = {
      uniqueCaseId: caseId,
      senderType: "User",
      message: text,
    };
    const userMessage = {
      text: text,
      isBot: false,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    socket.current.emit("sendMessage", {
      senderId: userId,
      receiverId: agentId,
      text: text,
    });
  
    try {
      await axios.post(`http://localhost:5000/api/chat`, newMessage);
    } catch (error) {
      console.error("Failed to send User Message:", error);
    }
  
  };
  
  useEffect(() => {
    if (
      botResponse &&
      !messages.some((msg) => msg.text === botResponse.text && msg.isBot)
    ) {
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }
  }, [botResponse, messages]);

  const handleEnter = async (e) => {
    if (e.key === "Enter") await handleSend();
  };

  return (
    <div className="bg-primary">
      <div>
      <div className="absolute right-6 top-1">
          <MdLogout onClick = {()=>logout()} className="cursor-pointer text-3xl text-[#5058e5] hover:text-[#31368C]"/>
        </div>     
        <div
          className="min-h-[calc(100vh-6rem)] max-h-[calc(100vh-6rem)] m-12 flex flex-col bg-[#F8F8F8] rounded-2xl p-2 border-gray-300"
          style={{ ...backgroundStyle, zIndex: 9 }}
        >
          <div className="flex flex-col overflow-y-auto scroll-smooth custom-scrollbar">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex p-2 ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                {message.isBot ? (
                  <>
                    <div className="shrink-0 w-10 ml-1 mr-2">
                      <img
                        src={Logo}
                        alt="Logo"
                        className="w-full rounded-full"
                      />
                    </div>
                    <div className="text-justify p-2 rounded-2xl bg-[#d5d8f2] text-black text-left">
                      {message.text.split("\n").map((line, index) => (
                        <p key={index} className="font-poppins">
                          {line}
                        </p>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-justify p-2 rounded-2xl bg-gray-300 text-black text-right">
                      {message.text.split("\n").map((line, index) => (
                        <p key={index} className="font-poppins">
                          {line}
                        </p>
                      ))}
                    </div>
                    <div className="shrink-0 w-10 ml-1 mr-2 ">
                      <img
                        src={userLogo}
                        alt="Logo"
                        className="w-full rounded-full"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}

            <div ref={msgEnd} />
          </div>

          <div className="mt-auto w-full flex flex-col items-center">
            <div className="flex w-4/6 items-center pt-2">
              <div className="flex w-full items-center border border-gray-500 bg-white rounded-xl p-1 focus-within:border-black focus-within:ring-1 focus-within:ring-black">
                <input
                  type="text"
                  className="w-full p-2 resize-none outline-none"
                  placeholder="Enter your query"
                  value={question}
                  onKeyDown={handleEnter}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              <IoMdSend
                className="text-3xl text-[#829BFF] hover:text-[#5058e5] cursor-pointer ml-1"
                onClick={handleSend}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAgentChat;
