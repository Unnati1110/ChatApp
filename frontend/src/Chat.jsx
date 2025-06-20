import React, { useState, useEffect } from "react";

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage.trim() !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };
            await socket.emit('send_message', messageData);
            setCurrentMessage('');
        }
    };

    useEffect(() => {
        socket.emit("join_room", room);
    }, [socket, room]);

    useEffect(() => {
        const receiveMessageHandler = (data) => {
            setMessageList((list) => [...list, data]);
        };

        socket.on('receive_message', receiveMessageHandler);
        return () => socket.off('receive_message', receiveMessageHandler);
    }, []);

    return (
        <div className="flex flex-col w-full max-w-md mx-auto bg-gray-900 rounded-xl shadow-lg p-4 text-gray-200">
            <div className="chat-header mb-4 border-b border-gray-700 pb-2">
                <p className="text-xl font-semibold text-teal-400">Live Chat Room: {room}</p>
            </div>
            <div className="chat-body flex-1 overflow-y-auto mb-4 space-y-2 h-80 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {messageList.map((msg, index) => (
                    <div key={index} className={`p-2 rounded-lg ${msg.author === username ? 'bg-teal-700 self-end text-right' : 'bg-gray-700 self-start'}`}>
                        <p className="text-sm text-gray-300">
                            <span className="font-bold text-teal-300">{msg.author}</span>: {msg.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                    </div>
                ))}
            </div>
            <div className="chat-footer flex space-x-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => { e.key === 'Enter' && sendMessage(); }}
                />
                <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white font-semibold shadow-md transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chat;
