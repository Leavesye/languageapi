var express = require('express');
var router = express.Router();
var LanManage = require('../business/language.js');

// 新增
router.post('/add', LanManage.add);

// 更新
router.post('/update', LanManage.update);

// 复制
router.post('/copy', LanManage.copy);

// 删除
router.post('/del', LanManage.del);

// 批量删除
router.post('/batchDelete', LanManage.batchDelete);

// 获取列表
router.get('/lans', LanManage.getLanList);

// 导出文件
router.post('/export', LanManage.exportFile);

module.exports = router;