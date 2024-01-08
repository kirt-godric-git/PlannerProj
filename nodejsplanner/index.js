const express = require('express');
const app = express();

// Using your database config in connfig.js
const config = require('./config'); 

const cors = require('cors');   // npm install cors
app.use(cors());                // CORS middleware; allow Cross-origin resource sharing 

// https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
const { Op } = require("sequelize");

const Task = require('./models/task');
const Note = require('./models/note')

// Used for any POST body x-www-form-urlencoded...
app.use(express.urlencoded({extended: false}));

// Used for any POST JSON body
app.use(express.json());


app.listen(3000, function() {
    console.log("Planner App server 3000 is up and running...");
});

/******** Use this if you want to use "include: Note" in your search object as part of composite object  
    on Task-Note relationship otherwise it not necessary. ********/
Note.belongsTo(Task, {
    foreignKey: "task_id"
});

Task.hasMany(Note, {
    foreignKey: "task_id"
})

// Used for any POST body x-www-form-urlencoded...
app.use(express.urlencoded({extended: false}));

// Used for any POST JSON body
app.use(express.json());

    
// You can use the .authenticate() function to test if the connection is OK:
// Code for connecting to mariadb database 
config.authenticate()   // promise
.then(function() {      // fulfilled status
    console.log("Database is connected.");
})
.catch(function() {     // rejected status
    console.log("There is NO database connection!");
})


// *******************************************************************
// ***** Retrieve all tasks  GET http://localhost:3000/tasks/ ******
// *******************************************************************
app.get('/tasks', function(req, res) {
    console.log("Get All tasks");

    Task.findAll()   // SELECT * from tablename implemenation; ORIG
    //Task.findAll(data)   // SELECT * from tablename implemenation;
    .then(function(results) {
        res.status(200).send(results);
    })
    .catch(function(error) {
        res.status(500).send(error);
    })
})


// *******************************************************************
// ***** Retrieve all weekly tasks  GET http://localhost:3000/weeklytasks/ ******
// *******************************************************************
app.get('/weeklytasks', function(req, res) {
    console.log("Get Weekly tasks");

    let curr = new Date();
    let firstday = new Date(new Date().setDate(curr.getDate() - curr.getDay()));
    let lastday = new Date(new Date().setDate(curr.getDate() - curr.getDay()+6));
    console.log("curr = ", curr, curr.toUTCString(), curr.toLocaleDateString());
    console.log("firstday = ", firstday, firstday.toUTCString() , firstday.toLocaleDateString());
    console.log("lastday = ", lastday, lastday.toUTCString(), lastday.toLocaleDateString());
    console.log('*************************************');
    // Use date.setUTCHours() instead of date.setHours()
    firstday.setUTCHours(0, 0, 0, 0);
    lastday.setUTCHours(11, 59, 0, 0);

    var difference = lastday.getTime() - firstday.getTime();
    // This result is now in milliseconds so we have to convert it to days.
    // (1000 milliseconds _ (60 minutes _ 60 seconds) * 24 hours);
    var days = Math.ceil(difference / (1000 * 3600 * 24));

    console.log("curr = ", curr, curr.toUTCString(), curr.toLocaleDateString());
    console.log("firstday = ", firstday, firstday.toUTCString() , firstday.toLocaleDateString());
    console.log("lastday = ", lastday, lastday.toUTCString(), lastday.toLocaleDateString());
    console.log("days = ", days);

    let searchObject = {
        where: {
            [Op.or]: {
                date_of_start: {
                    [Op.between]:[firstday , lastday]     // OK
                },
                date_of_end: {  // OK
                    [Op.gte]: firstday, 
                    [Op.lte]: lastday, 
                },
                //status: {
                //    [Op.eq]: 'not_done'     // OK
                //},
            },
        },
    }

    Task.findAll(searchObject)   // SELECT * from tablename implemenation;
    .then(function(results) {
        res.status(200).send(results);
    })
    .catch(function(error) {
        res.status(500).send(error);
    })
})


