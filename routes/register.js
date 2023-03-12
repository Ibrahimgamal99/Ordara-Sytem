const router = require('express').Router()
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const connection = require('../model/database')

//Creat new user
router.post("/signupuser", bodyParser.json(), function (req, res) {
    try {
        console.log(req.body)
        var first_name = req.body.first_name
        var last_name = req.body.last_name
        var password = req.body.password
        var email = req.body.email
        var location = req.body.location

        let pw = bcrypt.hashSync(password, 10);
        if (email) {// user is exist
            connection.query("SELECT * FROM `User` WHERE `Email`=?", email, function (err, result) {
                if (result.length > 0) {
                    console.log("User is exit");
                    res.status(404).json({
                        error: "User is Exist"
                    })
                    if (err) throw err;
                }
                else {// create new user 
                    var sql = "INSERT INTO `User`(`First_name`, `last_name`, `password`,`Email`,`Location`) VALUES ('" + first_name + "','" + last_name + "','" + pw + "','" + email + "','" + location + "');"
                    connection.query(sql, function (err, result) {
                        if (err) throw err
                        console.log("user inserted");
                        res.status(200).json({
                            record: "User inserted"
                        })
                    })
                }
            });
        }
    }
    catch (err) {
        console.log(err)
        next(err)
    }
})
router.post("/signupdelvary", bodyParser.json(), function (req, res,next) {
    try {
        console.log(req.body)
        var first_name = req.body.first_name
        var last_name = req.body.last_name
        var password = req.body.password
        var email = req.body.email
        var Scooter = req.body.Scooter
        let pw = bcrypt.hashSync(password, 10);
        if (email) {// captain is exist
            connection.query("SELECT * FROM `captain` WHERE `Email`=?", email, function (err, result) {
                if (result.length > 0) {
                    console.log("captain is exit");
                    res.status(404).json({
                        error: "captain is Exist"
                    })
                    if (err) throw err;
                }
                else {
                    // create new captain 
                    var sql = "INSERT INTO `waiting_list`(`First_name`, `last_name`, `password`,`Email`,`Scooter`) VALUES ('" + first_name + "','" + last_name + "','" + pw + "','" + email + "','" + Scooter + "');"
                    connection.query(sql, function (err, result) {
                        if (err) throw err
                        console.log("captain inserted in waiting list");
                        res.status(200).json({
                            record: "captain inserted in waiting list"
                        })
                    })
                }
            });
        }
    }
    catch (err) {
        console.log(err)
        next(err)
    }
})

module.exports = router;
