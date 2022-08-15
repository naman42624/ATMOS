const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = mongoose.Schema(
    {
        title: {
            type: String,
        },
        desc: {
            type: String,
        },
        userID: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        timestamps: true,
    }
);





const Note = mongoose.model('note', noteSchema)

module.exports = Note;
