const Users = require('../models/users.model');
const shortid = require('shortid');
module.exports.getTaskWeb = async (req,res) => {
    let dataUsers = await Users.findOne({_id:req.cookies.sessionId});

    res.render('index.pug',{
        tasksList:dataUsers.tasksList
    });
}

module.exports.getSession = async(req,res) => {
    res.redirect('/');
}

module.exports.postTaskWeb = async (req,res) => {
    let user = await Users.findOne({_id:req.cookies.sessionId});
    tasksList = user.tasksList;
    if(req.body.request === "create"){
        let id = shortid.generate();
        let request = {
            title: req.body.content,
            isDone: false
        };
        res.json({
            id:id
        });
        request.id = id;
        tasksList.push(request);
        await Users.replaceOne({_id:req.cookies.sessionId},{
            tasksList:tasksList
        })
        
    } else if(req.body.request === "edit") {
        for(let i = 0; i < tasksList.length; i++) {
            if(tasksList[i].id === req.body.id){
                tasksList[i].isDone = req.body.isDone;
                break;
            }
        }
        await Users.replaceOne({_id:req.cookies.sessionId},{
            tasksList:tasksList
        })
    } else if(req.body.request === "delete"){
        await Users.replaceOne({_id:req.cookies.sessionId},{
            tasksList:req.body.tasksList
        })
    } else if(req.body.request === "editTitle"){
        for(let i = 0; i < tasksList.length; i++){
            if(tasksList[i].id === req.body.id){
                tasksList[i].title = req.body.title;
                break;
            }
        }
        await Users.replaceOne({_id:req.cookies.sessionId},{
            tasksList:tasksList
        })
    } else if(req.body.request === "allDone"){
        await Users.replaceOne({_id:req.cookies.sessionId},{
            tasksList:req.body.tasksList
        })

    } else if (req.body.request === "allNotDone"){
        await Users.replaceOne({_id:req.cookies.sessionId},{
            tasksList:req.body.tasksList
        })
    } else if (req.body.request === "deleteMany"){
        await Users.replaceOne({_id:req.cookies.sessionId},{
            tasksList:req.body.tasksList
        })
    }
    res.status(200).end();
}