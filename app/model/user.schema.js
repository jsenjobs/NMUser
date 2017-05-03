/**
 * Created by jsen on 2017/4/12.
 */

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let Promise = require("bluebird");

/*
 var NoteSchema = new Schema({
 filename : { type: ObjectId },                    //用户账号
 filedata: {type: String},                        //密码
 createby: {type: String},                        //年龄
 createtime: {type: Date},                        //年龄
 updatetime : { type: Date}                       //最近登录时间
 });
 */
var UserSchema = new Schema({
  _id : { type: String },                    //用户账号
  username: {type: String},                        //名字
  email: {type: String},                        //描述
  phonenumber: {type: String},                        //内容Url
  password: {type:String},    // 作者
  registertime:{type:Date},
  lastlogin:{type:Date}
});

// findOne
// object.save
exports.user = mongoose.model('user', UserSchema);
