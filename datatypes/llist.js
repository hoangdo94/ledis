function Node(value) {
    this.data = value;
    this.previous = null;
    this.next = null;
}

function Llist() {
    this.size = 0;
    this.head = null;
    this.tail = null;
    this.type = 'List';
    this.expiryTime = null;
}

Llist.prototype = {
    addTail: function(value) {
        var node = new Node(value);

        if (this.size) {
            this.tail.next = node;
            node.previous = this.tail;
            this.tail = node;
        } else {
            this.head = node;
            this.tail = node;
        }

        this.size++;
    },

    _llen: function() {
        return this.size;
    },

    _rpush: function(values) {
        for (var i = 0; i < values.length; i++) {
            this.addTail(values[i]);
        }
        return this.size;
    },

    _lpop: function() {
        var current = this.head;

        if (current.next) {
            this.head = current.next;
            this.head.previous = null;
        }

        this.size--;
        return current.data;
    },

    _rpop: function() {
        var current = this.tail;

        if (current.previous) {
            this.tail = current.previous;
            this.tail.next = null;
        }

        this.size--;
        return current.data;
    },

    _lrange: function(start, end) {
      var current = this.head,
          index = 0,
          values = [];

      if (start < 0) return values;

      while (index < start && index < this.size) {
        current = current.next;
        index++;
      }
      while (index <= end && index < this.size) {
        values.push(current.data);
        current = current.next;
        index++;
      }

      return values;
    }
}

module.exports = Llist;