// *******************************************************************
// ***** Retrieve all monthly tasks  GET http://localhost:3000/monthlytasks/ ******
// *******************************************************************
app.get('/monthlytasks', function(req, res) {
    console.log("Get Weekly tasks");

    let curr = new Date();
    let firstday = new Date(curr.getFullYear(), curr.getMonth(), 1);
    let lastday = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
    console.log("curr = ", curr, curr.toUTCString(), curr.toLocaleDateString());
    console.log("firstday = ", firstday, firstday.toUTCString() , firstday.toLocaleDateString());
    console.log("lastday = ", lastday, lastday.toUTCString(), lastday.toLocaleDateString());
    console.log('*************************************');
    // Use date.setUTCHours() instead of date.setHours()
    firstday.setUTCHours(0, 0, 0, 0);
    lastday.setUTCHours(11, 59, 0, 0);

    var difference = lastday.getTime() - firstday.getTime();
    // This result is now in milliseconds so we have to convert it to days.
    // (1000 milliseconds _ (60 minutes _ 60 seconds) * 24 hours);
    var days = Math.ceil(difference / (1000 * 3600 * 24));

    console.log("curr = ", curr, curr.toUTCString(), curr.toLocaleDateString());
    console.log("firstday = ", firstday, firstday.toUTCString() , firstday.toLocaleDateString());
    console.log("lastday = ", lastday, lastday.toUTCString(), lastday.toLocaleDateString());
    console.log("days = ", days);

    let searchObject = {
        where: {
            [Op.or]: {
                date_of_start: {
                    [Op.between]:[firstday , lastday]     // OK
                },
                date_of_end: {  // OK
                    [Op.gte]: firstday, 
                    [Op.lte]: lastday, 
                },
                status: 'not_done',     // OK
            },
        },
    }

    Task.findAll(searchObject)   // SELECT * from tablename implemenation;
    .then(function(results) {
        res.status(200).send(results);
    })
    .catch(function(error) {
        res.status(500).send(error);
    })
})


// *******************************************************************
// ***** Retrieve specific task  GET http://localhost:3000/tasks/1 ******
// *******************************************************************
app.get('/tasks/:task_id', function(req, res) {
    console.log("Get specific task");

    let taskId = parseInt(req.params.task_id);
    console.log("Retrieving taskId = "+taskId);

    Task.findByPk(taskId)
    .then(function(results) {
        console.log(results);

        if (results) {
            console.log("results.name ==> " +results.name);
            res.status(200).send(results);
        } else {
            res.status(404).send(`Task id #${taskId} does not exist!`);
        }
    })
    .catch(function(error) {
        console.log(error);
        res.status(500).send(error);
    })
})

function populateTaskInfo(req) {
    let taskInfo = {};
    taskInfo.name = req.body.name;
    taskInfo.description = req.body.description;
    taskInfo.date_of_start = (req.body.date_of_start != null && req.body.date_of_start != undefined 
        && req.body.date_of_start != '' ? req.body.date_of_start: null);
    taskInfo.date_of_end = (req.body.date_of_end != null && req.body.date_of_end != undefined 
        && req.body.date_of_end != '' ? req.body.date_of_end: null);
    taskInfo.status = req.body.status;  
    taskInfo.task_type = req.body.task_type;  

    // OR like this:
    // let taskInfo = {
    //     name: = req.body.name;
    //     description = req.body.description;
    //     date_of_start = req.body.date_of_start;
    //     date_of_end = req.body.date_of_end;
    //     status = req.body.status;
    //     task_type = req.body.task_type;
    // }
    return taskInfo;
}

