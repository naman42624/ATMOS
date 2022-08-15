
// function changeDisplay(projectNumber){

//     $(function(){
//         $(`#project-btn-${projectNumber}`).hover(function() {
//           $(`#project-favorite-${projectNumber}`).addClass('project-function-0-hovered');
//           $(`#project-options-${projectNumber}`).addClass('project-function-1-hovered');
//         }, function() {
//           $(`#project-favorite-${projectNumber}`).removeClass('project-function-0-hovered');
//           $(`#project-options-${projectNumber}`).removeClass('project-function-1-hovered');
//         })
//       });
// }

function createNewProjectDiv(){
    getModalForNewProject(callNumber=1);
}

function getModalForNewProject(callNumber = 0){

    var modal = document.querySelector(".project-modal-div");

    // Get the <span> element that closes the modal
    var span = document.querySelector(".project-name-input");

    // When the user clicks the button, open the modal 
    if(callNumber == 1){
        modal.style.display = "block";
    }
    
    // When the user clicks on <span> (x), close the modal
    span.onkeypress = function(event) {
        if(event.key == "Enter"){
            saveProjectName();
            // createProjectDiv(projectList.length-1);
            modal.style.display = "none";
        }
              
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }
}

async function saveProjectName(){
    const newProjectName = document.querySelector(".project-name-input").value;

    const data = {
        projectName: newProjectName,
    };

    try{
        const result = await fetch('/add-project',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const response = await result.json();
        if(response.project){
            console.log(response.project);
            location.assign('/projects', {projectList: response.project});
        }

    }
    catch(err) {console.log(err)};



}


async function deleteProject(event){

    const projectID = event.target.id.split("-")[2];
    console.log(projectID);

    try{
        const result = await fetch('/delete-project',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({projectID})
        });

        const response = await result.json();
        console.log(response.redirect);
        if(response.redirect){
            console.log(response.redirect);
            location.assign(response.redirect);
        }

    }
    catch(err) {console.log(err)};
}



