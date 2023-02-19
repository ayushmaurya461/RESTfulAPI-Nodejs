const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message: "Email exists"
            })
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                user.save()
                    .then( result => {
                        console.log(result);
                        res.status(201).json({
                            message: "User Created"
                        });
                    })
                    .catch( err => {
                        res.status(500).json({
                            error: err
                        });
                    })
                }
            });
        }
    })
};

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: "Authorization Failed!"
            })
        }
        else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: "Authentication Failed"
                    })
                }
                if(result){

                    const token = jwt.sign({
                        email: user[0].email,
                        userID: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1h'
                    });

                    return res.status(200).json({
                        message: "Authentication Successful!",
                        token: token
                    })
                }
                return res.status(401).json({
                    message: "Authentication Failed"
                })
            })
        }
    })
    .catch( err => {
        res.status(500).json({
            error: err
        })
    })
};

exports.delete_user = (req, res, next) => {
    User.remove({ _id: req.params.userID})
        .exec()
        .then( result => {
            res.status(200).json({
                message: "User deleted."
            })
        })
        .catch( err => {
            res.status(500).json({
                error: err
            })
        })
};