let E = process.env;

exports.ENVSET = function() {

E.PORT = 3003;
E.MongoUrl = 'mongodb://root:root@120.25.217.56:27017';
E.MongoTable = 'jrecord';
E.RedisPort = 6379;
E.RedisHost = '120.25.217.56';
E.SessionTimeOut = 60 * 60 * 5;

}

