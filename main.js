//npm modules
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const bodyparser = require("body-parser");
const http = require('http')
const socketio = require('socket.io')
const jwt = require('jsonwebtoken');
const async = require('async');



//models
const Task = require('./models/tasks'); 
const Project = require('./models/projects');
const User = require('./models/user');
const Note = require("./models/notes");

//routes
const authRoutes = require('./routes/authroutes');
const projectRoutes = require('./routes/projectroutes');
const taskRoutes = require('./routes/taskroutes');
const homeRoutes = require('./routes/homeroutes');
const noteRoutes = require('./routes/notesroutes');
const adminRoutes = require('./routes/adminroutes');
 
//middlewares
const {requireAuth, checkUser} = require('./middleware/authMiddleware');



const app = express();

const server = http.createServer(app)
const io = socketio(server)
const path = require('path')
const {generateMessage} = require('./utils/messages.js')
const Msg = require('./models/message')
const Filter = require('bad-words')

const dbURL = "mongodb+srv://sampleuser:1234@atmos-sample-database.r2brf.mongodb.net/ATMOS-sample-database?retryWrites=true&w=majority";
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => server.listen(3000, function () {
        console.log("Hi, Its ATMOS");
        console.log("connected to DB");
    }))
    .catch((err) => console.log(err));





//



//in-built middileware of npm modules  
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use(authRoutes);
app.use(projectRoutes);
app.use(taskRoutes);
app.use(homeRoutes);
app.use(noteRoutes);
app.use(adminRoutes)
app.set("view engine", "ejs");


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



app.get('*', checkUser);
app.get("/", function (req, res) {
    res.render("homepage-index");
});


let username = "";
let projectListID = {}
// app.get('/task',(req,res)=> res.render('task-index',{sectionList: []}));
app.get("/messages", checkUser, async function (req, res) {
    res.render("message-index");

    const user = await getUserDetails(req,res);

    username = user.firstname;
    projectListID = user.projectListID;
    console.log(username)
});
io.on('connection', (socket) => {
    console.log('New user connected')
    // console.log(user.firstname)
    Msg.find().then((messages) => {
        socket.emit('loadMessages', messages)
    })
    // let userName = user.firstname;
    // console.log(userName)
    
    socket.on('join',() => {
        // socket.join(projectListID[i]);
        const msg = new Msg({
            user: username,
            msg: 'Welcome to the chat app\n'+username+' has joined the chat room',
            time: Date.now()
        })
        socket.emit('message', generateMessage(msg))
        // socket.broadcast.to(projectListID[i]).emit('message', generateMessage(`${username} has joined the chat`))
    })
    // for (let i = 0; i < projectListID.length; i++) {
    socket.on('sendMessage', (message,callback) => {
        // console.log(data)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }
        const msg = new Msg({
            msg: message,
            user: username,
            time: Date.now()
        })
        msg.save().then(() => {
            // io.to(projectListID[i]).emit('message', generateMessage(message))
            // callback()
            io.emit('message', generateMessage(msg))
            callback()
        }).catch((err) => {
            console.log(err)
        })

        
        // socket.emit('message', data) 
    })
// }
    socket.on('disconnect', () => {
        const msg = new Msg({
            user: username,
            msg: username+' has left the chat',
            time: Date.now()
        })
        io.emit('message',generateMessage(msg))
    })
    socket.on('sendLocation', (data, callback) => {
        // io.emit('message', data.latitude)
        // io.emit('message', data.longitude)
        io.emit('geolocation', generateMessage(data))
        callback()
    })
    // socket.emit('count', count)
    // socket.on('increment', () => {
    //     count++
    //     // socket.emit('count', count)
    //     io.emit('count', count)
    // })
})





// app.get("/notes", function (req, res) {
//     res.render("notes-index");
// });

app.get("/admin", async function (req, res) {
    let task 
    let project 
    let user
    async.series([function(callback){
        Task.find({},function(err,tasks){
            if(err) return callback(err);
            task = tasks;
            callback(null,tasks);
        })
    },function(callback){
        Project.find({},function(err,projects){
            if(err) return callback(err);
            project = projects;
            callback(null,projects);
        })
    },function(callback){
        User.find({}, function (err, users) {
            if(err) return callback(err);
            user = users;
            callback(null,users);
        })
    }],function(err,results){
        if(err) return callback(err);
        res.render("admin-index",{task:task,project:project,user:user});
    });
});


app.get('/aboutus', function (req, res) {
	res.render("aboutus-index");
});
app.get('/plans', (req, res) => {
    res.render('plans');
});


app.get('/contact', function (req, res) {
	res.render("contact-index");
});



app.post('/contact', function (req, res) {

    console.log(req.body);

    const comm = req.body.name;
    const em = req.body.email;
    const ph = req.body.phone;
    const mess = req.body.message;

    console.log(comm, em, ph, mess);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'avinashsaroj99@gmail.com',
            pass: 'saroj@2001'

        }
    })
    var mailOptions = {
        from: 'avinashsaroj99@gmail.com',
        to: em,
        cc: 'avinashsaroj99@gmail.com',
        sub: 'Thanks for giving feedback' + comm,
        text: 'Thanks for your message send to us -->' + mess
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        }
        else {
            // res.send("mail submitted");
            res.redirect('/');
            console.log("email sent" + info.response);


        }
    })
});



