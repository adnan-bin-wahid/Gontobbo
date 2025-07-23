import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io(`${import.meta.env.VITE_BASE_URL}`); // Replace with your server URL

const SocketProvider = ({ children }) => {
    useEffect(() => {
        // Basic connection logic
        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Add debugging for all socket events
        socket.onAny((eventName, ...args) => {
            console.log('Socket received event:', eventName, args);
        });

        return () => {
            socket.offAny();
        };
    }, []);



    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;