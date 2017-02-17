var _ = require('underscore'),
    conf = require('../config'),
    types = conf.types,
    cmdPrototypes = conf.cmdPrototypes,
    errMess = conf.errMess;

function parse(cmd) {
    var cmdString = cmd.trim() + ' ';

    // Check for syntax error
    var test = cmdString.match(/(((("(\\.|[^"\\])*")|('(\\.|[^'\\])*')|([^'"\s]+))\s)(\s*))+/g);

    if (test.length == 0 || (test.length > 0 && cmdString.replace(test[0], "").trim().length > 0)) {
      	throw new Error(errMess.SYNTAX);
    }

    // Parse arguments
    var tmp = _.map(cmdString.match(/(("(\\.|[^"\\])*")|('(\\.|[^'\\])*')|([^'"\s]+))\s/g),
        function(i) {
            i = i.trim();
            if (i.startsWith('"') && i.endsWith('"')) {
                i = i.substring(1, i.length-1).replace(/\\"/g, '"');
            }
            if (i.startsWith('\'') && i.endsWith('\'')) {
                i = i.substring(1, i.length-1).replace(/\\'/g, '\'');
            }
            return i;
        });

    var cmd = tmp.shift().toLowerCase();
    var args = [];

    var cmdPrototype = cmdPrototypes[cmd];

    if (!cmdPrototype) {
        throw new Error(errMess.NO_CMD.replace('$$', cmd));
    }

    var hasArrayArg = false;
    for (var i = 0; i < cmdPrototype.length; i++) {
        var argType = cmdPrototype[i];
        if (argType == types.ARR) {
            hasArrayArg = true;
            if (tmp.length < 1) {
                throw new Error(errMess.WRONG_ARGS_NUM.replace('$$', cmd));
            }
            args.push(tmp);
        } else {
            var arg = tmp.shift();
            if (!arg && arg != "") {
                throw new Error(errMess.WRONG_ARGS_NUM.replace('$$', cmd));
            }
            if (argType == types.NUM) {
                if (!(/^[+|-]?\d+$/).test(arg)) {
                    throw new Error(errMess.WRONG_ARGS_TYPE);
                }
                args.push(parseInt(arg));
            } else {
                args.push(arg);
            }
        }
    }

    if (!hasArrayArg && tmp.length > 0) {
        throw new Error(errMess.WRONG_ARGS_NUM.replace('$$', cmd));
    }

    return {
        cmd: cmd,
        args: args
    }
}

module.exports = {
    parse: parse
}
