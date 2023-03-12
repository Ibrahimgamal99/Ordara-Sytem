const connection = require('../model/database');
const { end } = require('../model/database');
const router = require('express').Router()
const bodyParser = require('body-parser');
module.exports = router;
router.put("/user", bodyParser.json(), function (req, res) {
    var user = req.body.user_id
    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var email = req.body.email
    var location = req.body.location
    var sql = "UPDATE `User` SET `First_name`= '" + first_name + "' ,`last_name`='" +
        last_name + "',`Email`= '" + email + "',`Location`= '" + location + "' WHERE `user_id`='" +
        user + "'";
    connection.query(sql, function (err, result) {
        if (err) throw err
        var sql = "SELECT * FROM `User` WHERE `user_id`='" + user + "'";
        connection.query(sql, function (err, result) {
            if (err) throw err
            res.status(200).json({
                result: {
                    "user": result[0].user_id,
                    "First_name": result[0].First_name,
                    "last_name": result[0].last_name,
                    "Email": result[0].Email,
                    "Location": result[0].Location
                }
            })
        })
    })

})
router.put("/delivery", bodyParser.json(), function (req, res) {
    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var email = req.body.email
    var Scooter = req.body.Scooter
    var delivery = req.body.delivery_id

    var sql = "UPDATE `captain` SET `First_name`= '" + first_name + "' ,`last_name`='" +
        last_name + "',`Email`= '" + email + "',`Scooter`= '" + Scooter + "' WHERE `delvary_id`='" +
        delivery + "'";
    connection.query(sql, function (err, result) {
        if (err) throw err
        var sql = "SELECT * FROM `captain` WHERE `delvary_id`='" + delivery + "'";
        connection.query(sql, function (err, result) {
            if (err) throw err
            res.status(200).json({
                result: {
                    "delvary": result[0].delvary_id,
                    "First_name": result[0].First_name,
                    "last_name": result[0].last_name,
                    "Email": result[0].Email,
                    "Scooter": result[0].Scooter
                }
            })
        })
    })

})