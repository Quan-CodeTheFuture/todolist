const mongoose = require("mongoose");
let taskSchema = mongoose.Schema({
    title:String,
    isDone:Boolean,
})

let Task = mongoose.model("tasks", taskSchema);
module.exports = Task