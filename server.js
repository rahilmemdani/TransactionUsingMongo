const express = require("express");
const app = express();
const db= require('./conn');
const nodemailer = require('nodemailer');
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Routes HTML 
app.use(express.static(__dirname+'/public'));




//ROUTES JS
const wallet = require('./router/wallet');
app.use('/',wallet);

const login = require('./router/login');
app.use('/',login);

const register = require('./router/registration');
app.use('/',register);

const emailSent  = require('./router/email');
app.use('/',emailSent);




//Port
app.listen(3000,function(){
    console.log('Listening at port 3000')
});
