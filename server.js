let log4js = require('log4js');
let logger = log4js.getLogger('server');

let express = require('express');
let http = require('http');
let path = require('path');

let bodyParser = require('body-parser');
let cors            = require('cors');
let app = express();

let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));

let Apis = require('./mock/mock.api.json');
/*
fs.readFileAsync(path.join(__dirname, 'mock','mock.api.json')).then(JSON.parse).then(json=>Apis = json).error(()=> {
    logger.error("无法获取mock/mock.api.json文件信息，请检查文件是否存在和文件格式");
    logger.error(path.join(__dirname, 'mock','mock.api.json'));
});
*/

let models = require('./app/service');
app.use(function(req,res, next) {
    if(!models.user) {
        return next(new Error('No Models Registed'));
    }
    req.models = models;
    return next();
})

// app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
app.use(cors());
let errorHandler = require('errorhandler');
if(process.env.NODE_ENV === 'development') {
    app.use(errorHandler({
        dumpExceptions:true,
        showStack:true
    }));
} else if(process.env.NODE_ENV === 'production') {
    app.use(errorHandler());
}
/*
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('x-powered-by', 'Jsen');
    next();
});
*/

let ejwt = require('express-jwt');
let jwts     = require('jsonwebtoken');
let redis = require('./app/db/redis.init');
let jwtCheck = ejwt({
  secret: (req, payload, done) => {
    if(req.headers.authorization) {
      redis.GetValue(req.headers.authorization).then(v => done(null, v)).catch(e => done(null, ''));
    }
  },
  credentialsRequired:true,
  getToken: (req) => {
    /*
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === headP) {
      return req.headers.authorization.split(' ')[1];
    } else if(req.query && req.query.token) {
      return req.query.token;
    }
    */
    if(req.headers.authorization) {
      return req.headers.authorization;
    } else if(req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
});
let cRoutes = require('./app/controller');
app.post('/user/register', cRoutes.user.Register);
app.post('/user/login', cRoutes.user.Login);
app.use('/user/ol', jwtCheck);
app.post('/user/ol/logout', cRoutes.user.Logout);
app.post('/user/ol/update', cRoutes.user.Update);
app.get('/user/app/status', cRoutes.app.status);

let dbConf = require('./app/db');
dbConf.mongoose.boot();
dbConf.redis.boot();


app.all('*', function (req, res) {
    res.status(404).json({code:404,msg:'没有此Api', _links:Apis});
});

app.use(function(err, req, res, next){
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({code:404,msg:'未许可Api'});
        return;
    }
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.json({'code':500,msg:'发生未知错误', _links:Apis});
});

let PORT = process.env.PORT || 3000;


var server = http.createServer(app);
server.on('error', (err) => {
    logger.error(err);
});
process.addListener('uncaughtException', (err) => {
    logger.error(err);
    process.exit(1);
})
function boot () {
    if (app.get('env') === 'test') return;
    app.listen(PORT, function () {
        logger.info('服务器端口：'+PORT)
    });
}

function shutdown() {
    server.close();
}

exports.app = app;
exports.boot = boot;
exports.shutdown = shutdown;
exports.port = PORT;
if(require.main === module) {
    require('./boot');
} else {
    console.log('Running app as a module');
}
