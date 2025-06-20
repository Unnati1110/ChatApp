import './App.css';
import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';

const socket = io.connect('http://localhost:3001');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if(username !== "" && room !== "") {
      socket.emit('join_room', room);
      setShowChat(true);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-teal-900 text-gray-200">
      {!showChat ? (
        <div className="flex flex-col space-y-4 p-8 bg-gray-800 rounded-xl shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-bold text-teal-400 text-center">Join a Chat Room</h1>
          <input
            type="text"
            placeholder="Name"
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID"
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            onClick={joinRoom}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white font-semibold transition"
          >
            Join Room
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
