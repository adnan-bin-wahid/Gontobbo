const express = require('express');
const router = express.Router();
const {body,query} = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');
router.post('/create', 
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3}).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3}).withMessage('Invalid destination address'),
    body('vehicleType').isIn(['auto', 'car', 'bike']).withMessage('Invalid vehicle type'),
    rideController.createRide
)

// GET endpoint with query parameters
router.get('/get-fare', 
    authMiddleware.authUser,
    query('pickup').isString().isLength({ min: 3}).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3}).withMessage('Invalid destination address'),
    query('vehicleType').optional().isIn(['auto', 'car', 'bike']).withMessage('Invalid vehicle type'),
    rideController.getFare
);

// POST endpoint with body parameters
router.post('/get-fare', 
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3}).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3}).withMessage('Invalid destination address'),
    body('vehicleType').optional().isIn(['auto', 'car', 'bike']).withMessage('Invalid vehicle type'),
    rideController.getFare
);


module.exports = router;