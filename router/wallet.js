const express = require('express');
const db = require('../conn');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

var http = require('http');
http.createServer(function (req, res) {
    const queryObject = url.parse(req.url, true).query;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Feel free to add query parameters to the end of the url');
})





router.get('/wallet', function (req, res) {
    var queryString=req.query.email
    db.collection('login').find({email:queryString}).toArray(function(err,val){
        if(val == ''){
            res.json({'err':'Window.location.href'})
        }else{
    db.collection("wallet").find().toArray(function (err, rows) {
        if (!err) {
            res.send(rows);
        } else {
            res.send(err);
        }
    })
        }
})

})

router.post('/wallet', function (req, res) {
    var queryString=req.query.email

    db.collection('login').find({ email: req.body.receiver }).toArray(function (err, coll) {
        if (coll == '') {
            res.json({'msgs':"The Reciever's email id is not registered"})
            console.log(coll);
        } else{
            db.collection('wallet').find({reciever:req.body.receiver}).toArray(function(err,rows){
                console.log(queryString);
                console.log(rows);
                if(rows[0].amount >= req.body.amount && req.body.amount>=1 && rows[0].reciever != queryString){
            db.collection('wallet').updateOne({reciever:queryString},{$set:{amount: parseInt(rows[0].amount) - parseInt(req.body.amount)}});
            db.collection('wallet').find({reciever:req.body.receiver}).toArray(function(err,collect){
            db.collection('wallet').updateOne({reciever:req.body.receiver},{$set:{amount: parseInt(collect[0].amount) + parseInt(req.body.amount) }}, function (err, rows) {
                if (!err) {
                    res.json({'successMsg':'Successful'})
                    db.collection('history').insertOne({sender:queryString,receiver:req.body.receiver,amount:req.body.amount,timestamp:new Date()});
                } else {
                    res.send(err);
                }
            })
        })
    }else{
        res.json({'balance':'negative'})
    }
    })
}
    // console.log(coll[0]);
})

})






router.get('/reciept',function(req,res){
    db.collection('history').find().toArray(function(err,rows){
        if(!err){
        res.send(rows);
        }else{
            res.send(err);
        }
    })
})




router.get('/history',function(req,res){
    var queryString=req.query.email
    db.collection('history').find({sender:req.query.email}).toArray(function(err,rows){
        if(!err){
        res.send(rows);
        }else{
            res.send(err);
        }
    })
})


module.exports = router;