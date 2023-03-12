var mysql = require('mysql');
//Connect to Database
var connection = mysql.createConnection({
    host: 'freedb.tech',
    user: 'freedbtech_Ordera',
    password: 'Ordera2021&&',
    database: 'freedbtech_Ordera'
});


connection.connect(function (err) {//check connection to database
    if (err) throw err;
    console.log('connected to mysql host')
})
module.exports = connection;
