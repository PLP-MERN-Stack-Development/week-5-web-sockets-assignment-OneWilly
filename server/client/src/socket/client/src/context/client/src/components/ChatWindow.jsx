import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import { useSocket } from '../context/SocketContext';

const ChatWindow = ({ room }) => {
  const { socket, socketEvents } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (!socket) return;
    
    socketEvents.joinRoom(socket, room);
    
    const handleNewMessage = (message) => {
      if (message.room === room) {
        setMessages(prev => [...prev, message]);
      }
    };
    
    const handleTyping = ({ username, isTyping }) => {
      setTypingUsers(prev => {
        if (isTyping && !prev.includes(username)) {
          return [...prev, username];
        } else if (!isTyping) {
          return prev.filter(u => u !== username);
        }
        return prev;
      });
    };
    
    socketEvents.newMessage(socket, handleNewMessage);
    socketEvents.typing(socket, handleTyping);
    
    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('typing', handleTyping);
    };
  }, [socket, room]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = () => {
    if (input.trim()) {
      socketEvents.sendMessage(socket, { 
        room, 
        content: input 
      });
      setInput('');
      socketEvents.setTyping(socket, false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.map((msg, i) => (
          <Message key={i} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <TypingIndicator users={typingUsers} />
      
      <div className="message-input">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            socketEvents.setTyping(socket, e.target.value.length > 0);
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;