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
            db.collection('wallet').find({reciever:queryString}).toArray(function(err,rows){
                if(rows[0].amount >= req.body.amount && req.body.amount>=1){
            db.collection('wallet').updateOne({reciever:queryString},{$set:{amount: parseInt(rows[0].amount) - parseInt(req.body.amount)}});
            db.collection('wallet').find({reciever:req.body.receiver}).toArray(function(err,collect){
            db.collection('wallet').updateOne({reciever:req.body.receiver},{$set:{amount: parseInt(collect[0].amount) + parseInt(req.body.amount) }}, function (err, rows) {
                if (!err) {
                    res.json({'successMsg':'Successful'})
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



module.exports = router;