function validateTaskInfo(taskInfo) {
    let hasIncompleteData = false;
    console.log("Validate TaskInfo ==> ", taskInfo);

    if (taskInfo.name == null || taskInfo.name == undefined || taskInfo.name == '') {
        console.log("Invalid  taskInfo.name!");
        hasIncompleteData = true;
    }
    // if (taskInfo.description == null || taskInfo.description == undefined || taskInfo.description == '') {
    //     console.log("Invalid  taskInfo.description!");
    //     hasIncompleteData = true;
    // }
    if (taskInfo.task_type == null || taskInfo.task_type == undefined || taskInfo.task_type == '') {
        console.log("Invalid  taskInfo.task_type!");
        hasIncompleteData = true;
    }

    if (taskInfo.status == null || taskInfo.status == undefined || taskInfo.status == '') {
        taskInfo.status = 'not_done';
    }

    return hasIncompleteData;
}

// *******************************************************************
// ***** Create new task POST http://localhost:3000/tasks/ ******
// *******************************************************************
app.post('/tasks', function(req, res) {
    console.log("Create new task");

    // Retrieve all task data from the request body into taskInfo object
    let taskInfo = populateTaskInfo(req);

    // Check for any incomplete data within the taskInfo object
    let hasIncompleteData = validateTaskInfo(taskInfo);
    // console.log(taskInfo);
    
    let errorMsg = "Incomplete data provided for Task! Create (POST) request unsuccessful...";
    if (hasIncompleteData) {
        res.status(406).send(errorMsg);
        console.error(errorMsg, 'taskInfo = ', taskInfo);
        return;
    }

    // Sequelize provides the create() method, which combines the 
    // build() and save() methods shown above into a single method
    Task.create(taskInfo)
        .then(function (results) {
            res.status(200).send(results)
        })
        .catch(function(error) {
            res.status(500).send(error);
        })
}); 


// *******************************************************************
// ***** Update a task PUT http://localhost:3000/tasks/6 ******
// *******************************************************************
app.put('/tasks/:task_id', function(req, res) {
    console.log("Update specific task");

    let task_id = parseInt(req.params.task_id);
    console.log("Updating task_id = "+task_id);

    Task.findByPk(task_id)
    .then(function(results) {
        if (results == undefined) {
            res.status(404).send(`Task id #${task_id} does not exist!`); // Not Found
        } else {
            console.log(results);
            console.log("Found results.name ==> " +results.name);
    
            // Retrieve all task data from the request body into taskInfo object
            let taskInfo = populateTaskInfo(req);

            // Check for any incomplete data within the taskInfo object
            let hasIncompleteData = validateTaskInfo(taskInfo);

            console.log(taskInfo);
            
            let errorMsg = "Incomplete data provided for Task! Update (PUT) request unsuccessful...";
            if (hasIncompleteData) {
                res.status(406).send(errorMsg);
                console.error(errorMsg, 'taskInfo = ', taskInfo);
                return;
            }

            // Update all info within the results object...
            results.name =          taskInfo.name;          // req.body.name
            results.description =   taskInfo.description;   // req.body.description
            results.date_of_start = taskInfo.date_of_start; // req.body.date_of_start
            results.date_of_end =   taskInfo.date_of_end;   // req.body.date_of_end
            results.status =        taskInfo.status;        // req.body.status
            results.task_type =     taskInfo.task_type;     // req.body.task_type

            results.save()
            .then(function(task_result) {
                res.status(200).send(task_result);
            })
            .catch(function(error) {
                console.log(error);
                res.status(500).send(error);    // Internal Server Error
            })      
        }
    })
})

// *******************************************************************
// ***** Update a task PATCH http://localhost:3000/tasks/6 ******
// *******************************************************************
app.patch('/taskstatus/:task_id', function(req, res) {
    console.log("Update task status only");
    let task_id = parseInt(req.params.task_id);
    console.log("Updating Task Status task_id = "+task_id);

    Task.findByPk(task_id)
    .then(function(results) {
        if (results == undefined) {
            res.status(404).send(`Task id #${task_id} does not exist!`); // Not Found
        } else {
            console.log(results);
            console.log("Found results.name ==> " +results.name);
    
            // Retrieve only task status from the request body into taskInfo object
            let taskInfo = {};
            taskInfo.status = req.body.status;  

            if (taskInfo.status == null || taskInfo.status == undefined || taskInfo.status == '') {
                taskInfo.status = 'not_done';
            } 

            let hasInvalidData = false;
            if (taskInfo.status != 'not_done' && taskInfo.status != 'done') {
                hasInvalidData = true;
            }

            let errorMsg = "Invalid data provided for Task status! Update (PATCH) request unsuccessful...";
            if (hasInvalidData) {
                res.status(406).send(errorMsg);
                console.error(errorMsg, 'taskInfo = ', taskInfo);
                return;
            }

            // Update only status within the results object...
            results.status =        taskInfo.status;        // req.body.status
            console.log("Saving task status of ==> " +results.status);

            results.save()
            .then(function(task_result) {
                res.status(200).send(task_result);
            })
            .catch(function(error) {
                console.log(error);
                res.status(500).send(error);    // Internal Server Error
            })      
        }
    })
})

