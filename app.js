var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Redis = require('ioredis');
var user = require('./controllers/user.js');
var language = require('./controllers/language.js');

var app = express();
var router = express.Router();

// 连接mongo
mongoose.connect('mongodb://localhost/language');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (cb) {
    console.info.bind(console, 'mongo connection successfull');
});

var redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
    password: '123456'
});

// post请求参数挂载于req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 网站静态资源托管
app.use(express.static(path.join(__dirname, 'public')));


// 跨域设置
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,code');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

// 判断登录超时
app.use(/^((?!\/user\/login).)*$/, function (req, res, next) {
    var cookies = req.cookies;
    if (!cookies)
        return res.json({ IsSuccess: false, Message: 'session timeout' });

    if (!cookies.session)
        return res.json({ IsSuccess: false, Message: 'session timeout' });

    try {
        var session = JSON.parse(cookies.session);
        redis.exists(session.sessionID, function (err, rs) {
            if (rs) {
                redis.pexpireat(session.sessionID, new Date().getTime() + 60 * 1000);
                req.sessionID = session.sessionID;
                next()
            } else {
                res.json({ IsSuccess: false, Message: 'session timeout' });
            }
        })

    } catch (error) {
        res.json({ IsSuccess: false, Message: 'session timeout' });
    }

})

// 路由控制
app.use('/user', user);
app.use('/language', language);

app.listen(3001, function () {
    console.log('listen on port 3001...');
})

module.exports = app;
