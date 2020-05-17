require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000


const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
mongoose.connect(process.env.MONGODB_URL,{
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const taskRoute = require('./routes/task.route');
const sessionMiddleware = require('./middleware/auth.middleware');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.set('views','./views');
app.set('view engine','pug');

app.use(sessionMiddleware);

app.use("/",taskRoute);
app.listen(port, () => console.log(`Example app listening on port ` + port.toString()));