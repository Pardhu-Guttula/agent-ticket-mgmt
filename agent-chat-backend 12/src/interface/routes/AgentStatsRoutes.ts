import {
    getSolvedCases,
    getAcceptedCases,
    getAvgResponseTime,
    getEscalatedCases
  } from "../controllers/AgentStatsController";
  
  const express = require("express");
  const router = express.Router();
  
  router.get("/solved/:agentId", getSolvedCases);
  router.get("/avg-response-time/:agentId", getAvgResponseTime);
  router.get("/accepted/:agentId", getAcceptedCases);
  router.get("/escalated/:agentId", getEscalatedCases);
  
  export default router;