"use strict"

function Logger(canRegExecLog) {
    this.canRegExecLog = canRegExecLog;

    this.registerLogExec = function(msg) {
        if (this.canRegExecLog){
            const data = new Date();
            console.log(`${data.toLocaleDateString()} ${data.toLocaleTimeString()} - ${msg}`);
        }        
    };

    this.registerLogError = function(err) {
        if (err) {
            const data = new Date();
            console.error(`${data.toLocaleDateString()} ${data.toLocaleTimeString()} - ${err}`);
        }
    };
}

function createLogger(canRegExecLog){
    return new Logger(canRegExecLog);
}

module.exports = createLogger;