"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const caseRoutes_1 = __importDefault(require("./interface/routes/caseRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)()); // Enable CORS for all routes
app.use(express_1.default.json()); // Parse incoming JSON requests
app.use("/api", caseRoutes_1.default); // Route all API requests through /api prefix
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
