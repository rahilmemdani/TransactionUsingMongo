const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const db = require('../conn');
const otpGenerator = require('otp-generator')

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
        user: 'rahilmemdani19',
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
            var mailOptions = {
                from: 'rahilmemdani19@gmail.com',
                to: queryString,
                subject: 'Account debited',
                text: `Dear Customer, transaction of INR ${req.body.amount} done on PayRoll account ${queryString}.`
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

//Sender
router.post('/msgSent', function (req, res) {
    var queryString = req.body.receiver;
    db.collection('login').find({ email: req.body.receiver }).toArray(function (err, rows) {
        if (rows == '') {
            console.log(rows);
            res.json({ 'notReg': 'Email is not registered' });
        } else {
            console.log(queryString);
            var mailOptions = {
                from: 'rahilmemdani19@gmail.com',
                to: queryString,
                subject: 'Account credited',
                text: `Dear Customer, your account ${queryString} is credited by INR ${req.body.amount}. `
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



router.post('/otpReg', function (req, res) {
    var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
    var queryString = req.body.email;
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





module.exports = router;