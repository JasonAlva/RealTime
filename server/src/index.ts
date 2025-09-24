import "dotenv/config";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import crypto from "crypto";
import axios from "axios";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
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
app.get("/token", (req, res) => {
  const token = crypto.randomBytes(16).toString("hex"); // secure token
  res.json({ token });
});

app.post("/api/run", async (req, res) => {
  try {
    const { source_code, language_id } = req.body;
    if (!process.env.RAPIDAPI_KEY) {
      return res.status(500).json({ error: "RAPIDAPI_KEY is not set" });
    }

    const { data } = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        source_code,
        language_id,
        stdin: "",
      },
      {
        headers: {
          "content-type": "application/json",
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        },
        params: { base64_encoded: "false", wait: "true" },
        timeout: 20000,
      }
    );
    res.json(data);
  } catch (err) {
    const anyErr: any = err;
    const status = anyErr?.response?.status || 500;
    const msg = anyErr?.response?.data || anyErr?.message || "execution failed";
    console.error("/api/run error:", status, msg);
    res.status(500).json({ error: msg });
  }
});

server.listen(8080, () =>
  console.log("Socket.IO server on http://localhost:8080")
);
