const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Frontend URL
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
   

    socket.on('join_room', (room) => {
        socket.join(room);
        
    });

    socket.on('send_message', (data) => {
       
        io.to(data.room).emit('receive_message', data); 
    });

    socket.on('disconnect', () => {
        
    });
});

server.listen(3001, () => {
    console.log('Server running on port 3001');
});
