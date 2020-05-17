const mongoose = require('mongoose');
let usersSchema = mongoose.Schema({
    tasksList:Array
})

let Users = mongoose.model('users',usersSchema);
module.exports = Users;