import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export const initSocket = (username) => {
  const socket = io(SOCKET_URL, {
    auth: { username },
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
};

export const socketEvents = {
  connect: (socket, callback) => socket.on('connect', callback),
  disconnect: (socket, callback) => socket.on('disconnect', callback),
  newMessage: (socket, callback) => socket.on('new-message', callback),
  typing: (socket, callback) => socket.on('typing', callback),
  userConnected: (socket, callback) => socket.on('user-connected', callback),
  userDisconnected: (socket, callback) => socket.on('user-disconnected', callback),
  joinRoom: (socket, room) => socket.emit('join-room', room),
  sendMessage: (socket, message) => socket.emit('send-message', message),
  setTyping: (socket, isTyping) => socket.emit('typing', isTyping),
};