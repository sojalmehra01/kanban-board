// const { Server } = require('socket.io');

// module.exports = (server) => {
//  const io = new Server(server);

//  io.on('connection', (socket) => {
//     console.log('a user connected');

//     // Example: Listen for a custom event and respond
//     socket.on('taskCreated', (task) => {
//        console.log('Task created:', task);
//        // You can broadcast this event to all connected clients
//        io.emit('taskCreated', task);
//     });

//     socket.on('disconnect', () => {
//        console.log('user disconnected');
//     });
//  });

//  return io;
// };

export const io = require('socket.io')(8000)
const PORT = process.env.PORT || 5000; // Using environment variable or fallback to 8000

io.on('connection', socket => {
    

    
    // socket.on('upload', (file, callback) => {
    //     // Save the file to a temporary directory
    //     const filePath = `/tmp/${Date.now()}-${file.name}`;
    //     fs.writeFile(filePath, file, (err) => {
    //         if (err) {
    //             callback({ success: false, error: err.message });
    //             return;
    //         }
    //         callback({ success: true, url: `/download/${filePath.split('/').pop()}` });
    //     })
    // });
    // socket.on('broadcast_file', (data) => {
    //     io.emit('file_available', data);
    // }
})
