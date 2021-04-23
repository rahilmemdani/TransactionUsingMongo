const express = require('express');
const router = express.Router();
const db = require('../conn');





router.post('/login',function(req,res){
    db.collection('login').find({email:req.body.email}).toArray(function(err,rows){
        if(rows==''){
            res.json({'msgs':'This email id is not registered'})
        }else if(rows[0].pass == req.body.pass && rows[0].email == req.body.email){
            res.json({'suc':'Success'});
            // console.log(rows[0].pass);
        }else if(rows[0].pass != req.body.pass || rows[0].email != req.body.email){
            res.send({'fail':'Incorrect password'})
        }
    })
})






module.exports = router