const Task = require('../models/tasks');
const User = require('../models/user');
const Section = require('../models/sections');
const Project = require('../models/projects');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId; 


module.exports.get_task = (req,res) => {
    // console.log('inside get_task ');
    const projectURLID = req.params.projectURLID;

    Project.findById(projectURLID)
        .then((projectResult) => {
            // console.log(projectResult);
            const projectID = projectResult._id;
            Section.find({projectID: projectID})
                .then((sectionResult) => {
                    // console.log(sectionResult);
                res.render("task-index", {sectionList: sectionResult, projectID: projectURLID, projectName: projectResult.projectName});
                })
                .catch((err) => {console.log(err)});
        })
        .catch((err) => {console.log(err)}); 
}


module.exports.get_overview = (req, res) => {

    const projectURLID = req.params.projectURLID;

    Project.findById(projectURLID)
        .then((projectResult) => {
            // console.log(projectResult);
            const projectID = projectResult._id;
            Section.find({projectID: projectID})
                .then((sectionResult) => {
                    console.log("Section List: ");
                    console.log(sectionResult);

                    let taskIncompleteCount=0;
                    let taskCount=0;
                    for(let i=0;i<sectionResult.length;i++){
                        let taskListTemp = sectionResult[i].taskList;
                        for(let j=0;j<taskListTemp.length;j++){
                            taskCount++;
                            if(taskListTemp[j].taskCompletion == false){
                                taskIncompleteCount++;
                            }
                        } 
                    }



                    res.render("overview-index", {projectID, projectName: projectResult.projectName, projectList:projectResult, taskTotal: taskCount, taskIncompleteCount});
                })
                .catch((err) => {console.log(err)});
        })
        .catch((err) => {console.log(err)}); 
	
}


module.exports.get_add_section = (req,res) => {

   // console.log(req.params);
const projectURLID = req.params.projectURLID;
// console.log("in get_add_section this is the rpoject id: " + projectURLID);
Project.findById(projectURLID)
    .then((projectResult) => {
        // console.log(projectResult);
        const section = new Section({

            projectID: projectResult._id,
            sectionName: "",
            taskList: []
        })

        section.save()
        .then((result) => {
            console.log("result from add-section");
            console.log(projectResult);
            const updatedSectionList = projectResult.sectionList;
            updatedSectionList.push(result._id);
            console.log("updated Section List: ");
            console.log(updatedSectionList);
            console.log(result._id);

            Project.findByIdAndUpdate(projectURLID, {sectionList: updatedSectionList}, {new: true})
            .then(async (resultOFProject)=>{
                // console.log(projectResult._id);
                const allSection = Section.find({projectID: projectResult._id})
                .then((result) => {
                    // console.log(result);
                    const allSectionList = result;
                    res.redirect("/task/"+projectResult._id);
                    res.render('task-index', {sectionList: allSectionList, projectID: projectURLID });
                    console.log("Section added");
                })
                .catch((err) => {
                    console.log('err gen from here: ')
                    console.log(err);
                })
            })   
            
        })
    })
    .catch((err) => {
        console.log('errors are gen from get_add_section');
        console.log(err)});
}


module.exports.get_add_new_task = (req,res) => {
    
    const sectionID = req.body.sectionID;
    // console.log(req.body);
    var section_id = new ObjectId(sectionID);
    // console.log(section_id);
    Section.findById({_id: section_id})
        .then((result) => {
            // console.log('got result, inside get_add_new_task')
            // console.log(result);
            res.json({
                sectionDetail: result
            })
        })
        .catch((err)=> {            
            console.log('inside get_add_new_task');
            console.log(err);});
}

module.exports.get_update_task = async (req,res) => {
    
    const sectionDetail = req.body;
    const sectionId = req.params.sectionURLID;
    const sectionID = new ObjectId(sectionId);
    sectionDetail.taskList[sectionDetail.taskList.length-1].taskCompletion = false;

    

    let section = await Section.findByIdAndUpdate({_id: sectionID},{sectionName: sectionDetail.sectionName, taskList: sectionDetail.taskList},{
        new: true
    })
    .then( async (section) => {
        const projectURLID = section.projectID;
        const allSection =  await Section.find({projectURLID})
        .then((result) => {
            // console.log(result);
            const allSectionList = result;
            res.json({
                redirect: '/task/' + projectURLID,
                sectionList: allSectionList                               
            });
            console.log("Updated Section");
        })
        .catch((err) => {
            console.log(err);
        })
    })
    .catch((err) => {console.log(err)});


}

module.exports.post_updated_section_name = async (req,res) => {

    const updateSectionName = req.body.updateSectionName;
    // console.log(updateSectionName);
    const sectionURLID = req.params.sectionURLID;

    const section = await Section.findByIdAndUpdate({_id: sectionURLID},{sectionName: updateSectionName},{
        new: true
    })
    .then((result) => {
        res.json({
            redirect: '/task/'+ result.projectID
        });
    })
    .catch((err) => {console.log(err)});

    // console.log(section);

}

module.exports.post_delete_task = async (req,res) => {
    const deleteTaskNumber = req.body.taskNumber;
    const sectionURLID = req.params.sectionURLID;

    // console.log("inside post_delete_task", deleteTaskNumber,sectionURLID);

    const sectionDetail = await Section.findById(sectionURLID);
    sectionDetail.taskList.splice(deleteTaskNumber,deleteTaskNumber+1);
    
    const section = await Section.findByIdAndUpdate({_id: sectionURLID},{taskList: sectionDetail.taskList},{
        new:true
    })
    .then((result) => {
        res.json({
            redirect: '/task/'+ sectionDetail.projectID
        });
    })
    .catch((err)=> {console.log(err)});
    

    
}

module.exports.get_delete_section = async (req,res) => {
    let sectionID = req.params.sectionURLID;
    sectionID = new ObjectId(sectionID);
    
   //delete section
    const section = await Section.findByIdAndDelete({_id: sectionID});
    console.log(section);


    //delete it from project's sectionList
    const project = await Project.findById(section.projectID)
    .then( async (result) => {
        let sectionList = result.sectionList;
        let sectionIndex = sectionList.indexOf(sectionID);
        sectionList.splice(sectionIndex,1);

        const project2 = await Project.findByIdAndUpdate({_id: section.projectID},{sectionList: sectionList},{new: true});
    })


    //return
    res.redirect("/task/62657eec2816e468319e3006");

}

// module.exports.get_add_section_to_right = async (req,res) => {
//     let sectionID = req.params.sectionURLID;
//     sectionID = new ObjectId(sectionID);
    
//     const section = await Section.findById(sectionID)
//     .then( async (result) => {
//         const project = Project.findById(result.projectID)
//         .then(async (result2) => {
//             const sectionNew = new Section({

//                 projectID: result2._id,
//                 sectionName: "",
//                 taskList: []
//             });
    
//             await sectionNew.save()
//             .then( async (result3) => {

//                 let sectionList = result2.sectionList;
//                 let sectionIndex = sectionList.indexOf(sectionID);
//                 sectionList.splice(sectionIndex, 0, sectionNew._id);

//                 const updatedProject = await Project.findByIdAndUpdate({_id: result2._id}, {sectionList: sectionList}, {new: true});

//             });            
//         })
//         .then(async (result4) => {
//             res.redirect("/task/"+ result.projectID);
//         })
//     })
// }

// module.exports.get_add_section_to_left = async (req,res) => {}
