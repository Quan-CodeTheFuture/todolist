const Users = require('../models/users.model');

module.exports = async(req,res,next) => {
    if(!req.signedCookies.sessionId){
        res.redirect("/sessionapi");
        return;
    }
    let data = await Users.findOne({_id:req.signedCookies.sessionId});
    if(!data){
        res.redirect('/sessionapi');
        return;
    }
    next();
}