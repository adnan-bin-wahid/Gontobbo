const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;

  try {
    const coordinates = await mapService.getAddressCoordinates(address);
    return res.status(200).json(coordinates);
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return res.status(404).json({message: 'Coordinates not found'})
  }
}

module.exports.getDistanceAndTime = async (req, res,next) => {
 try{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { origin, destination } = req.query;  
  const distanceAndTime = await mapService.getDistanceAndTime(origin, destination);
  res.status(200).json(distanceAndTime);

 }catch (error) {
    console.error('Error fetching distance and time:', error);
    return res.status(500).json({ message: 'Failed to fetch distance and time' });
  }
}