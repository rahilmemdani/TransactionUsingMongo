const express = require('express');
const db = require('../conn');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/wallet', function (req, res) {
    db.collection("wallet").find().toArray(function (err, rows) {
        if (!err) {
            res.send(rows);
            console.log(req.body.sender);
        } else {
            res.send(err);
        }
    })
})

router.post('/wallet', function (req, res) {
    db.collection('login').find({ email: req.body.receiver }).toArray(function (err, rows) {
        if (rows == '') {
            res.json({'msgs':"The Reciever's email id is not registered"})
        } else {
            db.collection('wallet').insertOne({ reciever: req.body.receiver }, function (err, rows) {
                if (!err) {
                    res.send(rows)
                } else {
                    res.send(err);
                }
            })

        }
    })
})



module.exports = router;