"use strict"

const worker_threads = require('worker_threads');

function Worker(callbackExit) {

    /* Internal worker thread */
    const _worker = new worker_threads.Worker(`${__dirname}\\workerThreadExecutor.js`, { workerData: null });
    this.busy = false;
    this.callback = null;

    /* Send a message to start execution */
    this.run = function(method, args, callback) {
        this.busy = true;
        this.callback = callback;
        _worker.postMessage({ method, args });
    }

    /* Listen message event for the result */
    _worker.on('message', obj => {
        this.busy = false;
        this.callback(obj.err, obj.result);
    });

    /* Listen error event */
    _worker.on('error', err => {
        this.busy = false;
        this.callback(err, null);
    });

    _worker.on('exit', exitCode => {
        callbackExit(exitCode);
    })

    /* Terminate the worker thread */
    this.terminate = function(){
        _worker.terminate();
    }
}

module.exports = Worker;