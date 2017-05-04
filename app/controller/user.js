let log4js = require('log4js');
let logger = log4js.getLogger('ControllerUser');
let redis = require('../db/redis.init');
let UUID = require('uuid');
let _       = require('lodash');

let ejwt = require('express-jwt');
let jwts     = require('jsonwebtoken');

let timeout = parseInt(process.env.SessionTimeOut);

function createToken(user) {
	let uuid = UUID.v1();
	let sig = jwts.sign(_.omit(user, 'password', 'email', 'phonenumber', 'registertime', 'lastlogin'), uuid, { expiresIn: timeout });
	// add to redis.

	redis.SetValue(sig, uuid).then(result => logger.info(result));
	return sig;
}

exports.Register = function(req, res) {
    logger.info('Register Api Call');

    let type = 'username';
    if (!req.body.username || !req.body.password) {
      return res.status(200).json({code:1, msg:"参数错误"});
    }
    if(req.body.type) {
      type = req.body.type;
    }

    req.models.user.Register(req.body.username, req.body.password, type).then(json => {
      if(json.code == 0) {
        json.token = createToken(json.userinfo);
        res.status(201).json(json);
      } else {
        if(!json.err) {
          res.status(400).json(json);
        } else {
          res.status(500).json(json);
        }
      }
    });
  }

  exports.Login = function(req, res) {
    logger.info('Login Api Call');

    if (!req.body.username || !req.body.password) {
      return res.status(200).json({code:1, msg:"参数错误"});
    }

    req.models.user.Login(req.body.username, req.body.password).then(json => {
      if(json.code == 0) {
        json.token = createToken(json.userinfo);
        res.status(201).json(json);
      } else {
        if(!json.err) {
          res.status(400).json(json);
        } else {
          res.status(500).json(json);
        }
      }
    });
  }


  exports.Logout = function(req, res) {
    logger.info('Logout Api Call');
    redis.DelValue(req.headers.authorization).then(eff => {
      if(eff) {
        res.status(201).json({code:0})
      } else {
        res.status(201).json({code:0, msg:"无需退出"})
      }
    });
  }

  exports.Update = function(req, res) {
    logger.info('Update Api Call');

    let body = req.body;
    if (!body.usernameO || !body.passwordO) {
      return res.status(200).json({code:1, msg:"参数错误"});
    }
    let username = body.username ? body.username : false;
    let password = body.password ? body.password : false;
    let email = body.email ? body.email : false;
    let phonenumber = body.phonenumber ? body.phonenumber : false;

    if(!username && !password && ! email && !phonenumber) {
      return res.status(200).json({code:1, msg:"没有要修改的参数"});
    }
    req.models.user.Update(body.usernameO, body.passwordO, username, password, email, phonenumber).then(json => {
      if(json.code == 0) {
        if(password) redis.DelValue(req.headers.authorization);
        res.status(201).json(json);
      } else {
        if(!json.err) {
          res.status(400).json(json);
        } else {
          res.status(500).json(json);
        }
      }
    });
  }