// 获取环境变量
var env = process.env.NODE_ENV;

var commonPath
    , frontPath
    , designPath
    , mainPath
    , helpPath
    , loginPath
    , indexPath;

// 开发环境
if (env == 'development') {
    commonPath = 'F:\\lanfile\\common';
    frontPath = 'F:\\lanfile\\front';
    designPath = 'F:\\lanfile\\design';
    mainPath = 'F:\\lanfile\\main';
    helpPath = 'F:\\lanfile\\help';
    loginPath = 'F:\\lanfile\\login';
    indexPath = 'F:\\lanfile\\index';
} else if(env == 'production') { // 生产环境

}

module.exports = {
    commonPath : commonPath,
    frontPath : frontPath,
    designPath : designPath,
    mainPath : mainPath,
    helpPath : helpPath,
    loginPath : loginPath,
    indexPath : indexPath
}