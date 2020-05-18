const Users = require('../models/users.model');
const shortid = require('shortid');
module.exports.getTaskWeb = async (req,res) => {
    let dataUsers = await Users.findOne({_id:req.signedCookies.sessionId});

    res.render('index.pug',{
        tasksList:dataUsers.tasksList
    });
}

module.exports.postTaskWeb = async (req,res) => {
    let user = await Users.findOne({_id:req.signedCookies.sessionId});
    tasksList = user.tasksList;

    switch(req.body.request){
        case "localStorage":
            res.json({
                sessionId: req.signedCookies.sessionId
            })
            break
        case "create":
            let id = shortid.generate();
            res.json({
                id:id
            });
            break
        case "editTitle":
            for(let i = 0; i < tasksList.length; i++){
                if(tasksList[i].id === req.body.id){
                    tasksList[i].title = req.body.title;
                    break;
                }
            }
            await Users.replaceOne({_id:req.signedCookies.sessionId},{
                tasksList:tasksList
            })
            break
        default:
            await Users.replaceOne({_id:req.signedCookies.sessionId},{
                tasksList:req.body.tasksList
            })    
    }
    res.status(200).end();
}