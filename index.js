require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000


const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const taskRoute = require('./routes/task.route');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views','./views');
app.set('view engine','pug');

app.use("/",taskRoute);
app.listen(port, () => console.log(`Example app listening on port ` + port.toString()));