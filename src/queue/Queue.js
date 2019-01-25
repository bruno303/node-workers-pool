function Queue (opts) {
  this.opts = opts || {};
  this.max = this.opts.max || 10;

  let _queue = [];

  this.add = function (queueItem) {
    if (_queue.length < this.max) {
      _queue.push(queueItem);
      return "";
    } else {
      return "full";
    }
  };

  this.remove = function (queueItem) {
    const index = _queue.indexOf(queueItem);
    if (index !== -1) {
      _queue.splice(index, 1);
    }
  };

  this.getNext = function () {
    let next = null;
    if (_queue.length > 0) {
      next = _queue.shift();
    }
    return next;
  };

  this.clearQueue = function () {
    if (_queue.length > 0) {
      _queue.splice(0, _queue.length);
    }
  };
}

module.exports = Queue;
