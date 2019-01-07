function WorkerResult(err, result) {
    this.err = err || undefined;
    this.result = result || undefined;
}

module.exports = WorkerResult;