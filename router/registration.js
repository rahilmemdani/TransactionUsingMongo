const express = require('express');
const router = express.Router();
const db = require('../conn');


// var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/

router.post('/register',function(req,res){
    db.collection('login').find({email:req.body.email}).toArray(function(err,rows){
        if(rows==''){

            db.collection('login').insertOne({email:req.body.email,pass:req.body.pass},function(err,rows){
                if(!err){
                    res.send(rows);
                    db.collection('wallet').insertOne({reciever: req.body.email,amount:100})
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