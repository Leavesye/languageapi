var express = require('express');
var router = express.Router();
var UserManage = require('../business/user.js');

// 新增用户
router.post('/add', UserManage.addUser);

// 登录
router.post('/login', UserManage.login)

// 登出
router.post('/signout', UserManage.signout)


module.exports = router;