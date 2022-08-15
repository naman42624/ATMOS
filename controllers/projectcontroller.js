const jwt = require('jsonwebtoken');
const User = require("../models/user");
const Project = require('../models/projects');
const Section = require('../models/sections');
const ObjectId = require('mongodb').ObjectId; 

let imagesForProjectIcon = ["https://img.icons8.com/color-glass/48/000000/list.png",
                            "https://img.icons8.com/color-glass/48/000000/generic-sorting.png",
                            "https://img.icons8.com/color-glass/48/000000/deezer.png",
                            "https://img.icons8.com/fluency/48/000000/deezer.png",
                            "https://img.icons8.com/color/48/000000/bulleted-list.png"];

let colorPallet = ["#f16b6a","#4573d2","#f1bc6d","#5da283","#f36eb2","#f16a6b","#7db387","#8c85e8","#6d6f6e"];


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

function getBackgroundImage(){
    let random = Math.floor(Math.random() * imagesForProjectIcon.length);
    return imagesForProjectIcon[random];
}
function getBackgroundColor(){
    let random = Math.floor(Math.random() * imagesForProjectIcon.length);
    return colorPallet[random];
}



module.exports.get_project = async (req,res) => {
    
    const user = await getUserDetails(req,res);
    // console.log("this is user id: ");
    // console.log(user);
    
    const allProjects = Project.find({userId: user.id})
            .then((result) => {
                console.log("Result from projects: ")
                console.log(result);
                res.render("projects-index", { projectList: result });          
            })
            .catch((err) => {console.log(err)});

    
}

module.exports.get_add_project = async (req, res) => {

        
    const user = await getUserDetails(req,res);
    // console.log("get add project user");
    // console.log(user);

    const project = new Project({
        userId: user._id,
        projectName: "FSD Project",
        favorite: false,
        backGroundColor: `${getBackgroundColor()}`,
        backgroundImage: `${getBackgroundImage()}`,
        teamMembers: [user._id],
        sectionList: []
    });

    project.save()
        .then((result) => {
            const allProjects = Project.find({userId: user.id})
                .then((result) => {
                    const allProjectList = result;
                    console.log(allProjectList);
                })
                .catch((err) => {consol.log(err)});
            
            res.render("projects-index", {projectList: allProjectList});
            console.log("project Added");
            
        })
        .catch((err) => {console.log(err)});

}

module.exports.post_add_project = async (req,res) => {

    const user = await getUserDetails(req,res);
    // console.log("post add project user");
    // console.log(user);

    const project = new Project({ 
        userId: user._id,
        projectName: req.body.projectName,
        favorite: false,
        backGroundColor: `${getBackgroundColor()}`,
        backgroundImage: `${getBackgroundImage()}`,
        teamMembers: [user._id],
        sectionList: []
    });

    project.save()
        .then((result) => {
            console.log("Saved The new Project Into database: " );
            console.log(result);
            res.json({
                redirect: '/projects',
                project: project._id                 
            });
            
        })
        .catch((err) => {console.log(err)});

    User.findById(user._id)
    .then(async (result) => {
        const projectList = result.projectListID;
        projectList.push(project._id);
        
        const updatedUser = await User.findByIdAndUpdate(user._id,{projectListID: projectList},{new:true})
            .then((result3)=>{console.log(result3)});
    })
    .catch((err)=> console.log(err));

}

module.exports.post_delete_project = async (req,res) =>  {
    // const projectID = req.params.projectURLID;

    

    let projectID = req.body.projectID;
    projectID = ObjectId(projectID);


    Project.findById(projectID)
        .then(async (result1) => {
            const sectionList = result1.sectionList;
            console.log("section list inside for loop");
            console.log(sectionList);

            const section = await Section.deleteMany({_id: {$in: sectionList}});

            // const project1 = await Project.findByIdAndUpdate

            
        })
        .then(
            async (result2) => {
                const project = await Project.findByIdAndDelete({_id: projectID})
                // .then( async (result)=>{
                //     await res.redirect("/projects");
                // })
                // .catch((err)=> {console.log(err)}); 
            }
        )
        .then(
            async (result3) => {
                const user = await getUserDetails(req,res);
                let oldProjectList = user.projectListID;
                let projectIndex = oldProjectList.indexOf(projectID);
                oldProjectList.splice(projectIndex, 1);
                console.log(oldProjectList);

                const userAgain = await User.findByIdAndUpdate({_id: user._id},{projectListID: oldProjectList},{new: true});
                const userIsBack = await getUserDetails(req,res);
                console.log("The user's projectList is also updated");
                console.log(userIsBack);
        })
        .then(
            async (result4) => {
                res.json({redirect:"/projects"});
            }
        )


    

}
module.exports.get_add_favorite_project = async (req,res) =>  {
    let projectID = req.params.projectIDURL;
    projectID = new ObjectId(projectID);
    let favBool = true;

    await Project.findById(projectID)
        .then((result1) => {
            if(result1.favorite == true){
                favBool = false;
            }
        })
        .then(
            async (result2) => {
            const project = await Project.findByIdAndUpdate({_id: projectID},{favorite:favBool},{new:true})
                        .then((result)=>{
                            console.log("Project is added to favorites");
                            console.log(result);
                            res.redirect("/projects");
                        });
                    }
        );

    

}

module.exports.get_redirected_to_project = (req,res) => {
    res.redirect('/projects');
}