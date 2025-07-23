const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide(req.user._id, pickup, destination, vehicleType);
        
        console.log('Ride created:', ride);
        
        const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
        console.log('Pickup coordinates:', pickupCoordinates);

        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);
        console.log('Captains in radius:', captainsInRadius.length);
        console.log('Captain details:', captainsInRadius.map(c => ({ id: c._id, socketId: c.socketId, status: c.status, location: c.location })));

        ride.otp = ""

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
        console.log('Ride with user populated successfully');

        captainsInRadius.map(captain => {
            console.log(`Sending new-ride event to captain ${captain._id} with socketId: ${captain.socketId}`);
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })
        })
        
        res.status(201).json(ride);

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

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } 
}