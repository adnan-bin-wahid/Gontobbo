const axios = require('axios');
const { listIndexes } = require('../models/user.model');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinates = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Geocoding failed: ' + response.data.status);
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
}

module.exports.getDistanceAndTime = async (origin, destination) => {

  if (!origin || !destination) {
    return { error: 'Origin and destination are required' };
  }
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try{
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
    const data = response.data;

    if (data.status !== 'OK') {
      throw new Error(data.error_message || 'Failed to fetch distance and time');
    }

    const result = data.rows[0].elements[0];
    return {
      distance: {
        text: result.distance.text,
        value: result.distance.value
      },
      duration: {
        text: result.duration.text,
        value: result.duration.value
      }
    };

  }catch (error) {
    console.error('Error fetching distance and time:', error);
    return { error: 'Failed to fetch distance and time' };
  }

 
  
}

module.exports.getAutoCompleteSuggestions = async (input) => {
 if(!input) {
    return { error: 'query is required' };

  }
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
  try{
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
    const data = response.data;

    if (data.status !== 'OK') {
      throw new Error(data.error_message || 'Failed to fetch suggestions');
    }

    return data.predictions;
  

  }catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return { error: 'Failed to fetch suggestions' };
  }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
  // Since the location is stored as separate ltd/lng fields, we'll use a different approach
  // Convert radius from km to degrees (approximately)
  const radiusInDegrees = radius / 111; // 1 degree ≈ 111 km
  
  const captains = await captainModel.find({
    // Check if captain has location data
    'location.ltd': { $exists: true, $ne: null },
    'location.lng': { $exists: true, $ne: null },
    // Simple bounding box query (not as accurate as geospatial but will work)
    'location.ltd': {
      $gte: ltd - radiusInDegrees,
      $lte: ltd + radiusInDegrees
    },
    'location.lng': {
      $gte: lng - radiusInDegrees,
      $lte: lng + radiusInDegrees
    },
    // Only include captains with socketId and active status
    socketId: { $exists: true, $ne: null },
    status: 'active'
  });
  
  console.log(`Searching for captains near [${lng}, ${ltd}] with radius ${radius}km`);
  console.log(`Found ${captains.length} active captains with socketId`);
  
  return captains; 
}