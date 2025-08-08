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

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide
)

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide
)

router.post('/end-ride-captain',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRideCaptain
)

router.post('/end-ride-user',
    authMiddleware.authUser,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRideUser
)

module.exports = router;

module.exports = router;