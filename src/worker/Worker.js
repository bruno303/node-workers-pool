"use strict";

const workerThreads = require("worker_threads");
const path = require("path");

function Worker (queue, callbackExit) {
  this.queue = queue;

  /* Internal worker thread */
  const _worker = new workerThreads.Worker(path.join(__dirname, "workerThreadExecutor.js"));
  this.busy = false;
  this.callback = null;
  this.lastStartTime = null;
  this.method = null;
  this.args = null;

  /* Send a message to start execution */
  this.run = function (method, args, callback) {
    this.busy = true;
    this.callback = callback;
    this.lastStartTime = new Date();
    this.method = method;
    this.args = args;
    _worker.postMessage({ method, args });
  };

  /* Listen message event for the result */
  _worker.on("message", obj => {
    this.clearVars();
    this.callback(obj.err, obj.result);
    this.processNext();
  });

  /* Listen error event */
  _worker.on("error", err => {
    this.clearVars();
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
    }
  };

  this.getState = function () {
    return {
      threadId: _worker.threadId,
      busy: this.busy,
      busyTime: this.lastStartTime != null ? (new Date() - this.lastStartTime) / 1000 : 0,
      method: this.method || "",
      args: this.args || []
    };
  };

  this.clearVars = function () {
    this.busy = false;
    // this.callback = null;
    this.lastStartTime = null;
    this.method = null;
    this.args = null;
  };
}

module.exports = Worker;
