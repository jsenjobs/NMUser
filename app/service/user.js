/**
 * Created by jsen on 2017/4/19.
 */
let log4js = require('log4js');
let logger = log4js.getLogger('ServiceUser');
let _       = require('lodash');
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let UUID = require('uuid');

let User = require('../model').user;



exports.Login = function(username, password) {
    let query = [];
    query.push({username:username});
    query.push({email:username});
    query.push({phonenumber:username});

    return User.findOneAndUpdate({$or:query}, {lastlogin:new Date()}).then(user => {
      if(user) {
        if(password === user.password) {
          return {code:0, userinfo:user};
        } else {
          return {code:1, msg:'用户不存在或密码错误'};
        }
      } else {
        return {code:1, msg:'用户不存在'};
      }
    }).catch(err => {
      return {code:1, msg:'无法获取数据',err:err};
    });
};

exports.Register = function(username, password, type) {
    let query = [];
    query.push({username:username});
    query.push({email:username});
    query.push({phonenumber:username});
    return User.findOne({$or:query}).then(user => {
      if(!user) {
        let u = new User();
        u._id = UUID.v1();
        if(type === 'pn') {
          u.phonenumber = username;
        } else if(type === 'email') {
          u.email = username;
        } else {
          u.username = username;
        }
        u.password = password;
        let date = new Date();
        u.registertime = date;
        u.lastlogin = date;
        return u.save().then(result => {
          if(result) {
            return {code:0, userinfo:result};
          } else {
            return {code:1, msg:'出错'};
          }
        }).catch(err => {
          return {code:1, msg:'无法获取数据',err:err};
        });
      } else {
        return {code:1, msg:'用户存在,请使用其他名字'};
      }
    }).catch(err => {
      return {code:1, msg:'无法获取数据',err:err};
    });
};

exports.Update = function(usernameO, passwordO, username, password, email, phonenumber) {
    let up = {};
    if(username) {
      up.username = username;
    }
    if(password) {
      up.password = password;
    }
    if(email) {
      up.email = email;
    }
    if(phonenumber) {
      up.phonenumber = phonenumber;
    }
    return User.findOneAndUpdate({username:usernameO, password:passwordO}, up).then(result => {
      if(result) {
        return {code:0, userinfo:_.assign(result, up)};
      } else {
        return {code:1, msg:'修改失败'};
      }
    }).catch(err => {
      return {code:1, msg:'无法获取数据',err:err};
    });

};