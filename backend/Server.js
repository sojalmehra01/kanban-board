const express = require('express');
const connectDB = require('./DB/db');
const cors = require('cors');
const app = express();
// const mongoose = require('mongoose');
// const http = require('http');
// const cookieHandler = require('../CookieHandler'); // Import cookieHandler
// const server = http.createServer(app);
// const User = require('./DB/User');
// const authRoutes = require('./Routes/Auth');
// const Boardroutes = require('./Routes/Boardroutes');
// const Taskroutes = require('./Routes/Taskroutes');
// const protectedRoutes = require('./Routes/Protectedroutes'); // Make sure this path is correct


app.use(cors());

// Middleware
app.use(express.json());
// cookieHandler.useCookieParser(app); // Use cookie-parser middleware

// Use routes

app.use("/api", require("./Routes/Boardroutes.js"))

// app.use('/boards', Boardroutes);
// app.use('/tasks', Taskroutes);

const path = require("path");
app.use(express.static(path.join(__dirname + "/public")));

// app.use('/protected', protectedRoutes); // Use protected routes

// Include Socket.IO configuration
// const io = require('./Socket')(server);



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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
