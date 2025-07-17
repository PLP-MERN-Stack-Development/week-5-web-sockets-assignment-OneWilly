module.exports = (io) => {
  io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) return next(new Error("Invalid username"));
    socket.data.username = username;
    next();
  });
  
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id} (${socket.data.username})`);
    
    // Join main room by default
    socket.join('general');
    
    // Notify all users about new connection
    io.emit('user-connected', socket.data.username);
    
    socket.on('disconnect', () => {
      io.emit('user-disconnected', socket.data.username);
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};