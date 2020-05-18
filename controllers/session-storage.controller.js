const Users = require('../models/users.model');

module.exports.getSession = (req,res) => {
    res.render("session/session.pug");
}

module.exports.postSession = async(req,res) => {
    console.log(req.body);
    let data;
    if(req.body.session){
        data = await Users.findOne({_id:req.body.session})
    } else {
        data = await Users.findOne({_id:req.signedCookies.sessionId});
    }
    if(!data){
        let result = await Users.create({
            tasksList:[]
        })
        res.cookie('sessionId',result.id,{
            signed:true
        });
    } else if(req.body.session) {
        res.cookie('sessionId',req.body.session,{
            signed:true
        });
    }
    res.json({
        status: 200
    });
}