// *******************************************************************
// ***** Delete a task DELETE http://localhost:3000/tasks/3 ******
// *******************************************************************
app.delete('/tasks/:task_id', function(req, res) {
    console.log("Delete specific task");
    let taskId = parseInt(req.params.task_id);
    console.log("Deleting taskId = "+taskId);

    Task.findByPk(taskId)
    .then(function(results) {
        if (!results) {
            res.status(404).send(`Task id #${taskId} does not exist!`); // Not Found
        } else {
            console.log(results);
            console.log("Found results.name ==> " +results.name);
    
            // You can delete an instance by calling destroy()
            results.destroy()
            .then(function(task_result) {
                res.status(200).send(task_result);
                //res.status(200).send(`Task id# ${taskId} is deleted successfully. Task object: `+ JSON.stringify(task_result));
            })
            .catch(function(error) {
                console.log(error);
                res.status(500).send(error);    // Internal Server Error
            })      
        }
    })
})


// *******************************************************************
// ***** Retrieve all notes  GET http://localhost:3000/notes/ ******
// *******************************************************************
app.get('/notes', function(req, res) {
    console.log("Get all notes");

    // data here is to set to include Note with Task object(s)
    let data = {
        include: Task
    }

    //Note.findAll()   // SELECT * from tablename implemenation;  without Task
    Note.findAll(data)   // SELECT * from tablename implemenation; with Task
    .then(function(results) {
        res.status(200).send(results);
    })
    .catch(function(error) {
        res.status(500).send(error);
    })
})
  

// *******************************************************************
// ***** Retrieve specific note  GET http://localhost:3000/tasks/1 ******
// *******************************************************************
app.get('/notes/:note_id', function(req, res) {
    let noteId = parseInt(req.params.note_id);
    console.log("Retrieving taskId = "+noteId);

    // data here is to set to include Note with Task object(s)
    let data = {
        include: Task
    }

    // Note.findByPk(noteId)
    Note.findByPk(noteId, data)
    .then(function(results) {
        console.log(results);

        if (results) {
            console.log("results.name ==> " +results.name);
            res.status(200).send(results);
        } else {
            res.status(404).send(`Note id #${noteId} does not exist!`);
        }
    })
    .catch(function(error) {
        console.log(error);
        res.status(500).send(error);
    })
})


function populateNoteInfo(req) {
    let noteInfo = {};
    noteInfo.name = req.body.name;
    noteInfo.header = req.body.header;
    noteInfo.details = req.body.details;
    noteInfo.importance = (req.body.importance != null && req.body.importance != undefined 
        && req.body.importance != '' ? req.body.importance.toUpperCase(): null);
    noteInfo.task_id = req.body.task_id;  

    // OR like this:
    // let taskInfo = {
    //     name: = req.body.name;
    //     header = req.body.header;
    //     details = req.body.details;
    //     importance = req.body.importance;
    //     task_id = req.body.task_id;
    // }
    return noteInfo;
}

