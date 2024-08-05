import request from "supertest";
import express from "express";
import router from "../../../interface/routes/CaseRoutes";

const app = express();
app.use(express.json());
app.use("/api/cases", router);

describe("Case Routes", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("GET /api/cases", () => {
    it("should retrieve cases based on query parameters", async () => {
      const response = await request(app).get("/api/cases?caseType=Pending");
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should retrieve cases when no query parameters are provided", async () => {
      const response = await request(app).get("/api/cases");
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("PUT /api/cases/accept/:uniqueCaseId", () => {
    it("should update the status of a case to Accepted", async () => {
      const uniqueCaseId = "C00005";
      const updateData = { agentId: "A00001", caseType: "Accepted" };

      const response = await request(app)
        .put(`/api/cases/accept/${uniqueCaseId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Case status updated successfully");
    });

    it("should return 400 for missing agentId or caseType", async () => {
      const uniqueCaseId = "C00001";
      const invalidData = { agentId: "" };

      const response = await request(app)
        .put(`/api/cases/accept/${uniqueCaseId}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("agentId and caseType are required");
    });
  });

  describe("GET /api/cases/ticketId/:uniqueCaseId", () => {
    it("should retrieve the ticket URL for a case", async () => {
      const uniqueCaseId = "C00004";
      const response = await request(app).get(
        `/api/cases/ticketId/${uniqueCaseId}`
      );
      expect(response.status).toBe(200);
      expect(response.body.ticketUrl).toBeDefined();
    });

    it("should return 404 if the case does not exist", async () => {
      const uniqueCaseId = "NonExistentCaseId";
      const response = await request(app).get(
        `/api/cases/ticketId/${uniqueCaseId}`
      );
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Ticket not found");
    });
  });

  describe("POST /api/cases/create-ticket", () => {
    it("should create a new ticket for a case", async () => {
      const response = await request(app)
        .post("/api/cases/create-ticket")
        .send({
          uniqueCaseId: "C00004",
          agentId: "A00001",
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Ticket created successfully");
      expect(response.body.ticketUrl).toBeDefined();
      expect(response.body.uniqueTicketId).toBeDefined();
    });

    it("should return 400 if required parameters are missing", async () => {
      const response = await request(app)
        .post("/api/cases/create-ticket")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("uniqueCaseId and agentId are required");
    });
  });

  describe("POST /api/cases/createCase/:uniqueUserId", () => {
    it("should create a new case", async () => {
      const uniqueUserId = "U00003";
      const caseData = {
        caseDescription: "Issue with Login credentials",
        caseStatus: "Pending",
        caseCreatedAt: "2024-07-30 15:33:00",
      };

      const response = await request(app)
        .post(`/api/cases/createCase/${uniqueUserId}`)
        .send(caseData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Case created successfully");
    });

    it("should return 500 if case creation fails", async () => {
      const uniqueUserId = "U00001";
      const caseData = {};

      const response = await request(app)
        .post(`/api/cases/createCase/${uniqueUserId}`)
        .send(caseData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Failed to create case");
    });
  });
});
