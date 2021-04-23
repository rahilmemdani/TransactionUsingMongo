const express = require('express');
const router = express.Router();
const db = require('../conn');



router.post('/register',function(req,res){
    db.collection('login').find({email:req.body.email}).toArray(function(err,rows){
        if(rows==''){
            db.collection('login').insertOne({email:req.body.email,pass:req.body.pass},function(err,rows){
                if(!err){
                    res.send(rows);
                    console.log(rows);
                }else{
                    res.send(err);
                    console.log(err);
                }
            })
        }else{
            res.json({'msg':'Email is already in use'})
        }
    })

})





module.exports = router