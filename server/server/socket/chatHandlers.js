module.exports = (io, socket) => {
  const sendMessage = (data) => {
    const { room, content } = data;
    const message = {
      sender: socket.data.username,
      content,
      timestamp: new Date().toISOString(),
      room,
    };
    
    io.to(room).emit('new-message', message);
  };

  const typingIndicator = (isTyping) => {
    socket.broadcast.to(socket.data.room).emit('typing', {
      username: socket.data.username,
      isTyping
    });
  };

  socket.on('send-message', sendMessage);
  socket.on('typing', typingIndicator);
};