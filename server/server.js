require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const socketConfig = require('./config/socketConfig');
const chatHandlers = require('./socket/chatHandlers');
const privateMessageHandlers = require('./socket/privateMessageHandlers');
const roomHandlers = require('./socket/roomHandlers');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Configure socket
socketConfig(io);

// Initialize socket handlers
io.on('connection', (socket) => {
  chatHandlers(io, socket);
  privateMessageHandlers(io, socket);
  roomHandlers(io, socket);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});