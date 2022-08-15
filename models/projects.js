const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    userId: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    projectName: {
        type: String,
        required: true
    },
    favorite: {
        type: Boolean,
        required: true
    },
    backGroundColor: {
        type: String,
        required: true
    },
    backgroundImage: {
        type: String,
        required: true
    },
    teamMembers: {
        type: Array,
        required: false
    },
    sectionList: [{
        type: Schema.Types.ObjectId,
        ref: 'Section'
    }]

},{timestamps: true});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;