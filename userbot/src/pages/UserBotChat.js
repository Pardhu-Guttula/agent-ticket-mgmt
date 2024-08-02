import React, { useRef, useState, useEffect } from "react";
import Logo from "../assests/botLogo.png"
import userLogo from "../assests/user.png";
import { IoMdSend } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import botIcon from "../assests/botIcon.png"

const backgroundStyle = {
  backgroundImage: `url(${botIcon})`,
  backgroundSize: "30%",
  backgroundColor:"#f5f5f5",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};

function UserBotChat() {
  const msgEnd = useRef(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hi, Welcome to Agent Bot. How can I help you today?",
      isBot: true,
    },
  ]);
  const [botResponse, setBotResponse] = useState(null);

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages]);


  const handleSend = async () => {
    const text = question;
    setQuestion("");

    const userMessage = {
      text: text,
      isBot: false,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

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
          <MdLogout className="cursor-pointer text-3xl text-[#5058e5] hover:text-[#31368C]"/>
        </div>

        <div
          className="min-h-[calc(100vh-6rem)] max-h-[calc(100vh-6rem)] m-12 flex flex-col bg-[#F8F8F8] rounded-2xl p-2 border-gray-300"
          style={{ ...backgroundStyle, zIndex: 9 }}
        >
          <div className="flex flex-col overflow-y-auto scroll-smooth custom-scrollbar ">
            
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
                    <div
                      className="text-justify p-2 rounded-2xl bg-[#d5d8f2] text-black text-left"
                    >
                      {message.text.split("\n").map((line, index) => (
                        <p key={index} className="font-poppins">
                          {line}
                        </p>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="text-justify p-2 rounded-2xl bg-gray-300 text-black text-right"
                    >
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

          <button
            className="text-lg px-4 py-2 bg-[#5058e5] text-white rounded-lg shadow hover:bg-[#2A2E78]  w-[11rem]"
            onClick={() => window.open("/useragentchat", "_blank")}
          >
            Connect to Agent
          </button>


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

export default UserBotChat;
