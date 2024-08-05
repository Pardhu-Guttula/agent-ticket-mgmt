import request from "supertest";
import express from "express";
import {
  getCases,
  updateCaseStatus,
  createTicket,
  getTicketId,
  createCase,
} from "../../../interface/controllers/CaseController";
import { CaseDbRepository } from "../../../infrastructure/dbService/MySqlCaseDbRepository";
import { GetCasesQuery } from "../../../application/queries/GetCases";
import { CreateCaseCommand } from "../../../application/commands/CreateCase";

const app = express();
app.use(express.json());
app.get("/api/cases", getCases);
app.put("/api/cases/accept/:uniqueCaseId", updateCaseStatus);
app.post("/api/cases/create-ticket", createTicket);
app.get("/api/cases/ticketId/:uniqueCaseId", getTicketId);
app.post("/api/cases/createCase/:uniqueUserId", createCase);

describe("Case Controller", () => {
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

    // it("should return 500 if an unexpected server error occurs", async () => {
    //   jest.spyOn(GetCasesQuery.prototype, "execute").mockImplementation(() => {
    //     throw new Error("Internal Server Error");
    //   });

    //   const response = await request(app).get("/api/cases");
    //   expect(response.status).toBe(500);
    //   expect(response.body.error).toBe("Internal Server Error");
    // });
  });

  describe("PUT /api/cases/accept/:uniqueCaseId", () => {
    it("should update the status of a case to Accepted", async () => {
      const uniqueCaseId = "C00001";
      const updateData = { agentId: "A00001", caseType: "Accepted" };

      jest
        .spyOn(CaseDbRepository.prototype, "updateCaseStatusById")
        .mockImplementation(async () => {
          return Promise.resolve();
        });

      const response = await request(app)
        .put(`/api/cases/accept/${uniqueCaseId}`)
        .send(updateData);
      console.log(response.body);
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

    it("should return 500 for unexpected server errors", async () => {
      jest
        .spyOn(CaseDbRepository.prototype, "updateCaseStatusById")
        .mockImplementation(() => {
          throw new Error("Internal Server Error");
        });

      const uniqueCaseId = "C00001";
      const updateData = { agentId: "A00001", caseType: "Accepted" };

      const response = await request(app)
        .put(`/api/cases/accept/${uniqueCaseId}`)
        .send(updateData);
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Internal Server Error");
    });
  });

  describe("POST /api/cases/create-ticket", () => {
    it("should create a new ticket for a case", async () => {
      const response = await request(app)
        .post("/api/cases/create-ticket")
        .send({
          uniqueCaseId: "C00001",
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

    // it("should return 500 for unexpected server errors", async () => {
    //   jest
    //     .spyOn(CaseDbRepository.prototype, "createTicket")
    //     .mockImplementation(() => {
    //       throw new Error("Internal Server Error");
    //     });

    //   const response = await request(app)
    //     .post("/api/cases/create-ticket")
    //     .send({
    //       uniqueCaseId: "C00001",
    //       agentId: "A00001",
    //     });

    //   expect(response.status).toBe(500);
    //   expect(response.body.error).toBe("Internal Server Error");
    // });
  });

  describe("GET /api/cases/ticketId/:uniqueCaseId", () => {
    it("should retrieve the ticket URL for a case", async () => {
      const response = await request(app).get("/api/cases/ticketId/C00001");
      expect(response.status).toBe(200);
      expect(response.body.ticketUrl).toBeDefined();
      expect(response.body.uniqueTicketId).toBeDefined();
    });

    it("should return 404 if the case does not exist", async () => {
      const response = await request(app).get(
        "/api/cases/ticketId/NonExistentCaseId"
      );
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Ticket not found");
    });

    // it("should return 500 for unexpected server errors", async () => {
    //   jest
    //     .spyOn(CaseDbRepository.prototype, "getTicketByCaseId")
    //     .mockImplementation(() => {
    //       throw new Error("Internal Server Error");
    //     });

    //   const response = await request(app).get("/api/cases/ticketId/C00001");
    //   expect(response.status).toBe(500);
    //   expect(response.body.error).toBe("Internal Server Error");
    // });
  });

  describe("POST /api/cases/createCase/:uniqueUserId", () => {
    it("should create a new case", async () => {
      const response = await request(app)
        .post("/api/cases/createCase/U00001")
        .send({
          caseDescription: "Issue with Login credentials",
          caseStatus: "Pending",
          caseCreatedAt: "2024-07-30 15:33:00",
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Case created successfully");
    });

    it("should return 400 if required parameters are missing", async () => {
      const response = await request(app)
        .post("/api/cases/createCase/U00001")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Failed to create case");
    });

    // it("should return 500 for unexpected server errors", async () => {
    //   jest
    //     .spyOn(CreateCaseCommand.prototype, "execute")
    //     .mockImplementation(() => {
    //       throw new Error("Internal Server Error");
    //     });

    //   const response = await request(app)
    //     .post("/api/cases/createCase/U00001")
    //     .send({
    //       caseDescription: "Issue with Login credentials",
    //       caseStatus: "Pending",
    //       caseCreatedAt: "2024-07-30 15:33:00",
    //     });

    //   expect(response.status).toBe(500);
    //   expect(response.body.error).toBe("Failed to create case");
    // });
  });
});
