let Cluster2 = require('cluster2');
let server = require('./server');

let c2 = new Cluster2({port:server.port});
c2.listen((callback) => {
	callback(server.app);
})