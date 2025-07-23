const express = require('express');
const router = express.Router();
const captainModel = require('../models/captain.model');
const userModel = require('../models/user.model');

// Debug endpoint to check captains
router.get('/captains', async (req, res) => {
    try {
        const captains = await captainModel.find({}).select('fullname email status socketId location');
        res.json({
            total: captains.length,
            captains: captains.map(c => ({
                id: c._id,
                name: c.fullname,
                email: c.email,
                status: c.status,
                socketId: c.socketId,
                location: c.location,
                hasLocation: !!(c.location && c.location.ltd && c.location.lng),
                hasSocketId: !!c.socketId
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Debug endpoint to check users
router.get('/users', async (req, res) => {
    try {
        const users = await userModel.find({}).select('fullname email socketId');
        res.json({
            total: users.length,
            users: users.map(u => ({
                id: u._id,
                name: u.fullname,
                email: u.email,
                socketId: u.socketId,
                hasSocketId: !!u.socketId
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Debug endpoint to check active captains with location
router.get('/active-captains', async (req, res) => {
    try {
        const activeCaptains = await captainModel.find({
            status: 'active',
            socketId: { $exists: true, $ne: null },
            'location.ltd': { $exists: true, $ne: null },
            'location.lng': { $exists: true, $ne: null }
        }).select('fullname email status socketId location');
        
        res.json({
            total: activeCaptains.length,
            captains: activeCaptains.map(c => ({
                id: c._id,
                name: c.fullname,
                email: c.email,
                status: c.status,
                socketId: c.socketId,
                location: c.location
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Debug endpoint to activate a captain
router.patch('/activate-captain/:captainId', async (req, res) => {
    try {
        const { captainId } = req.params;
        const captain = await captainModel.findByIdAndUpdate(
            captainId, 
            { status: 'active' }, 
            { new: true }
        ).select('fullname email status socketId location');
        
        if (!captain) {
            return res.status(404).json({ error: 'Captain not found' });
        }
        
        res.json({
            message: 'Captain activated successfully',
            captain: {
                id: captain._id,
                name: captain.fullname,
                email: captain.email,
                status: captain.status,
                socketId: captain.socketId,
                location: captain.location,
                hasLocation: !!(captain.location && captain.location.ltd && captain.location.lng),
                hasSocketId: !!captain.socketId
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
