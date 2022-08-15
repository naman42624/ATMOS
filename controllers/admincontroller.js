const User = require('../models/user');
const Project = require('../models/projects');
const Message = require('../models/message');

module.exports.deleteUser = (req,res) =>{
    return User.findByIdAndRemove(req.params.id)
    .then((user) => {
        res.redirect('/admin');
        return user;
    })
    .catch((err) => {
        console.log(err);
    });
}

