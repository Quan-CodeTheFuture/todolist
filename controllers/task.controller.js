const Task = require('../models/task.model');
module.exports.getTaskWeb = async (req,res) => {
    let data = await Task.find();
    res.render('index.pug',{
        tasksList:data
    });
}

module.exports.getAPI = async(req,res) => {
    let data = await Task.find();
    data = data.map(task=>{
        return {
            id:task.id,
            title: task.title,
            isDone:task.isDone
        }
    });
    res.json(data);
}

module.exports.postTaskWeb = async (req,res) => {
    if(req.body.request === "create"){
        let result = await Task.create({
            title: req.body.content,
            isDone: false
        });
        res.json({
            id:result.id
        });
    } else if(req.body.request === "edit") {
        if(req.body.id){
            await Task.findOneAndUpdate({_id:req.body.id},{
                isDone: req.body.isDone
            });
        };
    } else if(req.body.request === "delete"){
        await Task.deleteOne({_id:req.body.id});
    } else if(req.body.request === "editTitle"){
        await Task.findOneAndUpdate({_id:req.body.id},{
            title:req.body.title,
            isDone:false,
        })
    } else if(req.body.request === "allDone"){
        await Task.updateMany({isDone:false},{
            isDone:true,
        })
    } else if (req.body.request === "allNotDone"){
        await Task.updateMany({isDone:true},{
            isDone:false,
        });
    }
    res.status(200).end();
}