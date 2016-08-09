var fs = require('fs');
var mongoose = require('mongoose');
var Language = require('../models/language.js');
var config = require('../web.config.js');
var path = require('path');
var Promise = require('mpromise');



/**
 * 新增
 * @param  {Object} req 请求对象
 * @param  {Object} res 响应对象
 */
function add(req, res) {
    var lanID = new mongoose.Types.ObjectId;
    var language = new Language({
        LangID: lanID,
        Desc: req.body.desc || '',
        ContentType: req.body.contentType || '',
        Project: req.body.project || '',
        Code: req.body.code || '',
        ENText: req.body.enText || '',
        CNText: req.body.cnText || ''
    });

    language.save(function (err) {
        if (err) {
            console.log(err.message);
            res.json({ IsSuccess: false, Message: '保存多语言失败。' });
        } else {
            res.json({ IsSuccess: true, Message: '保存成功。' });
        }
    })

}

/**
 * 更新
 * @param  {Object} req 请求对象
 * @param  {Object} res 响应对象
 */
function update(req, res) {
    var language = {
        LangID: req.body.langID || '',
        ContentType: req.body.contentType || '',
        Desc: req.body.desc || '',
        Project: req.body.project || '',
        Code: req.body.code || '',
        ENText: req.body.enText || '',
        CNText: req.body.cnText || ''
    };

    Language.findOne({ LangID: req.body.langID }, function (err, lan) {
        if (err) {
            console.log(err.message);
            res.json({ IsSuccess: false, Message: '获取数据失败。' });
        }

        if (lan) {
            Language.update({ LangID: req.body.langID },language, function (err, doc) {
                if (err) {
                    console.log(e.message);
                    res.json({ IsSuccess: false, Message: '更新失败。' });
                }

                if (doc) {
                    res.json({ IsSuccess: true, Message: '更新成功。' });
                }
            })
        }
    });
}
/**
 * 复制
 * @param  {Object} req
 * @param  {Object} res
 */
function copy(req, res) {
    var lanID = new mongoose.Types.ObjectId;
    var language = new Language({
        LangID: lanID || '',
        ContentType: req.body.contentType || '',
        Desc: req.body.desc || '',
        Project: req.body.project || '',
        Code: req.body.code || '',
        ENText: req.body.enText || '',
        CNText: req.body.cnText || ''
    });

    language.save(function (err) {
        if (err) {
            console.log(err.message);
            res.json({ IsSuccess: false, Message: '保存多语言失败。' });
        } else {
            res.json({ IsSuccess: true, Message: '保存成功。' });
        }
    })
}

/**
 * 删除
 * @param  {Object} req 请求对象
 * @param  {Object} res 响应对象
 */
function del(req, res) {

    var langID = req.body.langID;
    Language.findOne({ LangID: langID }, function (err, lan) {
        if (err) {
            console.log(err.message);
            res.json({ IsSuccess: false, Message: '删除失败。' });
        }

        if (lan) {
            Language.remove({ LangID: langID }, function (err, docs) {
                if (err) {
                    console.log(err.message);
                    res.json({ IsSuccess: false, Message: '删除失败。' });
                }

                if (docs) {
                    res.json({ IsSuccess: true, Message: '删除成功。' });
                }
            })
        }
    });
}

/**
 * 删除
 * @param  {Object} req 请求对象
 * @param  {Object} res 响应对象
 */
function batchDelete(req, res) {

    var langIDs = req.body.langIDs || [];
    Language.remove({ LangID: { $in:langIDs} },function (err) {
        if (err) {
            console.log(err.message);
            res.json({ IsSuccess: false, Message: '删除失败。' });
        }
        res.json({ IsSuccess: true, Message: '删除成功' });
    })
}

/**
 * 获取列表
 * @param  {Object} req 请求对象
 * @param  {Object} res 响应对象
 */
function getLanList(req, res) {

    res.setHeader('code', '1111');
    res.setHeader('Set-Cookie',['name=111','age=28']);
    var sort = req.query.sort || '';
    var index = req.query.index ? parseInt(req.query.index) : 0;
    var size = req.query.size ? parseInt(req.query.size) : 0;
    var queryStr = req.query.queryStr || '';
    var query = {};

    if (queryStr) {
        query = { Code: new RegExp(queryStr) };
    }
    Language.find(query).count(function (err, count) {
        if (err) {
            console.log(err.message);
            res.json({ IsSuccess: false, Message: '获取列表失败。' });
        }

        Language.find(query, null,
            { skip: index * size, limit: size, sort: sort },
            function (err, lanList) {
                if (err) {
                    console.log(err.message);
                    res.json({ IsSuccess: false, Message: '获取列表失败。' });
                }
                var pageCount = Math.ceil(count / size);
                res.json({
                    IsSuccess: true,
                    lanList: lanList,
                    TotalCount: count,
                    PageCount: pageCount
                });
            });
    })

}

/**
 * 导出多语言文件
 * @param  {Object} req 请求对象
 * @param  {Object} res 响应对象
 */
