const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: ["http://localhost:3000","https://testdbcserver.onrender.com/","https://https://testdbcserver.onrender.com","https://testdbcdashboard.onrender.com/","https://testdbcdashboard.onrender.com",],
    origin: ["https://dashboard.dropballcity.games", "https://dashboard.dropballcity.games/", "https://dropballcity.games/", "https://dropballcity.games"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Origin",
      "Content-Type",
      "X-Requested-With",
      "Accept",
      "Authorization",
    ],
  },
});

io.on("connection", socket => {
  console.log(`connection established by: ${socket.id}`);

  socket.on("send_message", data => {
    socket.broadcast.emit("receive_message", data.chat);
  });
});

server.listen(5000, () => {
  console.log("connected to 5000");
});
