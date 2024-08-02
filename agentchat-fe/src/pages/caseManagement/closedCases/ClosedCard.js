import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaTh, FaList } from "react-icons/fa";
import { AuthContext } from "../../../AuthContext";

function ClosedCard({ searchQuery }) {
  const [view, setView] = useState("grid");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const agentId = authState.agentId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/cases?caseType=Closed&agentId=${agentId}`
        );
        setCards(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agentId]);

  const filteredCards = cards.filter((card) =>
    card.uniqueCaseId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const reversedCards = filteredCards.slice().reverse();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
          {reversedCards.length === 0 ? (
            searchQuery ? (
              <div className="p-4 bg-red-100 text-red-600 rounded-md">
                No card available with Ticket ID:{" "}
                <span className="font-bold">{searchQuery}</span>
              </div>
            ) : (
              <div className="p-4 bg-red-100 text-red-600 rounded-md">
                No closed cases
              </div>
            )
          ) : view === "grid" ? (
            <div className="grid gap-4 sm:gap-6 md:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {reversedCards.map((card) => (
                <div
                  key={card.uniqueCaseId}
                  className="p-4 bg-card relative overflow-hidden rounded-md shadow-lg group transition-transform duration-300 hover:scale-105 flex flex-col justify-between"
                >
                  <div>
                    <h3>
                      <span className="font-bold">Ticket ID:</span>{" "}
                      <span>{card.uniqueCaseId}</span>
                    </h3>
                    <h2>
                      <span className="font-bold">User Name:</span>{" "}
                      <span>{card.userName}</span>
                    </h2>
                    <span className="font-bold">Completion Note: </span>
                    <h2 className="break-words text-justify">
                      <span className="text-align">{card.completionNote}</span>
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-initial">
              <div className="flex justify-center items-center h-full">
                <div className="w-11/12">
                  {reversedCards.map((card) => (
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
                          <span className="font-bold">Completion Note:</span>{" "}
                        </h2>
                        <span className="text-justify">{card.completionNote}</span>
                      </div>
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

export default ClosedCard;
 