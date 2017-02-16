function Lset(hashFunc) {
    this.hashFunc = hashFunc || JSON.stringify;
    this.size = 0;
    this.data = {};
    this.type = 'Set';
    this.expiryTime = null;
}

Lset.prototype = {
    contain: function(value) {
        return !!this.data[this.hashFunc(value)];
    },
    add: function(value) {
        if (!this.contain(value)) {
            this.data[this.hashFunc(value)] = value;
            this.size++;
            return 1;
        }
        return 0;
    },
    remove: function(value) {
        if (this.contain(value)) {
            delete this.data[this.hashFunc(value)];
            this.size--;
            return 1;
        }
        return 0;
    },
    _sadd: function(values) {
        var addedCount = 0;
        for (var i = 0; i < values.length; i++) {
            addedCount += this.add(values[i]);
        }
        return addedCount;
    },
    _scard: function() {
        return this.size;
    },
    _smembers: function() {
        var keys = Object.keys(this.data),
            values = [];
        for (var i = 0; i < keys.length; i++) {
            values.push(this.data[keys[i]]);
        }
        return values;
    },
    _srem: function(values) {
        var removedCount = 0;
        for (var i = 0; i < values.length; i++) {
            removedCount += this.remove(values[i]);
        }
        return removedCount;
    },
    _sinter: function(sets) {
        var inter = new Lset();
        sets[0]._smembers().forEach(function(value) {
            var valid = true;
            for (var i = 1; i < sets.length; i++) {
                if (!sets[i].contain(value)) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                inter.add(value);
            }
        });

        return inter._smembers();
    }
}

module.exports = Lset;
