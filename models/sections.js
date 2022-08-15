const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const taskSchema = new Schema({
    // sectionId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Section',
    //     required: true
    // },
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    // projectId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Project',
    //     required: true
    // },
    taskName: {
        type: String,
        required: true
    },
    taskCompletion: {
        type: Boolean,
        required: true
    },
    taskAssingedTo: {
        type: String
    },
    taskDeadline: {
        type: Date
    },
    taskPriority: {
        type: String
    },
    taskStatus: {
        type: String
    },
    taskDescription: {
        type: String

    }
},{timestamps: true});

const sectionSchema = new Schema({
    projectID: [{
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }],
    sectionName: {
        type: String
    },
    taskList: [taskSchema]

},{timestamps: true}); 

const Section = mongoose.model('Section', sectionSchema);
module.exports = Section;