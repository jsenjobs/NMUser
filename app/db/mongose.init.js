/**
 * Created by jsen on 2017/4/17.
 */

var log4js = require('log4js');
var logger = log4js.getLogger('MongoseIniter');

var Promise = require("bluebird");

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

let Global = require('../../global');

exports.boot = function(){
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.connect(Global.MongoUrl + '/' + Global.MongoTable, options);
    let conn = mongoose.connection;
    conn.on('error', (err) => {
        logger.error(err);
    })
    // .on('disconnected', this.Init(app))
    .once('open', () => {
        logger.info('MongoDB open');
    });
}
