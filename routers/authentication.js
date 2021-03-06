const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const checkUsers = require('../middleware/checkUsers');
const UserModel = require('../model/UserModel');
const path = require('path');
const arrBlacklistToken = require('../config/blacklistToken');
const passport = require('passport');
const bcrypt = require('bcrypt');
// const saltRounds = 10;

router.get('/login', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../views/login.html'))
})

// Login
// router.post('/login', function (req, res, next) {
//     let email = req.body.email
//     let password = req.body.password
//     console.log('login: ' + email);
//     UserModel.findOne({ email: email })
//         .then(function (user) {
//             if (user) {
//                 bcrypt.compare(password, user.password, function (err, data) {
//                     if (data) {
//                         var token = jwt.sign({ email: user.email }, 'nodemy', { expiresIn: '24h' })
//                         res.json(token)
//                     } else {
//                         res.json({
//                             message: 'wrong password'
//                         })
//                     }
//                 });
//             } else {
//                 res.json({
//                     message: 'sai tk hoac mk'
//                 })
//             }

//         })
//         .catch(function (err) {
//             res.json({
//                 message: err
//             })
//         })
// })

router.post('/login', function (req, res, next) {
    passport.authenticate('local', { session: false }, function (err, user, info) {
        if (!user || err) {
            return res.json({
                code: 400,
                error:err,
                message: info
            });
        }
        req.logIn(user, { session: false }, function (err) {
            if (err) {
                return res.json({
                    code: 400,
                    error:err,
                    message: err
                });
            }
            var token = jwt.sign({ email: user.email }, 'nodemy', { expiresIn: '24h' })
            return res.json({
                code:200,
                token: token,
                type: user.type
            });
        });
    })(req, res, next);
});

//logout
router.post('/logout', function (req, res, next) {
    req.logout();
    var token = req.cookies.token
    arrBlacklistToken.push(token)
    console.log(arrBlacklistToken);
    res.clearCookie('type', {path: '/'});
    res.json({
        message: 'push token to blacklist success'
    })
})















module.exports = router 