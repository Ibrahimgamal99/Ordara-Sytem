const connection = require('../model/database');
const { end } = require('../model/database');
const router = require('express').Router()
const bodyParser = require('body-parser');
module.exports = router;
router.post("/transportation", bodyParser.json(), function (req, res) {
    try {
        console.log(req.body)
        var id = req.body.delvary_id
        var sql = "SELECT * FROM `captain_trans` WHERE delevry='" + id + "'";
        connection.query(sql, function (err, result) {
            if (err) throw err
            res.status(200).json({
                result: result
            })
        })
    }
    catch (err) {
        console.log(err)
        next(err)
    }

})

router.post("/delivery", bodyParser.json(), function (req, res) {
    try {
        console.log(req.body)
        var id = req.body.delvary_id
        var sql = "SELECT * FROM `captain_delivery` WHERE `delivery_id`='" + id + "'";
        connection.query(sql, function (err, delivery) {
            if (err) throw err
            var sql = "SELECT * FROM `captain_delivery_menu` WHERE `delivery_id`='" + id + "'";
            connection.query(sql, function (err, menu) {
                console.log(menu.length)

                for (var i = 0; i < delivery.length - 1; i++) {
                    delivery[i].menuId = i + 1
                    delivery[i].menu = []
                    for (var j = 0; j < menu.length; j++) {
                        if (delivery[i].place_name == menu[j].place_name) {
                            delivery[i].menu.push(menu[j])
                        }
                    }
                }
                var sql = "SELECT * FROM `captain_delivery_salary` WHERE delivery_id='" + id + "'";
                connection.query(sql, function (err, salary) {
                    if (err) throw err
                    res.status(200).json({
                        "delivery": delivery,
                        "salary": salary
                    })
                })
                if (err) throw err

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
        var id = req.body.delvary_id
        var type = req.body.type
        if (type == 'transportation') {
            var sql = "DELETE  FROM `captain_trans` WHERE delevry='" + id + "'";
            connection.query(sql, function (err, result) {
                if (err) throw err
                res.status(200).json({
                    result: "deleted"
                })
            })
        }
        else if (type == 'delivery') {
            var sql = "DELETE  FROM `captain_delivery` WHERE delivery_id='" + id + "'";
            connection.query(sql, function (err, result) {
                if (err) throw err
                var sql = "DELETE  FROM `captain_delivery_menu` WHERE delivery_id='" + id + "'";
                connection.query(sql, function (err, result) {
                    if (err) throw err
                    var sql = "DELETE  FROM `captain_delivery_salary` WHERE delivery_id='" + id + "'";
                    connection.query(sql, function (err, result) {
                        if (err) throw err
                        res.status(200).json({
                            result: "deleted"
                        })
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
