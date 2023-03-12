const connection = require('../model/database');
const { end } = require('../model/database');
const router = require('express').Router()
const bodyParser = require('body-parser');
const { Types } = require('mysql');

router.get("/quick", bodyParser.json(), function (req, res) {

    var menu = []
    var sql = "SELECT * FROM `foods` ";
    connection.query(sql, function (err, result) {
        if (err) throw err
        for (var i = 0; i < 8; i++) {
            menu.push(result[Math.floor(Math.random() * result.length)])
        }
        res.status(200).json({
            result: menu
        })
    })
})
router.post("/quick_detail", bodyParser.json(), function (req, res) {
    try {
        var id = req.body.id
        var sql = "SELECT * FROM `Restaurants` WHERE id=?";
        connection.query(sql, id, function (err, result) {
            if (err) throw err
            res.status(200).json({
                location: result[0].location,
                place_name:result[0].name
            })
        })
    }
    catch (err) {
        console.log(err)
        next(err)
    }
})
router.post("/categroy", bodyParser.json(), function (req, res) {
    try {
        var id_items = req.body.id_items
        var place = req.body.id
        var categroy = req.body.categroy;
        if (categroy == "foods") {
            var sql = "SELECT * FROM `foods` WHERE `item_id`='" + id_items + "' and `id`='" + place + "'";
            connection.query(sql, function (err, result) {
                if (err) throw err
                res.status(200).json({
                    result: result
                })
            })
        } else if (categroy == "groceries") {
            var sql = "SELECT * FROM `groceries` WHERE `item_id`='" + id_items + "' and `id`='" + place + "'";
            connection.query(sql, function (err, result) {
                if (err) throw err
                res.status(200).json({
                    result: result
                })
            })
        }
        else if (categroy == "tools") {
            var sql = "SELECT * FROM `tools` WHERE `item_id`='" + id_items + "' and `id`='" + place + "'";
            connection.query(sql, id_items, function (err, result) {
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
router.post("/place", bodyParser.json(), function (req, res) {
    try {
        var id = req.body.id
        var categroy = req.body.categroy;
        if (categroy == "foods") {
            var sql = "SELECT * FROM `Restaurants` WHERE `id`=?";
            connection.query(sql, id, function (err, result) {
                if (err) throw err
                res.status(200).json({
                    result: result
                })
            })
        } else if (categroy == "groceries") {
            var sql = "SELECT * FROM `supermarket` WHERE `id`=?";
            connection.query(sql, id, function (err, result) {
                if (err) throw err
                res.status(200).json({
                    result: result
                })
            })
        }
        else if (categroy == "tools") {
            var sql = "SELECT * FROM `library` WHERE `id`=?";
            connection.query(sql, id, function (err, result) {
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
module.exports = router;
