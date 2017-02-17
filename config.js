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
    'restore': []
}

var errMess = {
    WRONG_TYPE: 'Operation against a key holding the wrong kind of value',
    WRONG_ARGS_TYPE: 'Value is not an integer or out of range',
    WRONG_ARGS_NUM: 'Wong number of arguments for \'$$\' command',
    SYNTAX: 'Syntax error',
    NO_CMD: 'Unknown command \'$$\'',
    NO_SNAPSHOT: 'There is no saved snapshot'
}

var returnCode = {

}

var snapshotDir = 'snapshots/';

module.exports = {
  types: t,
  cmdPrototypes: cmdPrototypes,
  errMess: errMess,
  returnCode: returnCode,
  snapshotDir: snapshotDir
}
