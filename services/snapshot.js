var Lstring = require('../datatypes/lstring'),
    Llist = require('../datatypes/llist'),
    Lset = require('../datatypes/lset');

var types = require('../config').types;

function serialize(data) {
    var keys = Object.keys(data),
        serializedData = {};

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i],
            tmp = data[key];
        if (tmp.expiryTime && Date.now() >= tmp.expiryTime) {
            // if the key is expired, ignore it
            continue;
        }

        serializedData[key] = {
            data: null,
            type: tmp.type,
            expiryTime: tmp.expiryTime
        }

        switch (tmp.type) {
            case types.STR:
                serializedData[key].data = tmp._get();
                break;
            case types.LST:
                serializedData[key].data = tmp._lrange(0, tmp._llen() - 1);
                break;
            case types.SET:
                serializedData[key].data = tmp._smembers();
                break;
        }
    }

    return serializedData;
}

function deserialize(serializedData) {
    var keys = Object.keys(serializedData),
        data = {};

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i],
            tmp = serializedData[key];

        if (tmp.expiryTime && Date.now() >= tmp.expiryTime) {
            // if the key is expired, ignore it
            continue;
        }

        switch (tmp.type) {
            case types.STR:
                data[key] = new Lstring(tmp.data);
                data[key].expiryTime = tmp.expiryTime;
                break;
            case types.LST:
                data[key] = new Llist();
                data[key].expiryTime = tmp.expiryTime;
                data[key]._rpush(tmp.data);
                break;
            case types.SET:
                data[key] = new Lset();
                data[key].expiryTime = tmp.expiryTime;
                data[key]._sadd(tmp.data);
                break;
        }
    }

    return data;
}

module.exports = {
    serialize: serialize,
    deserialize: deserialize
}
