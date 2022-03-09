const express=require('express');
const bodyParser=require('body-parser');

const route=require('./routes/route.js');

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const mongoose=require('mongoose');
const { route } = require('express/lib/application');

mongoose.connect('',{useNewUrlParser:true})
.then(()=>console.log('mongodb running on 27017'))
.catch((err)=>console.log(err));

app.use('/',route);

app.listen(3000,function(){
    console.log('Express app running on port'+3000);
});