"use strict"

const worker_threads = require('worker_threads');
const WorkerResult = require('./WorkerResult.js');
const functionResolver = require('./workerFunctionResolver.js');

/* Process on message event */
worker_threads.parentPort.on('message', obj => {

    let workerResult = new WorkerResult();

    try {
        let func = functionResolver(obj.method);

        if (func === null || func === undefined) {
            workerResult.err = `Method is invalid (${obj.method})`;
        }

        if (!workerResult.err) {
            workerResult.result = func(...obj.args);
        }
    }
    catch(err) {
        workerResult.err = err;
    }

    /* Answer with object */
    worker_threads.parentPort.postMessage(workerResult);
});