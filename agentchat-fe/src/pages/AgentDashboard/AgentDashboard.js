import React from "react";
import { useContext, useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import CardGrid from "../AgentDashboard/CardGrid";
import axios from "axios";

import { AuthContext } from "../../AuthContext";

const AgentDashboard = () => {
  const { authState } = useContext(AuthContext);
  const agentId = authState.agentId;

  const [metrics, setMetrics] = useState({
    solvedCases: 0,
    avgResponseTime: "",
    escalatedCases: 0,
    acceptedCases: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [solvedRes, responseTimeRes, escalatedRes, acceptedRes] =
          await Promise.all([
            axios.get(`http://localhost:5000/api/agentstats/solved/${agentId}`),
            axios.get(
              `http://localhost:5000/api/agentstats/avg-response-time/${agentId}`
            ),
            axios.get(
              `http://localhost:5000/api/agentstats/escalated/${agentId}`
            ),
            axios.get(
              `http://localhost:5000/api/agentstats/accepted/${agentId}`
            ),
          ]);

        const solvedCases = solvedRes.data.solvedCases;
        const avgResponseTime = responseTimeRes.data.avgResponseTime;
        const escalatedCases = escalatedRes.data.escalatedCases;
        const acceptedCases = acceptedRes.data.acceptedCases;
        setMetrics({
          solvedCases: solvedCases,
          avgResponseTime: avgResponseTime,
          escalatedCases: escalatedCases,
          acceptedCases: acceptedCases,
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, [agentId]);

  const cardData = [
    { title: "Average Response Time", content: metrics.avgResponseTime,  imageurl: '/images/responseTime.png' },
    { title: "Accepted Cases", content: metrics.acceptedCases, imageurl: '/images/accepted.png'},
    { title: "Solved Cases", content: metrics.solvedCases, imageurl: '/images/solved.png' },
    { title: "Escalated Cases", content: metrics.escalatedCases, imageurl: '/images/escalated.png' },
  ];

  return (
    <div className="min-h-screen flex flex-col p-4">
      <CardGrid cardData={cardData} />
      <div className="mt-8">
        <iframe
          title="Power BI Report"
          width="100%"
          height="450"
          src="https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID&autoAuth=true&ctid=YOUR_TENANT_ID"
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </div>
    </div>
  );
};

export default AgentDashboard;
 