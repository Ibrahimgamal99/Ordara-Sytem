const connection = require('../model/database');
const { end } = require('../model/database');
const router = require('express').Router()
const bodyParser = require('body-parser');

router.post("/library", bodyParser.json(), function (req, res) {
    try {
        console.log(req.body)
        var library_name = req.body.name;
        if (library_name) {
            var sql = "SELECT * FROM `library` WHERE name LIKE '" + library_name + '%' + "'";
            connection.query(sql, function (err, result) {
                if (err) throw err
                res.status(200).json({
                    result: result
                })
            })
        } else {
            var sql = "SELECT * FROM `library` ";
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
router.post("/tools", bodyParser.json(), function (req, res) {
    try {
        var library_id = req.body.id;
        if (library_id) {
            var sql = "SELECT * FROM `tools` WHERE id='" + library_id + "'";
            connection.query(sql, function (err, menu) {
                if (err) throw err
                var sql = "SELECT * FROM `library` WHERE id=?";
                connection.query(sql, library_id, function (err, result) {
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
