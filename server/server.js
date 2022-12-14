const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "https://betrayalclone.vercel.app", methods: ["GET", "POST"] },
});

// const io = new Server(server, {
//   cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
// });

io.on("connection", (socket) => {console.log('User connected: ' + socket.id);

socket.on("send_message", (data) => {
    console.log("send message called");
  socket.broadcast.emit("receive_message", data)});


socket.on("startRoom", (data) => {
  socket.join(data.roomID)});


socket.on("initialRoomReq", (data) => {
  socket.to(data.roomID).emit("userConnected", data);
  socket.to(data.roomID).emit("initalRoomReqHost", data);
 } );

 socket.on("initialRoomResHost", (data) => {
  console.log("sending lobbyList to client");
  console.log(data.lobbyList);
  socket.to(data.roomID).emit("initialRoomRes", data);
 } );

 socket.on("gameStart", (data) => {
  socket.to(data.roomID).emit("startGameClient", data);
 });

 socket.on("sendChatMessage", (data) => {
  console.log(data.message);
  console.log("hello here")
  console.log(data.name);
  socket.to(data.roomID).emit("chat-message", data);
 });


});


server.listen(process.env.PORT || 3001, ()  => {console.log("running")});