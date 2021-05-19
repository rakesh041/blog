const express = require('express');
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('backend/images')));
mongoose.connect("mongodb+srv://rakesh_bhargava_04:"+process.env.MONGO_ATLAS_PW+"@cluster0-y7t3o.mongodb.net/node-angular",
{ useUnifiedTopology: true, useNewUrlParser:true })
.then(()=>{
    console.log('connected to database');
}).catch(()=>{
    console.log('connection failed')
});


app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', "*");
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, PUT, OPTIONS'
    )
    next();
})

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;