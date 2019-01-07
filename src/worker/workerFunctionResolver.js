function resolve(method) {
    let func = null;
    try {
        func = eval(`(${method})`);
    }
    catch(err) { }
    return func;
}

module.exports = resolve;