function exportFile(req, res) {
    var project = req.body.project || '';
    // 导出所有项目文件
    if (project == 'All') {
        Language.find({}, 'Code ENText CNText Project', function (err, lanList) {
            if (err) {
                console.log(err.messagee);
                res.json({ IsSuccess: false, Message: '获取列表失败。' });
            }

            if (lanList.length > 0) {
                var commonList = lanList.filter(function (item) {
                    return item.Project == 'Common';
                })
                var frontList = lanList.filter(function (item) {
                    return item.Project == 'Front';
                })
                var designList = lanList.filter(function (item) {
                    return item.Project == 'Design';
                })
                var mainList = lanList.filter(function (item) {
                    return item.Project == 'Main';
                })
                var helpList = lanList.filter(function (item) {
                    return item.Project == 'Help';
                })
                var loginList = lanList.filter(function (item) {
                    return item.Project == 'Login';
                })
                var indexList = lanList.filter(function (item) {
                    return item.Project == 'Index';
                })

                var datas = [commonList, frontList, designList, mainList, helpList, loginList, indexList];
                var projects = [config.commonPath, config.frontPath, config.designPath, config.mainPath, config.helpPath, config.loginPath, config.indexPath];

                datas.forEach(function (list, index) {
                    if (list.length > 0) {

                        var cnData = '{';
                        var enData = '{';
                        list.forEach(function (elem) {
                            cnData += '"' + elem.Code + '":"' + elem.CNText + '",';
                            enData += '"' + elem.Code + '":"' + elem.ENText + '",';
                        });
                        cnData = cnData.substr(0, cnData.length - 1) + '}';
                        enData = enData.substr(0, enData.length - 1) + '}';
                        var cnPath = projects[index].replace(/\\/g, "\\\\") + "\\\\cn";
                        var enPath = projects[index].replace(/\\/g, "\\\\") + "\\\\en";
                        mkdirsSync(cnPath);
                        mkdirsSync(enPath);
                        var endFlag;
                        fs.writeFile(cnPath + "\\" + projects[index].split("\\")[2] + ".json", cnData, function (err) {
                            if (err) {
                                console.log(err.message);
                                res.json({ IsSuccess: false, Message: '写入文件失败。' });
                            }
                        });
                        fs.writeFile(enPath + "\\" + projects[index].split("\\")[2] + ".json", enData, function (err) {
                            if (err) {
                                console.log(err.message);
                                res.json({ IsSuccess: false, Message: '写入文件失败。' });
                            }
                        });
                    }
                })
            }
        })
    } else {// 导出单个项目
        Language.find({ Project: project }, 'Code ENText CNText', function (err, lanList) {
            if (err) {
                console.log(err.messagee);
                res.json({ IsSuccess: false, Message: '获取列表失败。' });
            }

            if (lanList.length > 0) {

                var cnData = '{';
                var enData = '{';
                lanList.forEach(function (elem) {
                    cnData += '"' + elem.Code + '":"' + elem.CNText + '",';
                    enData += '"' + elem.Code + '":"' + elem.ENText + '",';
                });
                cnData = cnData.substr(0, cnData.length - 1) + '}';
                enData = enData.substr(0, enData.length - 1) + '}';
                var cnPath = getRelation(project).replace(/\\/g, "\\\\") + "\\\\cn";
                var enPath = getRelation(project).replace(/\\/g, "\\\\") + "\\\\en";
                mkdirsSync(cnPath);
                mkdirsSync(enPath);

                fs.writeFile(cnPath + "\\" + project + ".json", cnData, function (err) {
                    if (err) {
                        console.log(err.message);
                        res.json({ IsSuccess: false, Message: '写入文件失败。' });
                    }
                    fs.writeFile(enPath + "\\" + project + ".json", enData, function (err) {
                        if (err) {
                            console.log(err.message);
                            res.json({ IsSuccess: false, Message: '写入文件失败。' });
                        }
                    });
                });
            }
        })

    }
}

/**
 * 创建多级目录
 * @param  {String} dirpath 路径
 */
function mkdirsSync(dirpath) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(path.sep).forEach(function (dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp)) {
                        return false;
                    }
                }
            }
            else {
                pathtmp = dirname;
            }
        });
    }
    return true;
}

/**
 * 获取文件路径配置
 * @param  {String} project
 */
function getRelation(project) {
    var path = '';
    switch (project) {
        case 'Common':
            path = config.commonPath;
            break;
        case 'Front':
            path = config.frontPath;
            break;
        case 'Design':
            path = config.designPath;
            break;
        case 'Main':
            path = config.mainPath;
            break;
        case 'Help':
            path = config.helpPath;
            break;
        case 'Login':
            path = config.loginPath;
            break;
        case 'Index':
            path = config.indexPath;
            break;
    }

    return path;
}

module.exports = {
    add: add,
    update: update,
    copy: copy,
    del: del,
    getLanList: getLanList,
    exportFile: exportFile,
    batchDelete:batchDelete
};