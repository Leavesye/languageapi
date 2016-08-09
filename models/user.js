var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
    UserID: {type:Schema.Types.ObjectId},
    UserName: String,
    Password: String,
    RoleID:{type:Schema.Types.ObjectId},
    CreateDate: {type:Date,default:Date.now},
    UpdateDate: {type:Date,default:Date.now}
},{ collection: 'user', versionKey: false, id: false });

var User = mongoose.model('User',UserSchema);

module.exports = User;