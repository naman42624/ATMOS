const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema =mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    }
});



const otpModel = mongoose.model('otpModel', otpSchema)

module.exports = otpModel;