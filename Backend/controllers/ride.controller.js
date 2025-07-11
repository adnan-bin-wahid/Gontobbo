const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');


module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide(req.user._id, pickup, destination, vehicleType);
        return res.status(201).json(ride);
    } catch (error) {
        console.error('Error creating ride:', error);
        return res.status(500).json({ message: 'Failed to create ride' });
    }
};
module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get parameters from query or body depending on request method
    const { pickup, destination, vehicleType } = req.method === 'POST' ? req.body : req.query;
    
    console.log(`Fare calculation request: method=${req.method}, pickup=${pickup}, destination=${destination}, vehicleType=${vehicleType || 'not specified'}`);

    try {
        const fare = await rideService.getFare(pickup, destination, vehicleType);
        console.log('Calculated fare:', fare);
        return res.status(200).json({ fare });
    } catch (error) {
        console.error('Error fetching fare:', error);
        return res.status(500).json({ message: 'Failed to fetch fare', error: error.message });
    }
};