import { useState, useContext } from "react";
import { useRef } from "react";
import { motion } from "framer-motion";
import { AiOutlineAppstore, AiOutlineMessage } from "react-icons/ai";
import { MdOutlineManageAccounts } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import { MdMenu } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";

const Sidebar = () => {
  let isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/AgentDashboard");
  const sidebarRef = useRef();
  const navigate = useNavigate();
  const { authState, logout } = useContext(AuthContext);
  const Nav_animation = isTabletMid
    ? {
        open: {
          x: 0,
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: {
            damping: 40,
          },
        },
      };
  const handleHover = () => {
    setOpen(true);
  };
  const handleLeave = () => {
    setOpen(false);
  };

  const handleChatClick = async () => {
    try {
      const agentId = authState.agentId;
      const response = await axios.get(`http://localhost:5000/api/conversation/${agentId}`);
      const users = response.data;
      setActiveLink("/AgentChat");
      navigate("/AgentChat", { state: { users } });
    } catch (error) {
      console.error("Failed to fetch user names:", error);
    }
  };

  return (
    <div className="parent" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
      <div
        onClick={() => setOpen(false)}
        className={`blackscreen md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50 ${
          open ? "block" : "hidden"
        } `}
      ></div>
      <motion.div
        ref={sidebarRef}
        variants={Nav_animation}
        initial={{ x: isTabletMid ? -250 : 0 }}
        animate={open ? "open" : "closed"}
        className="list bg-white text-gray-800 shadow-xl z-[999] max-w-[16rem] w-[16rem] overflow-hidden md:relative fixed h-full flex flex-col"
      >
        <div className="md:hidden flex items-center font-medium border-b py-3 mx-3">
          <span className="text-xl whitespace-pre">Brillio Bot</span>
        </div>
        <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1 font-medium overflow-hidden h-full">
          <li>
            <NavLink
              to="/AgentDashboard"
              className={({ isActive }) =>
                `link flex items-center p-2 rounded-lg transition-colors duration-300 ${
                  isActive || activeLink === "/AgentDashboard"
                    ? "bg-gray-200 text-black"
                    : "text-gray-800 hover:bg-gray-100"
                } mb-2`
              }
              onClick={() => setActiveLink("/AgentDashboard")}
            >
              <AiOutlineAppstore size={23} className="min-w-max" />
              <span className="ml-2">Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/CaseManagement"
              className={({ isActive }) =>
                `link flex items-center p-2 rounded-lg transition-colors duration-300 ${
                  isActive || activeLink === "/CaseManagement"
                    ? "bg-gray-200 text-black"
                    : "text-gray-800 hover:bg-gray-100"
                } mb-2`
              }
              onClick={() => setActiveLink("/CaseManagement")}
            >
              <MdOutlineManageAccounts size={23} className="min-w-max" />
              <span className="ml-2">Case Management</span>
            </NavLink>
          </li>

          <li
            onClick={handleChatClick}
            className={`link flex items-center p-2 rounded-lg transition-colors duration-300 ${
              activeLink === "/AgentChat"
                ? "bg-gray-200 text-black"
                : "text-gray-800 hover:bg-gray-100"
            }`}
          >
            <AiOutlineMessage size={23} className="min-w-max" />
            <span className="ml-2">Chat</span>
          </li>
          <li className="mt-auto">
            <NavLink
              to="/AgentProfile"
              className={({ isActive }) =>
                `link flex items-center p-2 rounded-lg transition-colors duration-300 ${
                  isActive || activeLink === "/AgentProfile"
                    ? "bg-gray-200 text-black"
                    : "text-gray-800 hover:bg-gray-100"
                }`
              }
              onClick={() => setActiveLink("/AgentProfile")}
            >
              <BsPerson size={23} className="min-w-max" />
              <span className="ml-2">Profile</span>
            </NavLink>
          </li>
          <li onClick={() => logout()}>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `link flex items-center p-2 rounded-lg transition-colors duration-300 ${
                  isActive || activeLink === "/login"
                    ? "bg-gray-200 text-black"
                    : "text-gray-800 hover:bg-gray-100"
                }`
              }
              onClick={() => setActiveLink("/login")}
            >
              <MdLogout size={23} className="min-w-max" />
              <span className="ml-2">Logout</span>
            </NavLink>
          </li>
        </ul>
      </motion.div>
      <div className="flex justify-between items-center bg-white relative md:hidden w-full p-3">
        <div onClick={() => setOpen(true)}>
          <MdMenu size={25} />
        </div>
        <p className="text-xl whitespace-pre">Brillio Bot</p>
      </div>
    </div>
  );
};

export default Sidebar;
