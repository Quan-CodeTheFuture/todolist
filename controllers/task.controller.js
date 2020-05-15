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
    })
    res.json(data)
}

module.exports.postTaskWeb = async (req,res) => {
    let data ={
        status:true
    }
    if(req.body.request==="delete"){
        await Task.deleteOne({_id:req.body.id});
    } else {
        if(req.body.id){
            await Task.replaceOne({_id: req.body.id},{
                title: req.body.title,
                isDone: req.body.isDone   
            });
        } else {
            await Task.create({
                title: req.body.title,
                isDone: req.body.isDone   
            })
            let taskList = await Task.find();
            data.id = taskList[taskList.length - 1].id;
        }
    }
    res.json(data);
}