var mongoose = require('mongoose');
var Redis = require('ioredis');
var uuid = require('node-uuid');
var User = require('../models/user.js');

var redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
    password: '123456'
});

/**
 * 新增用户
 * @param  {Object} req
 * @param  {Object} res
 */
function addUser(req, res) {
    var isSuccess = false;
    var message = '';
    var uName = req.body.uName || '';
    var uPwd = req.body.uPwd || '';

    var user = new User({
        UserID: new mongoose.Types.ObjectId,
        UserName: uName,
        Password: uPwd
    });

    user.save(function (err) {
        if (err) {
            console.log(err.message);
            isSuccess = false;
            message = '保存用户失败。';
            res.json({ IsSuccess: false, Message: '保存用户失败。' });
        } else {
            res.json({ IsSuccess: true, Message: '保存成功。' });
        }
    });

}

/**
 * 登录
 * @param  {Object} req
 * @param  {Object} res
 */
function login(req, res) {
    var isSuccess = false;
    var message = '';
    var uName = req.body.uName || '';
    var pwd = req.body.pwd || '';

    User.findOne({ UserName: uName, Password: pwd }, function (err, user) {
        if (err) {
            console.log(err.message);
            res.json({ IsSuccess: false, Message: err.message });
        }

        if (user) {
            var sessionID = uuid.v1();
            if (req.sessionID){ 
                redis.del(req.sessionID);
            }
            redis.set(sessionID, JSON.stringify({ UserID: user.UserID, UserName: user.UserName }));
            redis.pexpireat(sessionID, new Date().getTime() + 60 * 1000);
            res.json({ IsSuccess: true, Message: '登录成功。', Session: { sessionID: sessionID } });
        } else {
            res.json({ IsSuccess: false, Message: '用户名或密码错误。' });
        }
    })
}

/**
 * 登出
 * @param  {Object} req
 * @param  {Object} res
 */
function signout(req, res) {
    try {
        var sessionid = req.sessionID;
        redis.del(sessionid);
        res.json({ IsSuccess: true, Message: '' });
    } catch (error) {
        res.json({ IsSuccess: false, Message: error.message });
    }
}

module.exports = {
    addUser: addUser,
    login: login,
    signout: signout,
}