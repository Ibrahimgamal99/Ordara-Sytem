const connection = require('../model/database');
const { end } = require('../model/database');
const router = require('express').Router()
const bodyParser = require('body-parser');


router.get("/waitlist", bodyParser.json(), function (req, res) {
    var sql = "SELECT * FROM `waiting_list`";
    connection.query(sql, function (err, result) {
        if (err) throw err
        res.status(200).json({
            result: result
        })
    })
})
router.get("/delvarylist", bodyParser.json(), function (req, res) {
    var sql = "SELECT * FROM `captain`";
    connection.query(sql, function (err, result) {
        if (err) throw err
        res.status(200).json({
            result: result
        })
    })
})
router.post("/delete_delvary", bodyParser.json(), function (req, res) {
    try {
        var id = req.body.id
        var sql = "DELETE FROM `captain` WHERE `delvary_id`=?";
        connection.query(sql, id, function (err, result) {
            if (err) throw err
            res.status(200).json({
                record: "captain person deleted"
            })
        })
    }
    catch (err) {
        console.log(err)
        next(err)
    }
})
router.post("/approve", bodyParser.json(), function (req, res) {
    try {
        console.log(req.body)
        var id = req.body.id;
        var approve = req.body.approve;//apprive is 1 reject is 0

        if (approve == 0) {
            var sql = "DELETE FROM `waiting_list` WHERE `id`=?";
            connection.query(sql, id, function (err, result) {
                if (err) throw err
                res.status(200).json({
                    record: "captain person deleted"
                })
            })
        }
        else {
            var sql = "SELECT * FROM `waiting_list` WHERE `id`=?";
            connection.query(sql, id, function (err, result) {
                if (err) throw err
                var sql = "INSERT INTO `captain`(`First_name`, `last_name`, `password`,`Email`,`Scooter`) VALUES ('" + result[0].First_name + "','" + result[0].last_name + "','" + result[0].password + "','" + result[0].Email + "','" + result[0].Scooter + "');"
                connection.query(sql, function (err, result) {
                    if (err) throw err
                    var sql = "DELETE FROM `waiting_list` WHERE `id`=?";
                    connection.query(sql, id, function (err, result) {
                        if (err) throw err
                    })
                    res.status(200).json({
                        record: "Delvary person added"
                    })
                })
            })

        }
    }
    catch (err) {
        console.log(err)
        next(err)
    }

})
module.exports = router;
