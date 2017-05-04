/**
 * Created by jsen on 2017/4/17.
 */

let log4js = require('log4js');
let logger = log4js.getLogger('MongoseIniter');

let Promise = require("bluebird");

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

exports.boot = function(){
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.connect((process.env.MongoUrl || 'mongodb://127.0.0.1:27017') + '/' + (process.env.MongoTable || 'jrecord'), options);
    let conn = mongoose.connection;
    conn.on('error', (err) => {
        logger.error(err);
    })
    // .on('disconnected', this.Init(app))
    .once('open', () => {
        logger.info('MongoDB open');
    });
}
