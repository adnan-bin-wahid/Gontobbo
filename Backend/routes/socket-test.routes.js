const express = require('express');
const router = express.Router();
const { sendMessageToSocketId } = require('../socket');

// Test endpoint to send socket message
router.post('/test-socket', (req, res) => {
    const { socketId, event, data } = req.body;
    
    if (!socketId || !event) {
        return res.status(400).json({ error: 'socketId and event are required' });
    }
    
    const messageObject = {
        event: event,
        data: data || {}
    };
    
    sendMessageToSocketId(socketId, messageObject);
    
    res.json({ 
        success: true, 
        message: `Message sent to socket ${socketId}`,
        event: event,
        data: data
    });
});

// Test endpoint to broadcast message
router.post('/test-broadcast', (req, res) => {
    const { event, data } = req.body;
    
    if (!event) {
        return res.status(400).json({ error: 'event is required' });
    }
    
    // You would need to implement broadcast functionality in socket.js
    res.json({ 
        success: true, 
        message: 'Broadcast functionality needs to be implemented',
        event: event,
        data: data
    });
});

module.exports = router;
