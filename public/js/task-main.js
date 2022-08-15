sectionDetail = {
    'sectionName': '',
    'taskList': []
}



function getDropdownForSection(sectionNumber,event){

}




async function updateSectionNameData(event){
    console.log(event);
    let sectionNumber = event.target.id.split("-")[2];
    let sectionNameInput = event.target.value;
        
    const result = await fetch('/update-section/'+ sectionNumber,{
        method: 'POST',
        body: JSON.stringify({updateSectionName: sectionNameInput}),
        headers: {'Content-Type': 'application/json'}
    });

    const response = await result.json();
    if(response.redirect){
        location.assign(response.redirect);
    }

}

function updateTaskCompletionData(event){
    sectionNumber = event.target.id.split("-")[1];
    taskNumber = event.target.id.split("-")[2];

    if(projectList[0].sectionList[sectionNumber].tasks.taskCompletion == "true")
        projectList[0].sectionList[sectionNumber].tasks.taskCompletion = "false";
    else if(projectList[0].sectionList[sectionNumber].tasks.taskCompletion == "false")
        projectList[0].sectionList[sectionNumber].tasks.taskCompletion = "true";

}

function createNewTask(sectionNumber, taskNumber, sectionDetail){

    sectionDetail.taskList[taskNumber] = {
        taskName: "",
        taskCompletion: "",
        taskAssingedTo: "",
        taskDeadline: "",
        taskPriority: "",
        taskStatus: "",
        taskDescription: ""
    }
        
    let task_div_li = document.createElement("li");
    task_div_li.setAttribute("id", `output-list-input-${taskNumber}`);
    task_div_li.setAttribute("class","output-list");
    let windowOutput = getCardWindow(sectionNumber,taskNumber, sectionDetail);
    task_div_li.innerHTML = windowOutput;
    document.querySelector(`#section-output-list-${sectionNumber}`).appendChild(task_div_li);
    console.log(task_div_li);
    getModal(sectionNumber,taskNumber,1, sectionDetail);   
}

function createTaskCard(sectionNumber,taskNumber, sectionDetail){
    let task_input = `
        <div id = "task-card-${sectionNumber}-${taskNumber}" class = "card ${sectionDetail.taskList[taskNumber]['taskCompletion'] == "true" ? "card-checked" : ""}" onclick = "getModal(${sectionNumber},${taskNumber})">
            <div class = "card-tick-input-add">
                <div class="round">
                    <input type="checkbox" ${sectionDetail.taskList[taskNumber]['taskCompletion'] == "true" ? "checked" : ""} onchange = "updateTaskCompletionData(event)" id="checkbox-${sectionNumber}-${taskNumber}">
                    <label for="checkbox-${sectionNumber}-${taskNumber}"></label>
                </div>
                <div class = "card-input-add-div">
                    <input id = "section-${sectionNumber}-card-input-${taskNumber}" class = "card-input-add-input" type = "text" value = "${sectionDetail.taskList[taskNumber].taskName}">
                    <img id = "section-${sectionNumber}-card-add-${taskNumber}" class = "card-input-add-add-icon" onclick = "deleteTask(${sectionNumber},${taskNumber})" src="https://img.icons8.com/ios-glyphs/30/000000/filled-trash.png"/>
                </div>
            </div>
                <div class = "card-status-priority">
                    <p id = "section-${sectionNumber}-card-status-${taskNumber}" class = "card-status">${sectionDetail.taskList[taskNumber].taskStatus}</p>
                    <p id = "section-${sectionNumber}-card-priority-${taskNumber}" class = "card-priority">${sectionDetail.taskList[taskNumber].taskPriority}</p>
                </div>
                <div class = "card-collab-deadline">
                    <img id = "section-${sectionNumber}-card-collab-${taskNumber}" class = "card-collaborators-image" src="data:image/png;base64,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">
                    <p id = "section-${sectionNumber}-card-deadline-${taskNumber}" class = "card-deadline">${sectionDetail.taskList[taskNumber].taskDeadline}</p>
                </div>              
        </div>

        
    `;
    console.log(task_input);
    let task_div_li = document.createElement("li");
    task_div_li.setAttribute("id", `output-list-input-${taskNumber}`);
    task_div_li.setAttribute("class","output-list");
    windowOutput = getCardWindow(sectionNumber, taskNumber);
    task_div_li.innerHTML = task_input + windowOutput;
    document.querySelector(`#section-output-list-${sectionNumber}`).appendChild(task_div_li);
    
    console.log(document.querySelector(`#section-output-list-${sectionNumber}`).innerHTML);

}
   
