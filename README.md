# node-workers-pool
Easy way to manage a pool of worker threads.

## Introduction

Passo a passo para rodar a aplicação:

### Prerequisites

* [NodeJs](https://nodejs.org/en/)
* [Npm](https://www.npmjs.com/)

### Examples

* Creating a pool with max 10 workers.
```
const pool = require('node-workers-pool')({
    max: 10
});
```

* If options is missing, the max number of workers will be the core's number of the machine.

* Creating a task and sending to queue
```
const now = new Date();
const pool = require('node-workers-pool')(); // max will be require('os').cpus().length

              /* Function to execute*/          /* Params */
pool.enqueue((num1, num2) => num1 + num2,       15, 30)
.then(result => console.log(`Executed in ${(new Date() - now) / 1000} sec(s). Result: ${result}`))
.catch(err => console.err(err));
```

* Another example
```
const now = new Date();
const pool = require('node-workers-pool')(); // max will be require('os').cpus().length

function fibonacci(num) {
    if (num < 2){
        return num
    }
    return fibonacci(num - 1) + fibonacci(num - 2);
}

pool.enqueue(fibonnaci, 40) // Function and parameter
.then(result => console.log(`Executed in ${(new Date() - now) / 1000} sec(s). Result: ${result}`))
.catch(err => console.err(err));
```

* Multiple parameters example
```
const pool = require('node-workers-pool')(); // max will be require('os').cpus().length

function mult(num1, num2, num3, num4) {
    return num1 * num2 * num3 * num4;
}

pool.enqueue(mult, 3, 5, 8, 10) // Function and parameters
.then(result => {
    console.log(`Executed in ${(new Date() - now) / 1000} sec(s). Result: ${result}`);
    pool.finishPool()
    .then(() => console.log('Finished!'));
})
.catch(err => console.err(err));
```

## Author

* **Bruno Oliveira** - [bruno303](https://github.com/bruno303)

## License

The project is licensed under the MIT License