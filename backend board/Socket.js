const { Server } = require('socket.io');

module.exports = (server) => {
 const io = new Server(server);

 io.on('connection', (socket) => {
    console.log('a user connected');

    // Example: Listen for a custom event and respond
    socket.on('taskCreated', (task) => {
       console.log('Task created:', task);
       // You can broadcast this event to all connected clients
       io.emit('taskCreated', task);
    });

    socket.on('disconnect', () => {
       console.log('user disconnected');
    });
 });

 return io;
};
