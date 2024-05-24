const http = require('http');
const express = require('express');
const connectDB = require('./DB/db');
const cors = require('cors');
const app = require('express')();
app.use(cors());
const users = {} 
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('new-user-joined', name => {
        console.log("new user ", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('send', message => {
        console.log("messsage from hopscottch");
        console.log(message);
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });
 });


// Middleware
app.use(express.json());
// cookieHandler.useCookieParser(app); // Use cookie-parser middleware

// Use routes

app.use("/api", require("./Routes/Boardroutes.js"))
app.use("/api", require("./Routes/Taskroutes.js"))
app.use("/api", require("./Routes/Subtaskroutes.js"))

// app.use('/boards', Boardroutes);
// app.use('/tasks', Taskroutes);

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

