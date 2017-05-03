let jws = require('jws');

let sig = jws.sign({
  header: { alg: 'HS256', typ: 'JWT' },
  payload: { id: 1, username: 'gonto', iat: 1492999970, exp: 1493017970 },
  secret: 'sig str simple',
  encoding: 'utf8'
})
console.log(sig);
console.log(jws.verify(sig, 'HS256', 'sig str simple'));
