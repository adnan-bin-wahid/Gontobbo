const mongoose = require('mongoose');


const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Changed from 'user' to 'User' to match the registered model name
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
      
    },
    pickUp: {
        type: String,
        required: true
    },
    destination: {  
        type: String,
        required: true
    },
    fare :{
        type: Number,
        required: true
    },
    status: {
        type: String,   
        enum: ['pending', 'accepted','ongoing','completed', 'cancelled'],
        default: 'pending'
    },
    duration: {
        type: Number  
    },
    distance: {
        type: Number
    },
    paymentId: {
        type: String,
    },
    orderId:{
        type: String
    },
    signature: {
        type: String
    },
    otp: {
        type: String,
        select: false, // Do not select OTP by default
        required: true
    },

})

module.exports = mongoose.model('ride', rideSchema);

