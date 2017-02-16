var Ledis = require('./ledis');

var ledis = new Ledis();

ledis._set('foo', 'bar');
// ledis._set('mon', 10);
// ledis._set('my', 29.4);
// ledis._set('mon', 10000);

// ledis._flushdb();

console.log(ledis._sadd('mon', [1, 2, 3, 4]));
console.log(ledis._sadd('my', [1, 3, 5, 6]));
console.log(ledis._sinter(['mon', 'my']));
console.log(ledis._sadd('huy', [1, 1, 4, 5]));
console.log(ledis._sinter(['mon', 'my', 'huy']));
console.log(ledis._sinter(['mon', 'bar']));
console.log(ledis._expire('mon', 10));

var saved = ledis._save();

console.log(saved);

ledis._del('huy');

console.log(ledis._keys());

ledis._set('huy', 123123);

console.log(ledis._sadd('huy', 10));

ledis._load(saved);

console.log(ledis._sadd('huy', 10));

console.log(ledis._keys());
