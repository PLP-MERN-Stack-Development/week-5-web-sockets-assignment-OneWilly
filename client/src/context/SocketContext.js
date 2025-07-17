import React, { createContext, useContext, useEffect, useState } from 'react';
import { initSocket, socketEvents } from '../socket/socketClient';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  const connectSocket = (username) => {
    const newSocket = initSocket(username);
    newSocket.connect();
    
    socketEvents.connect(newSocket, () => setIsConnected(true));
    socketEvents.disconnect(newSocket, () => setIsConnected(false));
    socketEvents.userConnected(newSocket, (username) => 
      setOnlineUsers(prev => [...prev, username])
    );
    socketEvents.userDisconnected(newSocket, (username) => 
      setOnlineUsers(prev => prev.filter(u => u !== username))
    );
    
    setSocket(newSocket);
    return newSocket;
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected, 
      onlineUsers, 
      connectSocket, 
      socketEvents 
    }}>
      {children}
    </SocketContext.Provider>
  );
};