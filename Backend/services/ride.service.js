const rideModel = require('../models/ride.model');
const mapService = require('../services/maps.service');
const crypto = require('crypto');

function getOTP(num){
   
    const digits = Number(num);
    const min = Number(Math.pow(10, digits - 1));
    const max = Number(Math.pow(10, digits));
    
    // Alternative approach for safety
    if (digits === 6) {
        return crypto.randomInt(100000, 1000000);
    } else if (digits === 4) {
        return crypto.randomInt(1000, 10000);
    } else {
        // Fallback for other digit counts
        return crypto.randomInt(min, max);
    }
}

async function getFare(pickup, destination, vehicleType = null){

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required to calculate fare');
    }

    try {
        const distanceTime = await mapService.getDistanceAndTime(pickup, destination);

        // Get distance in meters and convert to kilometers
        const distanceInKm = distanceTime.distance.value / 1000;
        
        if (isNaN(distanceInKm) || distanceInKm <= 0) {
            throw new Error('Unable to calculate distance for fare calculation');
        }

        // Define base fares and per km rates
        const fareRates = {
            auto: { base: 100, perKm: 12 },
            car: { base: 200, perKm: 20 },
            bike: { base: 70, perKm: 10 }
        };

        // Calculate fares for each vehicle type or just the requested one
        if (vehicleType && fareRates[vehicleType]) {
            // If specific vehicle type is requested, return only that fare
            return {
                [vehicleType]: Math.round(fareRates[vehicleType].base + (distanceInKm * fareRates[vehicleType].perKm))
            };
        } else {
            // Otherwise return all fares
            return {
                auto: Math.round(fareRates.auto.base + (distanceInKm * fareRates.auto.perKm)),
                car: Math.round(fareRates.car.base + (distanceInKm * fareRates.car.perKm)),
                bike: Math.round(fareRates.bike.base + (distanceInKm * fareRates.bike.perKm))
            };
        }
    } catch (error) {
        console.error('Error in fare calculation:', error);
        throw error;
    }
}
module.exports.getFare = getFare;

module.exports.createRide = async (user, pickup, destination, vehicleType) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('User, pickup, destination, and vehicle type are required to create a ride');
    }
    
    const fare = await getFare(pickup, destination);

    const ride = new rideModel({
        user,
        pickUp: pickup,
        destination,
        otp: getOTP(6), // Generate a 6-digit OTP
        fare: fare[vehicleType],
    });
    
    await ride.save();
    return ride;
}

module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}

module.exports.endRideCaptain = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    // Set status to indicate captain has finished but waiting for payment
    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed-by-captain'
    })

    return ride;
}

module.exports.endRideUser = async ({ rideId, user }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        user: user._id
    }).populate('user').populate('captain');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'completed-by-captain') {
        throw new Error('Captain has not completed the ride yet');
    }

    // Final completion after payment
    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}