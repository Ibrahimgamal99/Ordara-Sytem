const connection = require('../model/database');
const { end } = require('../model/database');
const router = require('express').Router()
const bodyParser = require('body-parser');

router.post("/restaurants", bodyParser.json(), function (req, res) {
    try {
        console.log(req.body)
        var restaurants_name = req.body.name;
        if (restaurants_name) {
            var sql = "SELECT * FROM `Restaurants` WHERE name LIKE '" + restaurants_name + '%' + "'";
            console.log(sql)
            connection.query(sql, function (err, result) {
                if (err) throw err
                res.status(200).json({
                    result: result
                })
            })
        } else {
            var sql = "SELECT * FROM `Restaurants` ";
            connection.query(sql, function (err, result) {
                if (err) throw err
                res.status(200).json({
                    result: result
                })
            })
        }
    }
    catch (err) {
        console.log(err)
        next(err)
    }

})
router.post("/foods", bodyParser.json(), function (req, res) {
    try {
        var restaurants_id = req.body.id;
        if (restaurants_id) {
            var sql = "SELECT * FROM `foods` WHERE id='" + restaurants_id + "'";
            connection.query(sql, function (err, menu) {
                if (err) throw err
                var sql = "SELECT * FROM `Restaurants` WHERE id=?";
                connection.query(sql, restaurants_id, function (err, result) {
                    if (err) throw err
                    res.status(200).json({
                        result: result,
                        menu: menu
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
