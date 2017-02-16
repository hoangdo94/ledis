var check = require('check-types');


var t = {
  NUM: 'Number',
  STR: 'String',
  ARR: 'Array',
  LST: 'List',
  SET: 'Set'
}

var cmdPrototypes = {
    'set': [t.STR, t.STR],
    'get': [t.STR],
    'llen': [t.STR],
    'rpush': [t.STR, t.ARR],
    'lpop': [t.STR],
    'rpop': [t.STR],
    'lrange': [t.STR, t.NUM, t.NUM],
    'sadd': [t.STR, t.ARR],
    'scard': [t.STR],
    'smembers': [t.STR],
    'srem': [t.STR, t.ARR],
    'sinter': [t.ARR],
    'keys': [],
    'del': [t.STR],
    'flushdb': [],
    'expire': [t.STR, t.NUM],
    'ttl': [t.STR],
    'save': [],
    'load': []
}

var errMess = {
    WRONG_TYPE: 'Operation against a key holding the wrong kind of value',
    WRONG_ARGS: 'Wrong args',
    NO_CMD: 'No cmd'
}

var returnCode = {

}

module.exports = {
  types: t,
  cmdPrototypes: cmdPrototypes,
  errMess: errMess,
  returnCode: returnCode
}
