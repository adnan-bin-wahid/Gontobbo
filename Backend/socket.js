const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`Join event received: userId=${userId}, userType=${userType}, socketId=${socket.id}`);

            if (userType === 'user') {
                const result = await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                console.log('Updated user socketId:', result ? 'success' : 'failed');
            } else if (userType === 'captain') {
                // Update both socketId and set status to active
                const result = await captainModel.findByIdAndUpdate(userId, { 
                    socketId: socket.id,
                    status: 'active'
                });
                console.log('Updated captain socketId and status:', result ? 'success' : 'failed');
                if (result) {
                    console.log(`Captain ${userId} is now active with socketId: ${socket.id}`);
                }
            }
        });


        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            
            // Set captain status to inactive when they disconnect
            try {
                const captain = await captainModel.findOneAndUpdate(
                    { socketId: socket.id },
                    { status: 'inactive', socketId: null }
                );
                if (captain) {
                    console.log(`Captain ${captain._id} set to inactive on disconnect`);
                }
                
                const user = await userModel.findOneAndUpdate(
                    { socketId: socket.id },
                    { socketId: null }
                );
                if (user) {
                    console.log(`User ${user._id} socketId cleared on disconnect`);
                }
            } catch (error) {
                console.error('Error handling disconnect:', error);
            }
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {

    console.log('sendMessageToSocketId called with:', { socketId, messageObject });

    if (io) {
        console.log(`Emitting event '${messageObject.event}' to socket ${socketId}`);
        io.to(socketId).emit(messageObject.event, messageObject.data);
        console.log('Event emitted successfully');
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };