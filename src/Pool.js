"use strict"

const Workers = require('./worker/Workers.js');
const WorkerResult = require('./worker/WorkerResult.js');
const Queue = require('./queue/Queue.js');
const QueueItem = require('./queue/QueueItem.js');

function Pool(opts) {
    this.opts = opts || {};
    this.max = this.opts.max || require('os').cpus().length;
    this.queueMax = this.opts.queueMax || 10;

    let workers = new Workers();

    this.getSize = function() {
        return workers.getSize();
    }

    this.enqueue = function(method, ...args) {
        return new Promise((resolve, reject) => {
            try {
                if (this.getSize() < this.max) {

                    workers.createWorker(method.toString(), args, (err, result) => {
                        if(err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });

                } else {
                    this.tryAllocate(method.toString(), args, (err, result) => {
                        if(err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                }
            }
            catch(err) {
                let workerResult = new WorkerResult(err.message, null);
                reject(workerResult.err);
            }
        });
    }

    this.tryAllocate = function(method, args, callback) {
        let workerFree = workers.getFreeWorker();
        if (workerFree !== undefined) {
            workerFree.run(method, args, callback);
        }
        else {

            /* Add task in queue */
            let queueAddResult = queue.add(new QueueItem(method, args, callback));

            if (queueAddResult !== '') {
                let workerResult = new WorkerResult();
                workerResult.err = queueAddResult;
                workerResult.result = null;
                callback(workerResult.err, workerResult.result);
            }
        }
    }

    this.finishPool = function() {
        return new Promise((resolve, reject) => {
            try {
                queue.clearQueue();
                workers.terminateAll();
                resolve();
            }
            catch(err) {
                reject(err);
            }
        });
    }
}

module.exports = function createPool(opts){
    return new Pool(opts);
};