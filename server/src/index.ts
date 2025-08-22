import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";


const app=express();
const server=http.createServer(app);
const io=new Server(server,{
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],        
  }
});

io.on("connection", (socket:Socket) => {
    console.log("User connected:", socket.id);
  
    socket.on("text-update", (data: string) => {
      console.log("Received:", data);
      // Broadcast to everyone except sender
      socket.broadcast.emit("text-update", data);
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  
server.listen(8080, () => console.log("Socket.IO server on http://localhost:8080"));