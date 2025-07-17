import React from 'react';
import { useSocket } from '../context/SocketContext';

const RoomSelector = ({ currentRoom, setCurrentRoom }) => {
  const { socket, socketEvents } = useSocket();
  const rooms = ['general', 'random', 'tech', 'gaming'];
  
  const joinRoom = (room) => {
    if (currentRoom === room) return;
    socketEvents.joinRoom(socket, room);
    setCurrentRoom(room);
  };
  
  return (
    <div className="room-selector">
      <h3>Rooms</h3>
      <div className="room-list">
        {rooms.map(room => (
          <button
            key={room}
            className={currentRoom === room ? 'active' : ''}
            onClick={() => joinRoom(room)}
          >
            #{room}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomSelector;