var conf = require('../config'),
    types = conf.types,
    cmdPrototypes = conf.cmdPrototypes,
    errMess = conf.errMess;

function parse(cmd) {
    var tmp = cmd.trim().split(/\s+/);
    var cmd = tmp.shift().toLowerCase();
    var args = [];

    var cmdPrototype = cmdPrototypes[cmd];

    if (!cmdPrototype) {
        throw new Error(errMess.NO_CMD);
    }

    var hasArrayArg = false;
    for (var i = 0; i < cmdPrototype.length; i++) {
        var argType = cmdPrototype[i];
        if (argType == types.ARR) {
            hasArrayArg = true;
            args.push(tmp);
        } else {
            var arg = tmp.shift();
            if (!arg) {
                throw new Error(errMess.WRONG_ARGS);
            }
            if (argType == types.NUM) {
                args.push(parseInt(arg));
            } else {
                args.push(arg);
            }
        }
    }

    if (!hasArrayArg && tmp.length > 0) {
        throw new Error(errMess.WRONG_ARGS);
    }

    return {
        cmd: cmd,
        args: args
    }
}

module.exports = {
    parse: parse
}
