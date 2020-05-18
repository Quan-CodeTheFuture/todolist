const Users = require('../models/users.model');

module.exports = async(req,res,next) => {
    let data = await Users.findOne({_id:req.cookies.sessionId});
    if(!data){
        let result = await Users.create({
            tasksList:[]
        })
        res.cookie('sessionId',result.id);
        res.redirect('/session')
    } else {
        next();
    }
}