const { io } = require('socket.io-client');

// Connect to your socket server
const socket = io('http://localhost:4000');

socket.on('connect', () => {
    console.log('Connected to server with ID:', socket.id);
    
    // Test joining as a user
    socket.emit('join', {
        userId: '507f1f77bcf86cd799439011', // Example user ID (replace with real ID)
        userType: 'user'
    });
    
    console.log('Sent join event for user');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('error', (error) => {
    console.log('Socket error:', error);
});

// Test captain location update
setTimeout(() => {
    socket.emit('update-location-captain', {
        userId: '507f1f77bcf86cd799439012', // Example captain ID
        location: {
            ltd: 23.8103,
            lng: 90.4125
        }
    });
    console.log('Sent location update for captain');
}, 2000);

// Keep the connection alive for testing
setTimeout(() => {
    socket.disconnect();
    console.log('Test completed');
    process.exit(0);
}, 5000);