function getCardWindow(sectionNumber,taskNumber, sectionDetail){
    let windowOutput = `
    <div id="${sectionNumber}-${taskNumber}-display-modal" class="modal-task">
        <div id = "${sectionNumber}-${taskNumber}-display" class = "modal-content-task task-display">
                <div class = "additional-functionality">
                    <button id = "back-btn-${sectionNumber}-${taskNumber}" class = "close-modal back-btn">Back</button>
                </div>
                <div class = "taskname">
                    <input id = "taskname-${sectionNumber}-${taskNumber}" class = "taskname-input" type = "text" value = "${sectionDetail.taskList[taskNumber].taskName}" placeholder = "Enter Task Name...">
                </div>
                <div class = "taskinfo">
                    <table class = "taskinfo-table">
                        
                        <tr class = "taskinfo-table-row">
                            <td class = "taskinfo-table-data-0"><label class = "assign-label" for = "taskinfo-assignee-${sectionNumber}-${taskNumber}">Assignee</label></td>
                            <td class = "taskinfo-table-data-1"><input id = "taskinfo-assignee-${sectionNumber}-${taskNumber}" class = "assign-input" type = "text" value = "${sectionDetail.taskList[taskNumber].taskAssingedTo}"></td>
                        </tr>
                        <tr class = "taskinfo-table-row">
                            <td class = "taskinfo-table-data-0"><label class = "deadline-label" for = "taskinfo-deadline-${sectionNumber}-${taskNumber}">Deadline</label></td>
                            <td class = "taskinfo-table-data-1"><input id = "taskinfo-deadline-${sectionNumber}-${taskNumber}" class = "deadline-input" type="date" value = "${sectionDetail.taskList[taskNumber].taskDeadline}"></td>
                        </tr>
                        <tr class = "taskinfo-table-row">
                            <td class = "taskinfo-table-data-0"><label class = "sectionName-label" for = "taskinfo-sectionName-${sectionNumber}-${taskNumber}">sectionName</label></td>
                            <td class = "taskinfo-table-data-1"><input id = "taskinfo-sectionName-${sectionNumber}-${taskNumber}" class = "sectionName-input" type="" value = "${sectionDetail.sectionName}"></td>
                        </tr>
                        <tr class = "taskinfo-table-row">
                            <td class = "taskinfo-table-data-0"><label class = "priority-label" for = "taskinfo-priority-${sectionNumber}-${taskNumber}">Priority</label></td>
                            <td class = "taskinfo-table-data-1">
                                <select class = "priority-input" name="taskinfo-priority-${sectionNumber}-${taskNumber}" id="taskinfo-priority-${sectionNumber}-${taskNumber}" value = "${sectionDetail.taskList[taskNumber].taskPriority}">
                                   
                                    <option value = "null">Choose Priority</option>
                                    <option value="High" ${sectionDetail.taskList[taskNumber]['taskPriority'] == "High" ? "selected" : ""}>High</option>
                                    <option value="Medium" ${sectionDetail.taskList[taskNumber]['taskPriority'] == "Medium" ? "selected" : ""}>Medium</option>
                                    <option value="Low" ${sectionDetail.taskList[taskNumber]['taskPriority'] == "Low" ? "selected" : ""}>Low</option>
                                </select>
                            </td>
                        </tr>
                        <tr class = "taskinfo-table-row">
                            <td class = "taskinfo-table-data-0"><label class = "status-label" for = "taskinfo-status-${sectionNumber}-${taskNumber}">Status</label></td>
                            <td class = "taskinfo-table-data-1">
                                <select class = "status-input" name="taskinfo-status-${sectionNumber}-${taskNumber}" id="taskinfo-status-${sectionNumber}-${taskNumber}">
                                    <option value = "Choose Status">Choose Status</option>
                                    <option value = "On-Track" ${sectionDetail.taskList[taskNumber]['taskStatus'] == "On-Track" ? "selected" : "" }>On-Track</option>
                                    <option value = "At-Risk" ${sectionDetail.taskList[taskNumber]['taskStatus'] == "At-Risk" ? "selected" : "" }>At-Risk</option>
                                    <option value = "Off-Track" ${sectionDetail.taskList[taskNumber]['taskStatus'] == "Off-Track" ? "selected" : "" }>Off-Track</option>
                                </select>
                            </td>
                        </tr>
                        <tr class = "taskinfo-table-row">
                            <td class = "taskinfo-table-data-0"><label class = "description-label" for = "taskinfo-description-${sectionNumber}-${taskNumber}">Description</label></td>
                            <td class = "taskinfo-table-data-1"><textarea id = "taskinfo-description-${sectionNumber}-${taskNumber}" class = "description-input">${sectionDetail.taskList[taskNumber].taskDescription}</textarea></td>
                        </tr>
                    </table>
                </div>
                <button class = "add-subtask">Add Subtask</button>
                <button class = "message">Message</button>
            </div>
    </div>
    `;
    return windowOutput;
}
 
