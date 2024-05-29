const http = require('http');
const express = require('express');
const connectDB = require('./DB/db');
const cors = require('cors');
const app = require('express')();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const Messageroutes = require('./Routes/Messageroutes');

app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


// Middleware
app.use(express.json());
// cookieHandler.useCookieParser(app); // Use cookie-parser middleware

// Use routes

app.use("/api", require("./Routes/Boardroutes.js"))
app.use("/api", require("./Routes/Taskroutes.js"))
app.use("/api", require("./Routes/Subtaskroutes.js"))

app.use("/api" , require("./Routes/Messageroutes.js"))//added

app.post('/messages', ()=>{Messageroutes.createMessage});
app.get('/messages', ()=>{Messageroutes.getAllMessages});

const path = require("path");
app.use(express.static(path.join(__dirname + "/public")));

// app.use('/protected', protectedRoutes); // Use protected routes

// Include Socket.IO configuration


// Authentication code
// app.use('/auth', authRoutes);


// Connect to MongoDB
connectDB();

// Error handling middleware
// app.use((err, req, res, next) => {
//  console.error(err.stack);
//  res.status(500).send('Something broke!');
// });

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
























// const mongoose = require('mongoose');
// const cookieHandler = require('../CookieHandler'); // Import cookieHandler
//const server = http.createServer(app);
// const User = require('./DB/User');
// const authRoutes = require('./Routes/Auth');
// const Boardroutes = require('./Routes/Boardroutes');
// const Taskroutes = require('./Routes/Taskroutes');
// const protectedRoutes = require('./Routes/Protectedroutes'); // Make sure this path is correct

