var express = require('express')
var bcrypt = require("bcrypt-inzi")
var jwt = require('jsonwebtoken');
var { userModel, otpModel,} = require('../dbconn/modules')
var api = express.Router();
var SERVER_SECRET = process.env.SECRET || "1234";
var postmark = require("postmark");
var client = new postmark.Client("8fb43547-c56c-4b63-9b33-8484b9f935cc");

api.post("/signup", (req, res, next) => {

    if (!req.body.name ||
        !req.body.email ||
        !req.body.password ||
        !req.body.phone) {

        res.status(403).send(`
            please send name, email, password, and phone in json body.
            e.g:
            {
                "name": "Ahmed",
                "email": "Ahmed@gmail.com",
                "password": "abc",
                "phone": "0315555555"
            }`)
        return;
    }

    userModel.findOne({ email: req.body.email },
        function (err, doc) {
            if (!err && !doc) {

                bcrypt.stringToHash(req.body.password).then(function (hash) {

                    var newUser = new userModel({
                        "name": req.body.name,
                        "email": req.body.email,
                        "password": hash,
                        "phone": req.body.phone,
                    })
                    newUser.save((err, data) => {
                        if (!err) {
                            res.send({
                                status: 200,
                                message: "user created"
                            })
                        } else {
                            console.log(err);
                            res.status(500).send({
                                message: "user create error, " + err
                            })
                        }
                    });
                })

            } else if (err) {
                res.status(500).send({
                    message: "db error"
                })
            } else {
                res.send({
                    message: "user already exist"
                })
            }
        })

})

api.post("/login", (req, res, next) => {

    if (!req.body.email || !req.body.password) {

        res.status(403).send(`
            please send email and password in json body.
            e.g:
            {
                "email": "ahmed@gmail.com",
                "password": "abc",
            }`)
        return;
    }

    userModel.findOne({ email: req.body.email },
        function (err, user) {
            if (err) {
                res.status(500).send({
                    message: "an error occured: " + JSON.stringify(err)
                });
            } else if (user) {

                bcrypt.varifyHash(req.body.password, user.password).then(isMatched => {
                    if (isMatched) {
                        console.log("matched");

                        var token =
                            jwt.sign({
                                id: user._id,
                                name: user.name,
                                email: user.email,
                            }, SERVER_SECRET)

                        res.cookie('jToken', token, {
                            maxAge: 86400000,
                            httpOnly: true
                        });

                        res.send({
                            status: 200,
                            message: "login success",
                            user: {
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                            }
                        });

                    } else {
                        console.log("not matched");
                        res.send({
                            message: "Incorrect password or email"
                        })
                    }
                }).catch(e => {
                    console.log("error: ", e)
                })

            } else {
                res.send({
                    message: "user not found"
                });
            }
        });
})

// api.post("/logout", (req, res, next) => {
//     res.clearCookie('jToken')

//     res.send("logout success");
// })

api.post('/forget-password', (req, res, next) => {
    if (!req.body.email) {
        res.status(403).send({
            message: "please provide email"
        })
    }
    userModel.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            res.status(500).send({
                message: "Something went wrong"
            })
        } else if (user) {
            const otp = Math.floor(generetOtp(111111, 999999))
            otpModel.create({
                email: req.body.email,
                otp: otp
            }).then((data) => {
                client.sendEmail({
                    "From": "ahmedraza_student@sysborg.com",
                    "To": req.body.email,
                    "Subject": "Reset Your Password",
                    "Textbody": `Here is your Reset password code : ${otp}`
                }, (err, status) => {
                    if (status) {
                        res.send({
                            status: 200,
                            message: "Email send successfully"
                        })
                    } else {
                        res.send({
                            message: "An unexpected error occured"
                        })
                    }
                })
            })
        } else {
            res.send({
                message: "User not found"
            })
        }
    })

})

api.post('/forget-password-2', (req, res, next) => {
    if (!req.body.email && !req.body.newPassword && !req.body.otp) {
        res.status(403).send({
            message: "please provide email"
        })
    }

    userModel.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            res.status(500).send({
                message: "Something went wrong"
            })
        } else if (user) {
            otpModel.find({ email: req.body.email }, (err, otpData) => {
                if (err) {
                    res.status(500).send({
                        message: "Something went wrong"
                    })
                } else if (otpData) {
                    console.log(otpData)
                    otpData = otpData[otpData.length - 1]
                    const nowDate = new Date().getTime();
                    const otpIat = new Date(otpData.createdOn).getTime();
                    const diff = nowDate - otpIat;
                    if (otpData.otp == req.body.otp && diff < 300000) {
                        otpData.remove();
                        bcrypt.stringToHash(req.body.newPassword).then(function (hash) {
                            user.update({ password: hash }, {}, function (err, data) {
                                res.send({
                                    status: 200,
                                    message: "Password updated"
                                });
                            })
                        })
                    } else {
                        res.send({
                            message: "incorrect otp"
                        });
                    }
                } else {
                    res.send({
                        message: "incorrect otp"
                    });
                }
            })
        } else {
            res.send({
                message: "User Not Found"
            })
        }
    })
})

function generetOtp(min, max) {
    return Math.random() * (max - min) + min;
}
module.exports = api;