function validateNoteInfo(noteInfo) {
    let hasIncompleteData = false;
    if (noteInfo.name == null || noteInfo.name == undefined || noteInfo.name == '') {
        hasIncompleteData = true;
    }
    if (noteInfo.header == null || noteInfo.header == undefined || noteInfo.header == '') {
        hasIncompleteData = true;
    }
    if (noteInfo.details == null || noteInfo.details == undefined || noteInfo.details == '') {
        hasIncompleteData = true;
    }
    if (noteInfo.task_id == null || noteInfo.task_id == undefined || noteInfo.task_id == '') {
        hasIncompleteData = true;
    }
    if (noteInfo.importance == null || noteInfo.importance == undefined || noteInfo.importance == '') {
        noteInfo.importance = 'N';
    }
    return hasIncompleteData;
}

// *******************************************************************
// ***** Create new note POST http://localhost:3000/notes/ ******
// *******************************************************************
app.post('/notes', function(req, res) {
    // Retrieve all task data from the request body into taskInfo object
    let noteInfo = populateNoteInfo(req);

    // Check for any incomplete data within the taskInfo object
    let hasIncompleteData = validateNoteInfo(noteInfo);

    console.log(noteInfo);
    
    let errorMsg = "Incomplete data provided for Note! Create (POST) request unsuccessful...";
    if (hasIncompleteData) {
        res.status(406).send(errorMsg);
        console.error(errorMsg, 'taskInfo = ', noteInfo);
        return;
    }

    // Sequelize provides the create() method, which combines the 
    // build() and save() methods shown above into a single method
    Note.create(noteInfo)
        .then(function (results) {
            res.status(200).send(results)
        })
        .catch(function(error) {
            res.status(500).send(error);
        })
}); 

// *******************************************************************
// ***** Update a note PUT http://localhost:3000/notes/6 ******
// *******************************************************************
app.put('/notes/:note_id', function(req, res) {
    let noteId = parseInt(req.params.note_id);
    console.log("Updating noteId = "+noteId);

    Note.findByPk(noteId)
    .then(function(results) {
        if (results == undefined) {
            res.status(404).send(`Note id #${noteId} does not exist!`); // Not Found
        } else {
            console.log(results);
            console.log("Found results.name ==> " +results.name);
    
            // Retrieve all task data from the request body into noteInfo object
            let noteInfo = populateNoteInfo(req);

            // Check for any incomplete data within the noteInfo object
            let hasIncompleteData = validateNoteInfo(noteInfo);

            console.log(noteInfo);
            
            let errorMsg = "Incomplete data provided for Note! Update (PUT) request unsuccessful...";
            if (hasIncompleteData) {
                res.status(406).send(errorMsg);
                console.error(errorMsg, 'noteInfo = ', noteInfo);
                return;
            }

            // Update all info within the results object...
            results.name =          noteInfo.name;          // req.body.name
            results.header =        noteInfo.header;        // req.body.header
            results.details =       noteInfo.details;       // req.body.details
            results.importance =    noteInfo.importance;    // req.body.importance
            results.task_id =       noteInfo.task_id;       // req.body.task_id

            results.save()
            .then(function(note_result) {
                res.status(200).send(note_result);
            })
            .catch(function(error) {
                console.log(error);
                res.status(500).send(error);    // Internal Server Error
            })      
        }
    })
})


// *******************************************************************
// ***** Delete a note DELETE http://localhost:3000/notes/3 ******
// *******************************************************************
app.delete('/notes/:note_id', function(req, res) {
    let noteId = parseInt(req.params.note_id);
    console.log("Deleting noteId = "+noteId);

    Task.findByPk(noteId)
    .then(function(results) {
        if (!results) {
            res.status(404).send(`Note id #${noteId} does not exist!`); // Not Found
        } else {
            console.log(results);
            console.log("Found results.name ==> " +results.name);
    
            // You can delete an instance by calling destroy()
            results.destroy()
            .then(function(note_result) {
                //res.status(200).send(note_result);
                res.status(200).send(`Note id #${noteId} is deleted successfully. Note object: `+ JSON.stringify(note_result));
            })
            .catch(function(error) {
                console.log(error);
                res.status(500).send(error);    // Internal Server Error
            })      
        }
    })
})
