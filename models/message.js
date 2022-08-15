const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const msgSchema = new Schema({
    msg: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});
const Message = mongoose.model('Message', msgSchema);
module.exports = Message;
