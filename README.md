# node-workers-pool
Easy way to manage a pool of worker threads.

## Introdução

Passo a passo para rodar a aplicação:

### Pré-requisitos

* [NodeJs](https://nodejs.org/en/)
* [Npm](https://www.npmjs.com/)

### Instalação

* Creating a pool with max 10 workers.
```
const pool = require('node-workers-pool')({
    max: 10
});
```

* If options is missing, the max number of workers will be the core's number of the machine.

* Creating a task and sending to queue
```
const pool = require('node-workers-pool')(); // max will be require('os').cpus().length

pool.enqueue((num1, num2) => num1 + num2,   // function to execute
    (err, result) => {      // callback called after execution
        if(err) {
            console.err(err);
        } else {
            console.log(`Executed in ${(new Date() - now) / 1000} sec(s). Result: ${result}`);
        }
    },
    15, 30); // parameters
```

* Another example
```
const pool = require('node-workers-pool')(); // max will be require('os').cpus().length

function fibonacci(num) {
    if (num < 2){
        return num
    }
    return fibonacci(num - 1) + fibonacci(num - 2);
}

pool.enqueue(fibonnaci,   // function to execute
    (err, result) => {      // callback called after execution
        if(err) {
            console.err(err);
        } else {
            console.log(`Executed in ${(new Date() - now) / 1000} sec(s). Result: ${result}`);
        }
    },
    40); // parameters
```

* Multiple parameters example
```
const pool = require('node-workers-pool')(); // max will be require('os').cpus().length

function mult(num1, num2, num3, num4) {
    return num1 * num2 * num3 * num4;
}

pool.enqueue(mult,   // function to execute
    (err, result) => {      // callback called after execution
        if(err) {
            console.err(err);
        } else {
            console.log(`Executed in ${(new Date() - now) / 1000} sec(s). Result: ${result}`);
        }
    },
    3, 5, 8, 10); // parameters
```

## Autores

* **Bruno Oliveira** - [bruno303](https://github.com/bruno303)

## Licença

O projeto está licenciado sobre a Licença MIT