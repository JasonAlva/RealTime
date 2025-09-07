import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

interface User {
  id: string;
  name: string;
}
interface chatUser {
  id: string;
  name: string;
  message: string;
  timestamp: Date;
}

const roomUsers: Record<string, User[]> = {};

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  const { userId, name } = socket.handshake.query as {
    userId?: string;
    name?: string;
  };

  // fallback if missing
  const safeUser: User = {
    id: userId ?? socket.id,
    name: name ?? "Anonymous",
  };

  const room = "default";
  if (!roomUsers[room]) roomUsers[room] = [];

  if (!roomUsers[room].find((u) => u.id === safeUser.id)) {
    roomUsers[room].push(safeUser);
  }

  socket.join(room);

  io.to(room).emit("users", roomUsers[room]);

  socket.on("text-update", (data: string) => {
    console.log("Received:", data);
    socket.to(room).emit("text-update", data);
  });

  socket.on("chat-update", (data: chatUser) => {
    console.log("chat:", data);
    socket.to(room).emit("chat-update", data);
  });

  socket.on("disconnect", () => {
    roomUsers[room] = roomUsers[room]!.filter((u) => u.id !== safeUser.id);
    io.to(room).emit("users", roomUsers[room]);
  });
});

server.listen(8080, () =>
  console.log("Socket.IO server on http://localhost:8080")
);
