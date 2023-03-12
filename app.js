const express = require("express");
const path = require('path')
const cors = require("cors");// for cros err 
const app = express();
const server = require('http').createServer(app);//creat http server 

port = 8080;//port 
var corsOptions = {
    credentials: true,
    origin: "*",
    optionsSuccessStatus: 200, // For legacy browser support
}
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});//web socket
app.use(cors(corsOptions));


//require('./socket/res_to_db')(io)


app.use('/', require('./auth/login'))// login page
app.use('/admin', require('./routes/admin'))
app.use('/cart', require('./routes/carts')) 
app.use('/home', require('./routes/home')) 
app.use('/update', require('./routes/update')) 
app.use('/register', require('./routes/register'))
app.use('/user', require('./user/captain'))
app.use('/delvary', require('./delvary/restaurant'))
app.use('/delvary', require('./delvary/status'))
app.use('/delvary', require('./delvary/library'))
app.use('/delvary', require('./delvary/supermarket'))

app.use(cors());

// get api file 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'api.html'));
});
// listening in port 3001
server.listen(process.env.PORT || port, function () {
    console.log(`listening on port ${port}...`)

});
