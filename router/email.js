const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const db = require('../conn');
const otpGenerator = require('otp-generator')

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    // service: 'gmail',
    auth: {
        user: 'rahilmemdani19@gmail.com',
        pass: 'wyXbik-degren-mocmy4'
    }
});

router.post('/email', function (req, res) {

    db.collection('login').find({ email: req.body.email }).toArray(function (err, rows) {
        if (rows != '') {
            console.log(rows);
            res.json({ 'sentAlready': 'Email is already registered' });
        } else {
            var mailOptions = {
                from: 'rahilmemdani19@gmail.com',
                to: req.body.email,
                subject: 'Registration confirmed',
                text: `Congratulations! ${(req.body.name).toUpperCase()}, you have been registered successfully on PayRoll!!`
            };


            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.json({ 'Error: ': error });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ 'Mail': 'sent' });
                }
            })
        }
    })
})


//Reciever
router.post('/msgRec', function (req, res) {
    var queryString = req.query.email;
    db.collection('login').find({ email: req.body.receiver }).toArray(function (err, rows) {
        if (rows == '') {
            console.log(rows);
            res.json({ 'notReg': 'Email is not registered' });
        } else {
            console.log(queryString);
            db.collection("wallet").find({reciever:queryString}).toArray(function(err,coll) {
                if(!err){
                    console.log(coll[0]);
                    res.send(coll[0]);
            var mailOptions = {
                from: 'rahilmemdani19@gmail.com',
                to: queryString,
                subject: 'Account debited',
                text: `Dear Customer, transaction of INR ${req.body.amount} done on PayRoll account ${queryString}.  Avail Bal in A/c INR ${coll[0].amount}.`
            };


            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.json({ 'Error: ': error });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ 'Mail': 'sent' });
                }
            })
        }else{
            console.log(err);
            res.send(err);
        }
})
        }
    })
})

//Sender
router.post('/msgSent', function (req, res) {
    var queryString = req.body.receiver;
    db.collection('login').find({ email: req.body.receiver }).toArray(function (err, rows) {
        if (rows == '') {
            console.log(rows);
            res.json({ 'notReg': 'Email is not registered' });
        } else {
            console.log(queryString);

            db.collection("wallet").find({reciever:queryString}).toArray(function(err,coll) {
                    if(!err){
                        console.log(coll[0]);
                        res.send(coll[0]);
                        


            var mailOptions = {
                from: 'rahilmemdani19@gmail.com',
                to: queryString,
                subject: 'Account credited',
                text: `Dear Customer, your account ${queryString} is credited by INR ${req.body.amount}. Avail Bal in A/c INR ${coll[0].amount}. `
            };


            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.json({ 'Error: ': error });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ 'Mail': 'sent' });
                }
            })
        }else{
            console.log(err);
            res.send(err);
        }
})
        }
    })
})

//OTP


router.post('/otp', function (req, res) {
    var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
    var queryString = req.query.email;
    console.log(queryString);
    db.collection('login').find({ email: queryString }).toArray(function (err, rows) {
        if (rows == '') {
            console.log(rows);
            res.json({ 'notReg': 'Email is not registered' });
        } else {
            console.log(queryString);
            var mailOptions = {
                from: 'rahilmemdani19@gmail.com',
                to: queryString,
                subject: 'OTP for the transaction',
                text: `Dear Customer, the OTP for your transaction is ${otp}. Don't share it with anyone.`
            };


            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.json({ 'Error: ': error });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ 'otp': otp });
                }
            })
        }
    })
})

router.get('/encrypt',function(req,res){
    var otp = otpGenerator.generate(50, { upperCase: false, specialChars: false, alphabets: true });
    res.send(otp);
    db.collection('homeEnc').insertOne({otp:otp})
})

router.get('/encryptHome',function(req,res){
    db.collection('homeEnc').find().toArray(function (err,rows) {
        if(!err){
            res.send(rows[rows.length-1]);
        }else{
            res.send(err);
        }
    })
})



router.post('/otpReg', function (req, res) {
    var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
    var queryString = req.body.email;
    console.log(queryString);
    db.collection('login').find({ email: queryString }).toArray(function (err, rows) {
        if (rows == '') {
            console.log(queryString);
            var mailOptions = {
                from: 'rahilmemdani19@gmail.com',
                to: queryString,
                subject: 'OTP for Email Verification',
                text: `Dear Customer, ${otp} is your One Time Password (OTP) for email verification. Don't share it with anyone.`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.json({ 'Error': error });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ 'otp': otp });
                }
            })
        } else {
            console.log(rows);
            res.json({ 'notReg': 'Email is already registered' });
        }
    })
})





module.exports = router;