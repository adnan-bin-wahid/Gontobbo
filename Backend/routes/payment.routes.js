const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create-intent',
    authMiddleware.authUser,
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('currency').optional().isString(),
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    paymentController
);

module.exports = router;
