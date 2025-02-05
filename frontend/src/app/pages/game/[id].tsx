import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

const GamePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const socket = io('http://localhost:3000');

    useEffect(() => {
        if (id) {
            socket.emit('joinGame', id);

            socket.on('message', (message: string) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [id]);

    const sendMessage = () => {
        if (input.trim()) {
            socket.emit('message', input);
            setInput('');
        }
    };

    return (
        <div>
            <h1>Game ID: {id}</h1>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default GamePage;
