import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import caseRoutes from "./interface/routes/CaseRoutes";
import setupSwagger from "./utils/swagger";
import http from "http";
import { Server } from "socket.io";
import conversationRoutes from "./interface/routes/ConversationRoutes";
import chatRoutes from "./interface/routes/ChatRoutes";
import authRoutes from "./interface/routes/AuthRoutes";
import userRoutes from "./interface/routes/UserRoutes";
import ProfileRoute from "./interface/routes/ProfileRoute";
import AgentRoute from "./interface/routes/AgentRoute";
import AgentStatsRoutes from "./interface/routes/AgentStatsRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/cases", caseRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", ProfileRoute);
app.use("/api/agent", AgentRoute);
app.use("/api/user", userRoutes);
app.use("/api/agentstats", AgentStatsRoutes);
setupSwagger(app);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

interface User {
  userId: string;
  socketId: string;
}

let users: User[] = [];

const addUser = (userId: string, socketId: string) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId: string) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: string): User | undefined => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);

    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