function getModal(sectionNumber,taskNumber, callNumber = 0, sectionDetail = {}){
    
    let modalId = sectionNumber + "-" + taskNumber + "-display-modal";
    let cardId =  "task-card-" + sectionNumber + "-" + taskNumber;
    let backBtnId = "back-btn-" +  sectionNumber + "-" + taskNumber;
    if(callNumber == 1){
        cardId = "section-add-btn-" + sectionNumber;
    }
    console.log(modalId);
    console.log(cardId);
    console.log(backBtnId);
//modal javascript part

// Get the modal
var modal = document.getElementById(modalId);

// Get the button that opens the modal
var btn = document.getElementById(cardId);

// Get the <span> element that closes the modal
var span = document.getElementById(backBtnId);

// When the user clicks the button, open the modal 
if(callNumber == 1){
    modal.style.display = "block";
}
else{
btn.onclick = function() {
  modal.style.display = "block";
}
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";


    if(callNumber==2){
        sectionDetail = {
            'sectionName': '',
            'taskList': [{
                taskID:'',
                taskName: '',
                taskCompletion: false,
                taskAssingedTo: '',
                taskPriority: '',
                taskStatus: '',
                taskDescription: '',
            }]
        }
    }

    saveData(sectionNumber,taskNumber, sectionDetail);

    
    // if(callNumber == 1){
    //     createTaskCard(`${sectionNumber}`,`${taskNumber}`);
    // }
    // renderThePage();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

}


async function saveData(sectionNumber,taskNumber, sectionDetail){


    console.log("inside the savedata");

    let modalId = sectionNumber + "-" + taskNumber + "-display-modal";
    let cardId =  "task-card-" + sectionNumber + "-" + taskNumber;
    let backBtnId = "back-btn-" +  sectionNumber + "-" + taskNumber;

    let modal = document.getElementById(modalId);
    let taskName = document.getElementById(`taskname-${sectionNumber}-${taskNumber}`).value;
    let assignee = document.getElementById(`taskinfo-assignee-${sectionNumber}-${taskNumber}`).value;
    let deadline = document.getElementById(`taskinfo-deadline-${sectionNumber}-${taskNumber}`).value;
    let sectionName = document.getElementById(`taskinfo-sectionName-${sectionNumber}-${taskNumber}`).value; 
    let priority = document.getElementById(`taskinfo-priority-${sectionNumber}-${taskNumber}`).value;
    let status = document.getElementById(`taskinfo-status-${sectionNumber}-${taskNumber}`).value;
    let description = document.getElementById(`taskinfo-description-${sectionNumber}-${taskNumber}`).value;
    // let completion = document.getElementById(`checkbox--${sectionNumber}-${taskNumber}`).checked;


    console.log(taskName + " " + assignee);

    taskNumber = Number(taskNumber);

      

    sectionDetail.taskList[taskNumber].taskName = taskName;
    sectionDetail.taskList[taskNumber].taskAssingedTo = assignee;
    sectionDetail.taskList[taskNumber].taskDeadline = deadline;
    sectionDetail.sectionName = sectionName;
    sectionDetail.taskList[taskNumber].taskPriority = priority;
    sectionDetail.taskList[taskNumber].taskStatus = status;
    sectionDetail.taskList[taskNumber].taskDescription = description;
    // sectionDetail.taskList[taskNumber].taskCompletion = completion;

    console.log('section Details in save the data');
    console.log(sectionDetail);

    try{
        const result = await fetch('/update-task/'+ sectionNumber,{
            method: 'POST',
            body: JSON.stringify(sectionDetail),
            headers: {'Content-Type': 'application/json'}
            
        });

        const response = await result.json();
        if(response.sectionList){
            location.assign(response.redirect);
        }


    }
    catch(err) {
        console.log('inside savethedata');
        console.log(err)};




}

async function deleteTask(sectionNumber,taskNumber){
    
    console.log(sectionNumber,taskNumber);
    const result = await fetch('/delete-task/' + sectionNumber,{
        method: 'POST',
        body: JSON.stringify({taskNumber: taskNumber}),
        headers: {'Content-Type': 'application/json'}
    });

    const response = await result.json();
    if(response.redirect){
        location.assign(response.redirect);
    }

   
}



async function addTaskToSection1(sectionid){


    const data = {sectionID: sectionid};
    console.log(data);

    
    try{
        const result = await fetch('/add-new-task/'+sectionid,{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
            
        })

    
        const response = await result.json();
        if(response.sectionDetail){
            console.log('got result, inside addTaskToSection1');
            console.log(response.sectionDetail);
            const taskNumber = response.sectionDetail.taskList.length;
            createNewTask(sectionid,taskNumber,response.sectionDetail);
        }
    }
    catch(err){
        console.log('inside addtaskToSection1');
        console.log(err)};
    

}


// function addButtonToList(){
    //     let inputBtn = `
    //     <div class = "section">
    //             <div class = "section-input-div">  
    //                 <button id = "add-section-btn"  class = "add-section" onclick="addSectionButton()">Add Section</button>
    //             </div>
    //     </div>
        
    //     `;
    //     let section_div_li = document.createElement("li");
    //     // section_div_li.setAttribute("id", `section-list-input-${sectionNumber}`);
    //     section_div_li.setAttribute("class","add-section-btn-li");
    //     section_div_li.innerHTML = inputBtn;
    //     console.log(section_div_li);
    //     document.querySelector(".section-list").appendChild(section_div_li);
    //     // return inputBtn;
    // }

// function createNewSection(sectionNumber){
//         let section_input = `
//         <div class = "section">
//             <div class = "section-input-div">
//                 <input id = "section-input-${sectionNumber}" class = "section-input-input" onChange = "updateSectionNameData(event);" type = "text" placeholder = "Enter Section Name...">
//                 <button id = "section-add-btn-${sectionNumber}" onclick= "somethingElse(${sectionNumber},event)" class = "section-input-btn"><b>ADD</b></button>
//             </div>
//             <div class = "section-output">
//                 <ul id = "section-output-list-${sectionNumber}" class = "section-output-list"></ul>
//             </div>
//         </div>
//     `;
//     console.log(section_input);

//     let section_div_li = document.createElement("li");
//     section_div_li.setAttribute("id", `section-list-input-${sectionNumber}`);
//     section_div_li.setAttribute("class","section-list-input");
//     section_div_li.innerHTML = section_input;
//     console.log(section_div_li);
//     document.querySelector(".section-list").appendChild(section_div_li);
//     renderThePage(sectionNumber);


// }
// function addSectionButton(){
//     let sectionCount = projectList[0].sectionList.length;
//     projectList[0].sectionList[sectionCount] = {"sectionName": "", tasks: []};
    
//     createNewSection(sectionCount); //length will be 3 and section be section-3, becoz we are staring from 0
//     projectList[0].sectionList[sectionCount].sectionName = document.querySelector(`#section-input-${sectionCount}`).value;
// }


// function addTaskToSection(sectionNumber, event){
//     const sectionDetail = {
//         "taskName": "",
//         "taskCompletion": "false",
//         "taskAssingedTo": "",
//         "taskDeadline": "",
//         "taskPriority": "",
//         "taskStatus": "",
//         "taskDescription": "",
//         "subTaskList": []
//     };
//     createNewTask(`${sectionNumber}`,123456789, sectionDetail);
   
// }


//loading of previous data
// window.onload = function (){
//     for(let i=0;i<projectList[0].sectionList.length;i++){
//         console.log(i);
//         createSection(i);
//     }
// }


// function createSection(sectionNumber){
//     let section_input = `
//         <div class = "section">
//             <div class = "section-input-div">  
//                 <input id = "section-input-${sectionNumber}" onChange = "updateSectionNameData(event);"  class = "section-input-input" type = "text" value = \" ${projectList[0].sectionList[sectionNumber].sectionName} \" placeholder = "Enter Section Name...">
//                 <button id = "section-add-btn-${sectionNumber}" onclick= "somethingElse(${sectionNumber},event)" class = "section-input-btn"><b>ADD</b></button>
//             </div>
//             <div class = "section-output">
//                 <ul id = "section-output-list-${sectionNumber}" class = "section-output-list"></ul>
//             </div>
//         </div>
//     `;
//     console.log(section_input);
//     // document.querySelector(".section-list").innerHTML += section_input;
//     let section_div_li = document.createElement("li");
//     section_div_li.setAttribute("id", `section-list-input-${sectionNumber}`);
//     section_div_li.setAttribute("class","section-list-input");
//     section_div_li.innerHTML = section_input;
//     console.log(section_div_li);
//     document.querySelector(".section-list").appendChild(section_div_li);

   

//     for(let j=0;j<projectList[0].sectionList[sectionNumber].tasks.length;j++){
//         console.log("task: " + j)
//         createTaskCard(sectionNumber,j);
//     }
//     if(sectionNumber == projectList[0].sectionList.length - 1){
//         addButtonToList();
//     }


// }


// function renderThePage(sectionNumber){


    
//     // document.querySelector(".section-list").innerHTML = '<button id = "add-section-btn"  class = "add-section" onclick="addSectionButton()">Add Section</button>'; 
//     document.querySelector(".section-list").innerHTML = "";
//     for(let i=0;i<projectList[0].sectionList.length;i++){
//         console.log(i);
//         createSection(i);
//     }
    
//     // const res = await fetch("http://localhost:3000/task", {
//     //     method: "POST",
//     //     headers: {
//     //         'Content-Type': 'application/json'
//     //     },
//     //     body: JSON.stringify({
//     //       sectionNumber: sectionNumber,  
//     //       sectionList: "",
//     //       tasks: [],
//     //     }),
//     //   });
// }
