var types = require('../config').types;

function Lstring(value) {
    this.data = value;
    this.type = types.STR;
    this.expiryTime = null;
}

Lstring.prototype = {
    _set: function(value) {
        this.data = value;
    },
    _get: function() {
        return this.data;
    }
}

module.exports = Lstring;
