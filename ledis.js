var Lstring = require('./datatypes/lstring'),
    Llist = require('./datatypes/llist'),
    Lset = require('./datatypes/lset');

var snapshotService = require('./services/snapshot');

var types = require('./config').types,
    errMess = require('./config').errMess;

function Ledis() {
    this.data = {};
}

Ledis.prototype = {
    // Utils
    keyExist: function(key) {
        var tmp = this.data[key];
        if (tmp) {
            if (tmp.expiryTime) {
                if (Date.now() >= tmp.expiryTime) {
                    delete this.data[key];
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    getKey: function(key) {
        if (this.keyExist(key)) {
            return this.data[key];
        }
        return null;
    },
    keyExistWithType: function(key, typeName) {
        var tmp = this.data[key];
        if (tmp) {
            if (tmp.expiryTime) {
                if (Date.now() >= tmp.expiryTime) {
                    delete this.data[key];
                    return false;
                }
            }
            return (tmp.type == typeName);
        }
        return false;
    },
    getKeyWithType: function(key, typeName) {
        var tmp = this.getKey(key)
        if (tmp) {
            if (tmp.type == typeName) {
                return tmp;
            }
            return null;
        }
        return null;
    },
    _print: function() {
        console.log(this.data);
    },

    // String operations
    _set: function(key, value) {
        if (this.keyExistWithType(key, types.STR)) {
            this.data[key]._set(value);
        } else {
            this.data[key] = new Lstring(value);
        }
        return 'OK';
    },

    _get: function(key) {
        if (this.keyExistWithType(key, types.STR)) {
            return this.data[key]._get();
        }
        if (this.keyExist(key)) {
            throw new Error(errMess.WRONG_TYPE);
        }
        return null;
    },

    // List operations
    _llen: function(key) {
        if (this.keyExistWithType(key, types.LST)) {
            return this.data[key]._llen();
        }
        if (this.keyExist(key)) {
            throw new Error(errMess.WRONG_TYPE);
        }
        return 0;
    },

    _rpush: function(key, values) {
        if (this.keyExistWithType(key, types.LST)) {
            return this.data[key]._rpush(values);
        }
        if (this.keyExist(key)) {
            throw new Error(errMess.WRONG_TYPE);
        }
        this.data[key] = new Llist();
        return this.data[key]._rpush(values);
    },

    _lpop: function(key) {
        if (this.keyExistWithType(key, types.LST)) {
            var tmp = this.data[key]._lpop();
            if (this.data[key].size == 0) {
                delete this.data[key];
            }
            return tmp;
        }
        if (this.keyExist(key)) {
            throw new Error(errMess.WRONG_TYPE);
        }
        return null;
    },

    _rpop: function(key) {
        if (this.keyExistWithType(key, types.LST)) {
            var tmp = this.data[key]._rpop();
            if (this.data[key].size == 0) {
                delete this.data[key];
            }
            return tmp;
        }
        if (this.keyExist(key)) {
            throw new Error(errMess.WRONG_TYPE);
        }
        return null;
    },

    _lrange: function(key, start, end) {
        if (this.keyExistWithType(key, types.LST)) {
            return this.data[key]._lrange(start, end);
        }
        if (this.keyExist(key)) {
            throw new Error(errMess.WRONG_TYPE);
        }
        return [];
    },

    // Set operations
    _sadd: function(key, values) {
        if (this.keyExistWithType(key, types.SET)) {
            return this.data[key]._sadd(values);
        }
        if (this.keyExist(key)) {
            throw new Error(errMess.WRONG_TYPE);
        }
        this.data[key] = new Lset();
        return this.data[key]._sadd(values);
    },

    _scard: function(key) {
        if (this.keyExistWithType(key, types.SET)) {
            return this.data[key]._scard();
        }
        if (this.keyExist(key)) {
            throw new Error(errMess.WRONG_TYPE);
        }
        return 0;
    },

    _smembers: function(key) {
        if (this.keyExistWithType(key, types.SET)) {
            return this.data[key]._smembers();
        }
        if (this.keyExist(key)) {
            throw new Error(errMess.WRONG_TYPE);
        }
        return [];
    },

    _srem: function(key, values) {
        if (this.keyExistWithType(key, types.SET)) {
            return this.data[key]._srem(values);
        }
        if (this.keyExist(key)) {
            throw new Error(errMess.WRONG_TYPE);
        }
        return 0;
    },

    _sinter: function(keys) {
        var sets = [];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (this.keyExistWithType(key, types.SET)) {
                sets.push(this.data[key]);
            } else if (this.keyExist(key)) {
                throw new Error(errMess.WRONG_TYPE);
            } else {
                var tmp = new Lset();
                sets.push(tmp);
            }
        }
        return sets[0]._sinter(sets);
    },

    // Data Expirartion
    _keys: function() {
        return Object.keys(this.data);
    },

    _del: function(key) {
        delete this.data[key];
        return 1;
    },

    _flushdb: function() {
        var keys = this._keys();
        for (var i = 0; i < keys.length; i++) {
            this._del(keys[i]);
        }
        return 1;
    },

    _expire: function(key, seconds) {
        var tmp = this.getKey(key);
        if (tmp) {
            tmp.expiryTime = Date.now() + seconds * 1000;
            return 1;
        }
        return 0;
    },

    _ttl: function(key) {
        var tmp = this.getKey(key);
        if (tmp) {
            if (tmp.expiryTime) {
                return Math.round((tmp.expiryTime - Date.now()) / 1000);
            }
            return -1;
        }
        return -2;
    },

    // Snapshot
    _save: function() {
        return snapshotService.serialize(this.data);
    },

    _restore: function() {
        this._flushdb();

        var snapshot = snapshotService.deserialize();

        this.data = snapshot.data;

        return ('Restored data from the latest snapshot (' + snapshot.filename + ')');
    },
}

module.exports = Ledis;
