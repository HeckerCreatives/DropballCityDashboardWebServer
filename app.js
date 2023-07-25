const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// ENV connection to MongoDB
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const corsConfig = {
  // origin: "http://localhost:3000",
  // origin: ["https://testdbcdashboard.onrender.com/","https://testdbcdashboard.onrender.com",],
  origin: ["https://dashboard.dropballcity.games", "https://dashboard.dropballcity.games/", "https://dropballcity.games/", "https://dropballcity.games", "https://www.dropballcity.games", "https://www.dropballcity.games/", "https://www.dashboard.dropballcity.games", "https://www.dashboard.dropballcity.games/"],
  methods: ["GET", "POST", "PUT", "DELETE"], // List only` available methods
  credentials: true, // Must be set to true
  allowedHeaders: [
    "Origin",
    "Content-Type",
    "X-Requested-With",
    "Accept",
    "Authorization",
  ], // Allowed Headers to be received
};

app.use(cors(corsConfig)); // Pass configuration to cors
const server = http.createServer(app);

// Used to receive req.body in api
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use(express.json({ limit: "50mb" }));

const connection = mongoose.connection;
connection.once("open", () =>
  console.log("MongoDB database connection established successfully")
);

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "./client/build")));

// Routes
require("./routes")(app);

const io = new Server(server, {
  cors: corsConfig, // Pass configuration to websocket
});

require("./config/socket")(io);

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "./", "client", "build", "index.html"))
);

let revokedTokens = {};

const checkRevokedToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (revokedTokens[token]) {
    return res.status(401).json({ message: revokedTokens[token] });
  }
  next();
};

app.post('/autologout', (req, res) => {
  const event = req.body.event;
  const user = req.body.user;

  let message;
  switch (event) {
    case 'ban':
      // Ban the user
      // ...
      // Set the message to return to the user
      message = 'You have been banned';
      break;
    case 'promote':
      // Promote the user
      // ...
      // Set the message to return to the user
      message = 'You have been promoted';
      break;
    case 'demote':
      // Demote the user
      // ...
      // Set the message to return to the user
      message = 'You have been demoted';
      break;
  }

  // Revoke the user's token and associate it with a message
  revokedTokens[user.token] = message;

  res.sendStatus(200)
})

app.post('/protected', checkRevokedToken, (req, res) => {
  // ...
});

const port = process.env.PORT || 5000; // Dynamic port for deployment
server.listen(port, () => console.log(`Server is running on port: ${port}`));
