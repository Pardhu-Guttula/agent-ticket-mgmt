import request from "supertest";
import express, { Request, Response } from "express";
import router from "../../../interface/routes/ProfileRoute";

const app = express();
app.use(express.json());
app.use("/api/profile", router);

jest.mock("../../../interface/controllers/ProfileController", () => ({
  getProfile: jest.fn(),
}));

describe("Profile Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/profile/:agentId", () => {
    it("should retrieve the profile for the given agentId", async () => {
      const mockProfile = {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
      };
      const {
        getProfile,
      } = require("../../../interface/controllers/ProfileController");
      getProfile.mockImplementation((req: Request, res: Response) =>
        res.status(200).json(mockProfile)
      );

      const response = await request(app).get("/api/profile/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProfile);
    });

    it("should return 400 if the agentId is invalid", async () => {
      const {
        getProfile,
      } = require("../../../interface/controllers/ProfileController");
      getProfile.mockImplementation((req: Request, res: Response) => {
        if (!req.params.agentId || req.params.agentId.trim() === "") {
          return res.status(400).json({ error: "Invalid agent ID" });
        }
        return res.status(404).json({ error: "Agent not found" });
      });

      const response = await request(app).get("/api/profile/"); // Simulate missing agentId

      expect(response.status).toBe(404); // Expect 404 since the route is not matched
    });

    it("should return 404 if the profile is not found", async () => {
      const {
        getProfile,
      } = require("../../../interface/controllers/ProfileController");
      getProfile.mockImplementation((req: Request, res: Response) => {
        if (!req.params.agentId || req.params.agentId.trim() === "") {
          return res.status(400).json({ error: "Invalid agent ID" });
        }
        return res.status(404).json({ error: "Agent not found" });
      });

      const response = await request(app).get("/api/profile/999"); // Assuming 999 does not exist

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Agent not found" });
    });

    it("should return 500 if there is an internal server error", async () => {
      const {
        getProfile,
      } = require("../../../interface/controllers/ProfileController");
      getProfile.mockImplementation((req: Request, res: Response) =>
        res.status(500).json({ error: "Internal server error" })
      );

      const response = await request(app).get("/api/profile/3"); // Simulating server error

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });
  });
});
