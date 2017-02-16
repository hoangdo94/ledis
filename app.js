var restify = require('restify'),
    checker = require('check-types'),
    Ledis = require('./ledis'),
    cmdParser = require('./services/cmd_parser');

var server = restify.createServer({
    name: 'ledis-server'
});
server.use(restify.bodyParser());

var ledis = new Ledis();

server.post('/', function(req, res, next) {
    try {
        var parsed = cmdParser.parse(req.body);
        var result = ledis['_' + parsed.cmd].apply(ledis, parsed.args);

        // Marshalling the result string to be redis-like
        if (result) {
            if (checker.string(result)) {
                if (result == 'OK') {
                    return res.send(result);
                }
                return res.send('"' + result + '"');
            }
            if (checker.array(result)) {
                if (result.length == 0) {
                    return res.send('empty list or set');
                }
                var str = '1) "' + result[0] + '"';
                for (var i = 1; i < result.length; i++) {
                    str += ('\n\r' + (i + 1).toString() + ') "' + result[i] + '"');
                }
                return res.send(str);
            }
            if (checker.number(result)) {
                return res.send('(integer) ' + result);
            }
        }
        return res.send('(nil)');
    } catch (err) {
        return res.send(err.toString());
    }
    next();
});

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
