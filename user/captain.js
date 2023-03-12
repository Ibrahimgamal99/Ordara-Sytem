const axios = require('axios')
const connection = require('../model/database');
const router = require('express').Router()
const bodyParser = require('body-parser');
module.exports = router
//const oldkey = "AIzaSyA7nfzqox7HP_crX14tFzVLVpW3r5PnHoI";


router.put("/status", bodyParser.json(), function (req, res) {
    try {
        var id = req.body.delvary_id
        var online = req.body.status
        var type = req.body.type
        var location = req.body.location
        var sql = "UPDATE `captain` set `online_status`='" + online + "',`translation_status`= '" +
            type + "',`location`= '" + location + "' where `delvary_id`=?";
        connection.query(sql, id, function (err, result) {
            if (err) throw err
            res.status(200).json({
                record: "status updeted"
            })
        })
    }
    catch (err) {
        console.log(err)
        next(err)
    }

})
router.post("/rate", bodyParser.json(), function (req, res) {
    try {
        var id = req.body.delvary_id
        var rate = req.body.rate

        var sql = "INSERT INTO `rate`(`captain_id`, `rate`) VALUES('" + id + "' ,'" + rate + "');"
        connection.query(sql, id, function (err, result) {
            if (err) throw err
            res.status(200).json({
                record: "rated"
            })
        })
    }
    catch (err) {
        console.log(err)
        next(err)
    }

})

