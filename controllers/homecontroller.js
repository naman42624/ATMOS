const jwt = require('jsonwebtoken');
const User = require("../models/user");
const Project = require('../models/projects');
const Section = require('../models/sections');
const ObjectId = require('mongodb').ObjectId; 

async function getUserDetails (req,res){
    let token = req.cookies.jwt;
    
    if(token) {
        const userDetails = await jwt.verify(token, 'ATMOS', async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                return 1;
            }
            else{
                // console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                // console.log("from getUserDetails: ")
                // console.log(user);
                return user;
            }
        })
        return userDetails;
    }
    else{
        return 1;
    }
    
    
}



async function get_project_for_home(req,res){
    
    

    
}

module.exports.get_home = async (req,res) => {

    
    const user = await getUserDetails(req,res);
    // console.log("this is user id: ");
    // console.log(user);
    
    const allFavoriteProjects = Project.find({userId: user.id, favorite: true})
            // .then(async (result2) => {
            //         // for(let i=0;i<result2.sectionList.length;i++){
            //         //     // let section = Section.findById({})
            //         // }
            // } )
            .then((result) => {
                console.log("List of favorite project");
                console.log(result);
                res.render("home-index", {user: user, projectList: result, taskList: []});
                     
            })
            .catch((err) => {console.log(err)});
}