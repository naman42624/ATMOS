const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        lastname: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        password: {
            type: String,
            required: true,
            min: 8,
        },
        phone : {
            type: String,
            required: true,
            min: 8,
            max: 15,
            unique: true,
        },
        projectListID: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'Project' 
        }]
    },
    {
        timestamps: true,
    }
);


userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});

    if(user){
        const passKey = user.password; 
        if( passKey == password){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}



const User = mongoose.model('User', userSchema)

module.exports = User;