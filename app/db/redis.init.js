/**
 * Created by jsen on 2017/4/17.
 */

var log4js = require('log4js');
var logger = log4js.getLogger('RedisIniter');

var redis = require("redis");
let bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let timeout = parseInt(process.env.SessionTimeOut);

let client;
exports.SetValue = function(k,v) {
    return client.setAsync(k,v).then((res) => {
        return client.expireAsync(k, timeout);
    });
}

exports.GetValue = function(k) {
    return client.getAsync(k).then(result => {
        if(result!==null) {
            return client.expireAsync(k, timeout).then(() => result);
        }
        return result;
    });
}

exports.DelValue = function(k) {
    return client.delAsync(k).then(count => count > 0);
}

exports.boot = function() {
    client = redis.createClient(process.env.RedisPort,process.env.RedisHost,{});
    client.on("ready", function () {
      logger.info("Ready");
    });
    client.on("connect", function () {
      logger.info("connect");
    });
    client.on("reconnect", function () {
      logger.warn("reconnect");
    });
    client.on("error", function (err) {
      logger.error("error " + err);
    });

}
