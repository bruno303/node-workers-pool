"use strict";

const workerThreads = require("worker_threads");

function Worker (queue, callbackExit) {
  this.queue = queue;

  /* Internal worker thread */
  const _worker = new workerThreads.Worker(`${__dirname}\\workerThreadExecutor.js`);
  this.busy = false;
  this.callback = null;

  /* Send a message to start execution */
  this.run = function (method, args, callback) {
    this.busy = true;
    this.callback = callback;
    _worker.postMessage({ method, args });
  };

  /* Listen message event for the result */
  _worker.on("message", obj => {
    this.callback(obj.err, obj.result);
    this.processNext();
  });

  /* Listen error event */
  _worker.on("error", err => {
    this.callback(err, null);
    this.processNext();
  });

  _worker.on("exit", exitCode => {
    callbackExit(exitCode);
  });

  /* Terminate the worker thread */
  this.terminate = function () {
    _worker.terminate();
  };

  this.processNext = function () {
    const next = this.queue.getNext();
    if (next !== null && next !== undefined) {
      this.run(next.method, next.args, next.callback);
    } else {
      this.busy = false;
    }
  };
}

module.exports = Worker;
