const connection = require('../model/database');
const { end } = require('../model/database');
const router = require('express').Router()
const bodyParser = require('body-parser');

router.post("/supermarket", bodyParser.json(), function (req, res) {
    try {
        console.log(req.body)
        var supermarket_name = req.body.name;
        if (supermarket_name) {
            var sql = "SELECT * FROM `supermarket` WHERE name LIKE '" + supermarket_name + '%' + "'";
            connection.query(sql, supermarket_name, function (err, result) {
                if (err) throw err
                res.status(200).json({
                    result: result
                })
            })
        } else {
            var sql = "SELECT * FROM `supermarket`";
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
router.post("/groceries", bodyParser.json(), function (req, res) {
    try {
        console.log(req.body)
        var supermarket_id = req.body.id;
        if (supermarket_id) {
            var sql = "SELECT * FROM `groceries` WHERE id='" + supermarket_id + "'";
            connection.query(sql, function (err, menu) {
                if (err) throw err
                var sql = "SELECT * FROM `supermarket` WHERE id=?";
                connection.query(sql, supermarket_id, function (err, result) {
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