let imagesForProjectIcon = ["https://img.icons8.com/color-glass/48/000000/list.png",
    "https://img.icons8.com/color-glass/48/000000/generic-sorting.png",
    "https://img.icons8.com/color-glass/48/000000/deezer.png",
    "https://img.icons8.com/fluency/48/000000/deezer.png",
    "https://img.icons8.com/color/48/000000/bulleted-list.png"];

let colorPallet = ["#f16b6a", "#4573d2", "#f1bc6d", "#5da283", "#f36eb2", "#f16a6b", "#7db387", "#8c85e8", "#6d6f6e"];

let projectList = [
    {
        "projectName": "FSD Project",
        "favorite": "false",
        "backGroundColor": `${getBackgroundColor()}`,
        "backgroundImage": `${getBackgroundImage()}`,
        "teamMembers": [],
        "sectionList": [
            {
                "sectionName": "Create Homepage",
                "tasks": [
                    {
                        "taskName": "Create Nav Bar",
                        "taskCompletion": "true",
                        "taskAssingedTo": "Naman",
                        "taskDeadline": "2022-03-26",
                        "taskPriority": "Medium",
                        "taskStatus": "On-Track",
                        "taskDescription": "nsdv kjbse jkv  vjkeaj ac akj ej nsdmv jke fjke kje fje",
                        "subTaskList": ["Create Nav Bar", "Create Main Display", "Create Features", "Create "]
                    },
                    {
                        "taskName": "Create Main Display",
                        "taskCompletion": "false",
                        "taskAssingedTo": "SPK",
                        "taskDeadline": "2022-03-26",
                        "taskPriority": "High",
                        "taskStatus": "Off-Track",
                        "taskDescription": "nsdv kjbse jkv  vjkeaj ac akj ej nsdmv jke fjke kje fje",
                        "subTaskList": ["Create Nav Bar", "Create Main Display", "Create Features", "Create display"]
                    }
                ]
            },
            {
                "sectionName": "Create SignUp Page",
                "tasks": [
                    {
                        "taskName": "Create Nav Bar",
                        "taskCompletion": "false",
                        "taskAssingedTo": "SPK",
                        "taskDeadline": "2022-03-26",
                        "taskPriority": "Medium",
                        "taskStatus": "On-Track",
                        "taskDescription": "nsdv kjbse jkv  vjkeaj ac akj ej nsdmv jke fjke kje fje",
                        "subTaskList": ["Create Nav Bar", "Create Main Display", "Create Features", "Create "]
                    },
                    {
                        "taskName": "Create Main Display",
                        "taskCompletion": "false",
                        "taskAssingedTo": "SPK",
                        "taskDeadline": "2022-03-26",
                        "taskPriority": "Low",
                        "taskStatus": "Off-Track",
                        "taskDescription": "nsdv kjbse jkv  vjkeaj ac akj ej nsdmv jke fjke kje fje",
                        "subTaskList": ["Create Nav Bar", "Create Main Display", "Create Features", "Create display"]
                    }
                ]
            },
            {
                "sectionName": "Create DashBoard",
                "tasks": [
                    {
                        "taskName": "Create Nav Bar",
                        "taskCompletion": "false",
                        "taskAssingedTo": "SPK",
                        "taskDeadline": "2022-03-26",
                        "taskPriority": "Medium",
                        "taskStatus": "On-Track",
                        "taskDescription": "nsdv kjbse jkv  vjkeaj ac akj ej nsdmv jke fjke kje fje",
                        "subTaskList": ["Create Nav Bar", "Create Main Display", "Create Features", "Create "]
                    },
                    {
                        "taskName": "Create Main Display",
                        "taskCompletion": "false",
                        "taskAssingedTo": "SPK",
                        "taskDeadline": "2022-03-26",
                        "taskPriority": "Low",
                        "taskStatus": "Off-Track",
                        "taskDescription": "nsdv kjbse jkv  vjkeaj ac akj ej nsdmv jke fjke kje fje",
                        "subTaskList": ["Create Nav Bar", "Create Main Display", "Create Features", "Create display"]
                    }
                ]
            }
        ]

    },
    {
        "projectName": "Message Box",
        "favorite": "false",
        "backGroundColor": `${getBackgroundColor()}`,
        "backgroundImage": `${getBackgroundImage()}`,
        "teamMembers": [],
        "sectionList": []

    }
]
function getBackgroundImage() {
    let random = Math.floor(Math.random() * imagesForProjectIcon.length);
    return imagesForProjectIcon[random];
}
function getBackgroundColor() {
    let random = Math.floor(Math.random() * imagesForProjectIcon.length);
    return colorPallet[random];
}