function distance_api(user_location, key, captains_location) {
    var s = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=`
    var e = `&destinations=${user_location}&key=${key}`
    for (var i = 0; i < captains_location.length; i++) {
        if (i == captains_location.length - 1)
            s = s.concat(captains_location[i])
        else
            s = s.concat(captains_location[i] + '|')

    }
    var user_location = s.concat(e);
    return user_location
}


function get_index(data) {
    var distance = []
    var temp, index = 0, x;
    for (var i = 0; i < data.rows.length; i++) {

        temp = data.rows[i].elements[0].distance.text.split(' ')
        if (temp[i, 1] == 'ft') {
            temp[i, 0] = (parseFloat(temp[i, 0]) / 5280).toFixed(5)
        }
        temp[i, 0] = temp[i, 0].toString()
        if (temp[0].indexOf(',') == 1) {
            temp = temp[0].split(',')
            x = temp[0] + temp[1]
            temp[0] = x
        }
        distance.push(parseFloat(temp[0]))
    }
    temp = distance[0]
    for (var i = 0; i < distance.length; i++) {
        if (distance[i] < temp) {
            temp = distance[i]
            index = i
        }
    }
    return index
}

router.post("/transportation", bodyParser.json(), async (req, res, next) => {
    try {
        var location = req.body.user_location
        var captains_location = []
        var rate = 0
        const key = "AIzaSyC_5HAzjVTSMJ3SFuZcxyv3-eddSB_70NE";
        var sql = "SELECT * FROM `captain` where `online_status`=1 and `translation_status`=1";
        connection.query(sql, async (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    captains_location.push(result[i].location)
                }
                const { data } = await axios.get(distance_api(location, key, captains_location))
                console.log(captains_location)
                console.log(result[get_index(data)].delvary_id)

                var sql = "SELECT * FROM `rate` where `captain_id`=?";
                connection.query(sql, result[get_index(data)].delvary_id, function (err, r) {
                    for (var i = 0; i < r.length; i++) {
                        rate = rate + r[i].rate
                    }
                    rate /= r.length
                    var temp = data.rows[get_index(data)].elements[0].distance.text.split(' ')
                    if (temp[0, 1] == 'ft') {
                        temp[0, 0] = (parseFloat(temp[i, 0]) / 5280).toFixed(5)
                    }
                    if (err) throw err
                    res.status(200).json({
                        "delvary_id": result[get_index(data)].delvary_id,
                        "frist_name": result[get_index(data)].First_name,
                        "last_name": result[get_index(data)].last_name,
                        "Scooter": result[get_index(data)].Scooter,
                        "location": result[get_index(data)].location,
                        "Email": result[get_index(data)].Email,
                        "distance": temp[0],
                        "duration": data.rows[get_index(data)].elements[0].duration.text,
                        "rate": rate
                    })
                })
            }
            else {
                res.status(400).json({
                    error: "no captain active"
                })
            }
        })
    }
    catch (err) {
        console.log(err)
        next(err)
    }
})

router.post("/go_location", bodyParser.json(), async (req, res, next) => {
    try {
        var id = req.body.delvary_id
        var s_location = req.body.user_location
        var lat_s = req.body.lat_s
        var long_s = req.body.long_s
        var lat_e = req.body.lat_e
        var long_e = req.body.long_e
        var e_location = req.body.end_location
        var salary
        const key = "AIzaSyC_5HAzjVTSMJ3SFuZcxyv3-eddSB_70NE";
        const { data } = await axios.get(
            `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${s_location}&destinations=${e_location}&key=${key}`
        )
        salary = parseFloat(data.rows[0].elements[0].distance.text) * 6.5
        console.log(salary)
        var distance //= data.rows[0].elements[0].distance.text
        var temp = data.rows[0].elements[0].distance.text.split(' ')
        if (temp[0, 1] == 'ft') {
            temp[0, 0] = (parseFloat(temp[i, 0]) / 5280).toFixed(5)
        }
        distance = temp[0]
        var duration = data.rows[0].elements[0].duration.text
        var sql = "INSERT INTO `captain_trans`(`delevry`, `From_location`, `to_location`,`lat_s`, `long_s`,`lat_e`,`long_e`,`distance`, `duration`,`salary`) VALUES ('"
            + id + "','" + s_location + "','" + e_location + "','" + lat_s + "','" + long_s + "','" +
            lat_e + "','" + long_e + "','" + distance + "','" + duration + "','" + salary + "');"
        connection.query(sql, function (err, result) {
            if (err) throw err
            res.status(200).json({
                "distance": distance,
                "duration": duration,
                "salary": salary
            })
        })
    }
    catch (err) {
        next(err)
    }
})
async function distance(s_location, e_location, key) {
    const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${s_location}&destinations=${e_location}&key=${key}`
    )
    var d = data.rows[0].elements[0].distance.text.split(' ')
    //console.log(distance[0, 1])
    if (d[0, 1] == 'ft') {
        d[0, 0] = (parseFloat(d[0, 0]) / 5280).toFixed(5)
    }
    d = parseFloat(d[0, 0])
    return d
}
async function duration(s_location, e_location, key) {
    const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${s_location}&destinations=${e_location}&key=${key}`
    )
    var duration = data.rows[0].elements[0].duration.text.split(' ')
    if (duration.length > 2) {
        duration[0] = parseInt(duration[0]) * 60
        duration[2] = parseInt(duration[2])
        duration = duration[0] + duration[2]
    }
    else {
        duration[0] = parseInt(duration[0])
        duration = duration[0]
    }
    return duration
}
router.post("/delivery", bodyParser.json(), async (req, res, next) => {
    try {
        var user_id = req.body.user_id
        var location = []
        var from = []
        var to = []
        var user_location
        var place_name = []
        var captains_location = []
        var dur = 0, dis = 0, rate = 0
        const key = "AIzaSyC_5HAzjVTSMJ3SFuZcxyv3-eddSB_70NE";
        var sql = "SELECT * FROM `carts` where `user_id`=?";
        connection.query(sql, user_id, function (err, carts) {
            if (err) throw err
            user_location = carts[0].user_location
            for (var i = 0; i < carts.length; i++) {
                location.push(carts[i].prudect_location)
                place_name.push(carts[i].place_name)
            }
            var uniq = [...new Set(location)];
            var name = [...new Set(place_name)];
            var sql = "SELECT * FROM `captain` where `online_status`=1 and `translation_status`=0";
            connection.query(sql, async (err, result) => {
                if (err) throw err
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        captains_location.push(result[i].location)
                    }
                    const { data } = await axios.get(distance_api(uniq[0], key, captains_location))
                    for (var i = 0; i < uniq.length - 1; i++) {
                        if (i == 0) {
                            dis += await distance(captains_location[get_index(data)], uniq[i], key)
                            dur += await duration(captains_location[get_index(data)], uniq[i], key)
                            from.push(captains_location[get_index(data)])
                            to.push(uniq[i])
                            dis += await distance(uniq[i], uniq[i + 1], key)
                            dur += await duration(uniq[i], uniq[i + 1], key)
                            from.push(uniq[i])
                            to.push(uniq[i + 1])
                        }
                        else {

                            dis += await distance(uniq[i], uniq[i + 1], key)
                            dur += await duration(uniq[i], uniq[i + 1], key)
                            from.push(uniq[i])
                            to.push(uniq[i + 1])
                        }
                    }
                    dis += await distance(user_location, uniq[uniq.length - 1], key)
                    dur += await duration(user_location, uniq[uniq.length - 1], key)
                    from.push(uniq[uniq.length - 1])
                    to.push(user_location)
                    console.log(name)
                    console.log(from)
                    console.log(to)
                    if (from.length == 1) {
                        var sql = "INSERT INTO `captain_delivery`(`delivery_id`, `place_name`, `from_location`, `to_location`) VALUES ('"
                            + result[get_index(data)].delvary_id + "','" + carts[i].place_name + "','" +
                            result[get_index(data)].location + "','" + from[i] + "')";
                        connection.query(sql, function (err, result) {
                            if (err) throw err
                        })
                        var sql = "INSERT INTO `captain_delivery`(`delivery_id`, `place_name`, `from_location`, `to_location`) VALUES ('"
                            + result[get_index(data)].delvary_id + "','user loaction','" +
                            from[i] + "','" + to[i] + "')";
                        connection.query(sql, function (err, result) {
                            if (err) throw err
                        })
                    }
                    else {
                        for (var i = 0; i < from.length; i++) {
                            if (i == from.length - 1) {
                                var sql = "INSERT INTO `captain_delivery`(`delivery_id`, `place_name`, `from_location`, `to_location`) VALUES ('"
                                    + result[get_index(data)].delvary_id + "','user loaction','" +
                                    from[i] + "','" + to[i] + "')";
                                connection.query(sql, function (err, result) {
                                    if (err) throw err
                                })
                            }
                            else {
                                var sql = "INSERT INTO `captain_delivery`(`delivery_id`, `place_name`, `from_location`, `to_location`) VALUES ('"
                                    + result[get_index(data)].delvary_id + "','" + name[i] + "','" +
                                    from[i] + "','" + to[i] + "')";
                                connection.query(sql, function (err, result) {
                                    if (err) throw err
                                })
                            }
                        }
                    }
                    for (var i = 0; i < carts.length; i++) {
                        var sql = "INSERT INTO `captain_delivery_menu`(`delivery_id`, `place_name`, `product_name`, `qty`, `total`) VALUES ('"
                            + result[get_index(data)].delvary_id + "','" + carts[i].place_name + "','" +
                            carts[i].product_name + "','" + carts[i].qty + "','" + carts[i].total + "')";
                        connection.query(sql, function (err, result) {
                            if (err) throw err
                        })
                    }

                    var sql = "SELECT * FROM `rate` where `captain_id`=?";
                    connection.query(sql, result[get_index(data)].delvary_id, function (err, r) {
                        for (var i = 0; i < r.length; i++) {
                            rate = rate + r[i].rate
                        }
                        rate /= r.length
                        var salary = (dis * 6.5).toFixed(4)
                        dis = ((dis).toFixed(4)).toString() / 1.61
                        dur = (dur).toString() + " mins"
                        if (err) throw err
                        var tt = 0, idd = result[get_index(data)].delvary_id
                        console.log(idd)
                        var sql = "SELECT * FROM `captain_delivery_menu` WHERE delivery_id='" + idd + "'";
                        connection.query(sql, function (err, result) {
                            if (err) throw err
                            for (var i = 0; i < result.length; i++) {
                                tt += result[i].total
                            }
                            var s = parseFloat(tt) + parseFloat(salary)
                            var sql = "INSERT INTO `captain_delivery_salary`(`delivery_id`, `total_cart`, `salary`, `total`) VALUES('"
                                + idd + "','" + tt + "','" + salary + "','" + s + "')";
                            connection.query(sql, function (err, result) {
                                if (err) throw err
                            })
                        })

                        res.status(200).json({
                            "delvary_id": result[get_index(data)].delvary_id,
                            "frist_name": result[get_index(data)].First_name,
                            "last_name": result[get_index(data)].last_name,
                            "Scooter": result[get_index(data)].Scooter,
                            "location": result[get_index(data)].location,
                            "Email": result[get_index(data)].Email,
                            "distance": dis,
                            "duration": dur,
                            "salary": salary,
                            "rate": rate
                        })
                    })
                }
                else {
                    res.status(400).json({
                        error: "no captain active"
                    })
                }
            })
        })
    }
    catch (err) {
        console.log(err)
        next(err)
    }
})

router.get("/delivery_dirction/:id", bodyParser.json(), async function (req, res) {
    var id = req.params.id
    var place, user_location
    var sql = "SELECT * FROM `captain_delivery` where `delivery_id`=?";
    connection.query(sql, id, async (err, result) => {
        if (err) throw err
        place = result[0].from_location
        user_location = result[result.length - 1].to_location
        var s = `https://maps.googleapis.com/maps/api/geocode/json?address=${place}|${user_location}&key=AIzaSyC_5HAzjVTSMJ3SFuZcxyv3-eddSB_70NE `
        const { data } = await axios.get(s)
        res.json(data)
    })

})

// res.status(200).json({
//     "place": result[0].from_location,
//     "user_location": result[result.length - 1].to_location
// })
// test location and apis
router.post("/dis", bodyParser.json(), async (req, res) => {
    const key = "AIzaSyC_5HAzjVTSMJ3SFuZcxyv3-eddSB_70NE";
    var user_location = req.body.user
    var captain = req.body.captain
    var s = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${captain}&destinations=${user_location}&key=${key}`
    const { data } = await axios.get(s)
    res.json(data)

})
// {
//     "user_location": "Mohammed El-Sayed, Al Khosous, Al Khankah, Al Qalyubia Governorate",
//     "places": [
//         "Amin Yousry, Al Khosous, El Marg, Cairo Governorate",
//         "52-4 El-Salam, Al Khosous, Al Khankah, Al Qalyubia Governorate",
//         "22-4 Fahmy Abd El-Aziz, Al Khosous, Al Khankah, Al Qalyubia Governorate"
//     ]
// }

