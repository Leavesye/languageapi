var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var LanguageSchema = mongoose.Schema({
    LangID: {type:Schema.Types.ObjectId},
    Desc: String,
    ContentType:String,
    Project: String,
    Code: String,
    ENText: String,
    CNText: String,
    CreateDate: {type:Date,default:Date.now},
    UpdateDate: {type:Date,default:Date.now}
},{ collection: 'language', versionKey: false, id: false });

var Language = mongoose.model('Language', LanguageSchema);

module.exports = Language;