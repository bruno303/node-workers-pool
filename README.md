# node-workers-pool
Easy way to manage a pool of worker threads.

Use the **--experimental-worker** flag to run correctly, since this resource still experimental in NodeJs.

## Introduction

With this package you can:
* Run heavy cpu-bound in a pool of worker_threads, an experimental resouce in NodeJs.
* Control the number of active workers in the pool.
* Create a queue, because when all the workers are busy, the processing will be queued.
* Easily clear the pool (workers and queue).
* Easily capture the result or error from the workers, since the pool uses Promise.

### Prerequisites

* [NodeJs](https://nodejs.org/en/) (v 10.15.0 or later)
* [Npm](https://www.npmjs.com/)

### DEV - Prerequisites
* [express](https://expressjs.com/)
* [nodemon](https://nodemon.io/)

### Examples

* Creating a pool with max 10 workers.
```
const pool1 = require('node-workers-pool')({
    max: 10,
    maxQueue: 40
});

--or

const Pool = require('node-workers-pool');
const pool2 = Pool({ max: 10, maxQueue: 40 });
```

* If options is missing, the max number of workers will be the core's number of the machine (require('os').cpus().length).

* Creating a task and sending to queue
```
const now = new Date();
const pool = require('node-workers-pool')({ max: 4, queueMax: 10 });

              /* Function to execute*/          /* Params */
pool.enqueue((num1, num2) => num1 + num2,       15, 30)
.then(result => console.log(`Executed in ${(new Date() - now) / 1000} sec(s). Result: ${result}`))
.catch(err => console.err(err));
```

* Another example
```
const now = new Date();
const pool = require('node-workers-pool')({ max: 4, queueMax: 10 });

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
const pool = require('node-workers-pool')({ max: 4, queueMax: 10 });

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

* Cleaning the pool
```
const pool = require('node-workers-pool')({ max: 4, queueMax: 10 });

pool.enqueue(() => 'Executed') // Function and parameters
.then(result => {
    console.log(result);
    pool.finishPool()
    .then(() => console.log('Pool finished!'));
});
```

* Default values
```
const Pool = require('node-workers-pool');
const pool = new Pool(); // without opts

/** This pool will have:
* max = require('os').cpus().length
* maxQueue = 10
*/
```

### Tests

*Obs: Express processes identical requests one after another. Performing the same get from the same host with the same parameters can make it not run asynchronously, due to the express.*

Run the code below to test:
```
npm test
```
This will start an express server with 3 async routes and 3 sync routes.
You can test all of them in your browser and see that sync routes will lock all the others, while async routes will allow other request, because they don't lock the Event Loop.

Examples:
* Event loop free (async):
```
// Tab 1 - run:
http://127.0.0.1:3000/asyncsum/10000000000

// Tab 2 - run:
http://127.0.0.1:3000/asyncsum/10
// the second request will answer even while the first still running.
```

* Event loop blocked (sync):
```
// Tab 1 - run:
http://127.0.0.1:3000/syncfibo/44

// Tab 2 - run:
http://127.0.0.1:3000/asyncfibo/5
// the second request will wait the first finish, because the fist is running in the event loop.
```

### Notes
* Case the pool and queue are full, an error 'full' will be thrown.
* The workers will be allocated as needed, so just create a pool will not create all workers at same time.

Click [here](https://nodejs.org/docs/latest-v11.x/api/worker_threads.html) to read more about **worker_threads**.

## Author

* **Bruno Oliveira** - [Github](https://github.com/bruno303)

## License

The project is licensed under the MIT License. See the [LICENSE](https://github.com/bruno303/node-workers-pool/blob/master/LICENSE) file for more details