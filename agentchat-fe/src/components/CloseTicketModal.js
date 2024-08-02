import React, { useState, useEffect,useContext } from "react";
import { X } from "react-feather";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function CloseTicketModal({ open, onClose, uniqueCaseId }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [completionNote, setCompletionNote] = useState("");
  const {authState} = useContext(AuthContext)
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

  const handleChatClick = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/conversation/${agentId}`);
      const users = response.data;
      navigate("/AgentChat", { state: { users } });
    } catch (error) {
      console.error("Failed to fetch user names:", error);
    }
  };


  const handleCloseCase = async (uniqueCaseId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/chat/close/${uniqueCaseId}`,
        { completionNote }
      );
      // fetchData();
      handleChatClick();
      onClose();
    } catch (error) {
      console.error("Error updating case status:", error.message);
    }
  };

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors
    ${open ? "bg-black bg-opacity-5 backdrop-blur" : "invisible"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl shadow p-6 transition-all
        ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} w-96`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50
        hover:text-gray-600"
        >
          <X />
        </button>
        <div className="mx-auto my-2 px-3 w-full">
          <h3 className="text-lg font-black text-gray-800">
            Case ID:{uniqueCaseId}
          </h3>
          <h3 className="text-lg font-black text-gray-800">Completion Note</h3>
          <textarea
            className="h-40 resize-none border border-gray-500 rounded-md w-full"
            value={completionNote}
            onChange={(e) => setCompletionNote(e.target.value)}
          ></textarea>
          <div className="flex justify-center">
            <button
              className="border font-poppins bg-[#5058e5] text-white py-1 px-3 text-center mt-3 rounded-md"
              onClick={() => handleCloseCase(uniqueCaseId)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CloseTicketModal;
 