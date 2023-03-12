const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const connection = require('../model/database')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
//login
router.post("/signin", bodyParser.json(), function (req, res) {
    try {
        console.log(req.body)
        var email = req.body.email
        var password = req.body.password
        var type = req.body.type;
        // if user select type user send 1
        if (email && password) {
            if (type == 1) {
                // check if user exist 
                connection.query("SELECT * FROM `User` WHERE `Email`=?", email, function (err, result) {
                    if (result.length > 0) {//if exist convert string paswd to hash code 
                        if (bcrypt.compareSync(password, result[0].password)) {
                            console.log("This is user")//المفروض يتحول علي الداش بورد
                            // send user info to frontend 
                            res.status(200).json({
                                result: {
                                    "user": result[0].user_id,
                                    "First_name": result[0].First_name,
                                    "last_name": result[0].last_name,
                                    "Email": result[0].Email,
                                    "Location": result[0].Location
                                }
                            })
                        }
                        else {
                            // send Wrong Password to frontend 
                            console.log("Password dont match")//المفروض يتطبع الرسالة 
                            res.status(405).json({
                                error: "Wrong Password"
                            })
                        }
                        if (err) throw err;
                    }
                    else {
                        // send user dont Exist to frontend
                        console.log("User dont Exist")
                        res.status(400).json({
                            error: "User dont Exist"
                        })
                    }
                });
            } else if (type == 2) {
                // if type = 2 this is Delvary 
                connection.query("SELECT * FROM `captain` WHERE `Email`=?", email, function (err, d) {
                    if (d.length > 0) {
                        //if exist convert string paswd to hash code 
                        if (bcrypt.compareSync(password, d[0].password)) {
                            console.log("This is Delvary")//المفروض يتحول علي الداش بورد
                            res.status(200).json({
                                result: {
                                    "delvary": d[0].delvary_id,
                                    "First_name": d[0].First_name,
                                    "last_name": d[0].last_name,
                                    "Email": d[0].Email,
                                    "Scooter": d[0].Scooter
                                }
                            })
                        }
                        else {
                            console.log("Passwords dont match")//المفروض يتطبع الرسالة 
                            res.status(405).json({
                                error: "Wrong Passwords"
                            })
                        }
                        if (err) throw err;
                    }
                    else {
                        console.log("Delvary dont Exist")
                        res.status(400).json({
                            error: "Delvary dont Exist"
                        })
                    }
                });

            }
            else if (type == 3) {
                connection.query("SELECT * FROM `Admin` WHERE `Email`=?", email, function (err, result) {
                    console.log(result)

                    if (result.length > 0) {
                        //if exist convert string paswd to hash code 
                        if (password == result[0].password) {
                            console.log("This is Admin")//المفروض يتحول علي الداش بورد
                            res.status(200).json({
                                    record: "this is admin"
                            })
                        }
                        else {
                            console.log("Passwords dont match")//المفروض يتطبع الرسالة 
                            res.status(405).json({
                                error: "Wrong Passwords"
                            })
                        }
                        if (err) throw err;
                    }
                    else {
                        console.log("admin dont Exist")
                        res.status(400).json({
                            error: "admin dont Exist"
                        })
                    }
                });
            }
        }
        else {
            res.status(405).json({
                error: "json error"
            })
        }
    }
    catch (err) {
        console.log(err)
        next(err)
    }
});
module.exports = router;