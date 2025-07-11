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

