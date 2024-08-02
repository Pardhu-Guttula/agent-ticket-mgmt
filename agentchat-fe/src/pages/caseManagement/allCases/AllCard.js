import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTh, FaList } from "react-icons/fa";
import { AuthContext } from "../../../AuthContext";

function AllCard({ searchQuery }) {
  const [view, setView] = useState("grid");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const agentId = authState.agentId;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cases?caseType=Pending`
      );
      setCards(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = async (acceptedCard) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/conversation/${agentId}`
      );
      const users = response.data;
      navigate("/AgentChat", { state: { selectedUser: acceptedCard, users } });
    } catch (error) {
      console.error("Failed to fetch user names:", error);
    }
  };

  const handleAcceptCase = async (uniqueCaseId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/cases/accept/${uniqueCaseId}`,
        { agentId, caseType: "Accepted" }
      );
      fetchData();
      handleChatClick();
    } catch (error) {
      console.error("Error updating case status:", error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredCards = cards.filter((card) =>
    card.uniqueCaseId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main">
      <div className="container mx-auto flex flex-col gap-3">
        <div className="flex bg-grey text-white ml-auto">
          <div className="flex space-x-2">
            <button
              className={`p-1 ${
                view === "grid" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("grid")}
            >
              <FaTh size={16} />
            </button>
            <button
              className={`p-1 ${
                view === "list" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("list")}
            >
              <FaList size={16} />
            </button>
          </div>
        </div>
        <div>
          {filteredCards.length === 0 ? (
            searchQuery ? (
              <div className="p-4 bg-red-100 text-red-600 rounded-md">
                No card available with Ticket ID:{" "}
                <span className="font-bold">{searchQuery}</span>
              </div>
            ) : (
              <div className="p-4 bg-red-100 text-red-600 rounded-md">
                No pending cases
              </div>
            )
          ) : view === "grid" ? (
            <div className="grid gap-4 sm:gap-6 md:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCards.map((card) => (
                <div
                  key={card.uniqueCaseId}
                  className="p-4 bg-card relative overflow-hidden rounded-md shadow-lg group transition-transform duration-300 hover:scale-105 flex flex-col justify-between"
                >
                  <div>
                    <h3>
                      <span className="font-bold">TicketID:</span>{" "}
                      <span>{card.uniqueCaseId}</span>
                    </h3>
                    <h2>
                      <span className="font-bold">User Name:</span>{" "}
                      <span>{card.userName}</span>
                    </h2>
                    <span className="font-bold">Short Description:</span>
                    <h2 className="break-words text-justify">
                      <span className="text-align">{card.caseDescription}</span>
                    </h2>
                    <br></br>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="text-white bg-normal-button hover:bg-hover-button font-bold py-2 px-4 ml-4 rounded"
                      onClick={() => handleAcceptCase(card.uniqueCaseId)}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-initial ">
              <div className="flex justify-center items-center h-full">
                <div className="w-full">
                  {filteredCards.map((card) => (
                    <div
                      key={card.uniqueCaseId}
                      className="p-4 container mx-auto bg-card overflow-hidden rounded-md shadow-lg flex justify-between items-center mb-4 transition-transform duration-300 hover:scale-105"
                      style={{ height: "calc(100% + 1rem)" }}
                    >
                      <div className="flex-1 min-w-0">
                        <h3>
                          <span className="font-bold">Ticket ID:</span>{" "}
                          <span>{card.uniqueCaseId}</span>
                        </h3>
                        <h2 className="break-words">
                          <span className="font-bold">Short Description:</span>
                        </h2>
                        <span className="text-justify">
                          {card.caseDescription}
                        </span>
                      </div>
                      <button
                        className="text-white bg-normal-button hover:bg-hover-button font-bold py-2 px-4 ml-4 rounded"
                        onClick={() => handleAcceptCase(card.uniqueCaseId)}
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllCard;
