function QueueItem (method, args, callback) {
  this.method = method;
  this.args = args;
  this.callback = callback;
}

module.exports = QueueItem;
