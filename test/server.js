"use strict";

const port = 3000;
const express = require("express");
const app = express();
const log = require("./logger.js")(true);

/* Create a pool */
const Pool = require("../src/Pool.js");
const pool = new Pool({ max: 3, queueMax: 50 });

/* Function example 1 */
function funcSum (num) {
  let sum = 0;
  for (let cont = 0; cont < num; cont++) {
    sum += cont;
  }
  return sum;
}

/* Function example 2 */
const funcFibonacci = require("./fibonacci.js");

app.use((req, res, next) => {
  req.connection.timeout = 1000 * 60 * 10;
  log.registerLogExec("Started " +
        (req.originalUrl.split("/")[1].indexOf("async") !== -1 ? "async" : "sync") +
        " exec.");
  next();
});

/**
 * Async Sum Route
 * Test: http://127.0.0.1:3000/asyncsum/1000000000
 */
app.route("/asyncsum/:num")
  .get((req, res) => {
    const now = new Date();

    try {
      /* Send to pool queue */
      pool.enqueue(funcSum, Number.parseInt(req.params.num, 10))
        .then(result => {
          res.status(200).send(`Executed in ${(new Date() - now) / 1000} sec(s). Result: ${JSON.stringify(result)}`);
          // pool.finishPool().then(() => log.registerLogExec('Pool finished!'));
          log.registerLogExec("Request finished.");
        })
        .catch(err => {
          res.status(500).send(`Error: ${JSON.stringify(err)}`);
        });
    } catch (err) {
      res.status(500).send(`Error: ${JSON.stringify(err)}`);
    }
  });

/**
 * Async Fibonacci Route
 * Test: http://127.0.0.1:3000/asyncfibo/45
 */
app.route("/asyncfibo/:num")
  .get((req, res) => {
    const now = new Date();

    try {
      /* Send to pool queue */
      pool.enqueue(funcFibonacci, Number.parseInt(req.params.num, 10))
        .then(result => {
          res.status(200).send(`Executed in ${(new Date() - now) / 1000} sec(s). Result: ${JSON.stringify(result)}`);
        })
        .catch(err => {
          res.status(500).send(`Error: ${JSON.stringify(err)}`);
        });
    } catch (err) {
      res.status(500).send(`Error: ${JSON.stringify(err)}`);
    }
  });

/* Async Multip Route */
app.route("/asyncmultip/:num/:num2/:num3")
  .get((req, res) => {
    const now = new Date();

    try {
      /* Send to pool queue */
      pool.enqueue(
        (num1, num2, num3) => num1 * num2 * num3, // Func
        Number.parseInt(req.params.num, 10), Number.parseInt(req.params.num2, 10), Number.parseInt(req.params.num3, 10) // Params
      ).then(result => {
        res.status(200).send(`Executed in ${(new Date() - now) / 1000} sec(s). Result: ${JSON.stringify(result)}`);
      })
        .catch(err => {
          res.status(500).send(`Error: ${JSON.stringify(err)}`);
        });
    } catch (err) {
      res.status(500).send(`Erro: ${JSON.stringify(err)}`);
    }
  });

/**
 * Sync Sum Route
 * Test: http://127.0.0.1:3000/syncsum/1000000000
 */
app.route("/syncsum/:num")
  .get((req, res) => {
    const now = new Date();

    /* Run in the Event Loop thread */
    let result = funcSum(Number.parseInt(req.params.num, 10));
    res.status(200).send(`Executed in ${(new Date() - now) / 1000} sec(s). Result: ${JSON.stringify(result)}`);
  });

/**
 * Sync Fibonacci Route
 * Test: http://127.0.0.1:3000/syncfibo/45
 */
app.route("/syncfibo/:num")
  .get((req, res) => {
    const now = new Date();

    /* Run in the Event Loop thread */
    let result = funcFibonacci(Number.parseInt(req.params.num, 10));
    res.status(200).send(`Executed in ${(new Date() - now) / 1000} sec(s). Result: ${JSON.stringify(result)}`);
  });

/**
 * Sync Multip Routes
 * Test: http://127.0.0.1:3000/syncmultip/45/45/50
 */
app.route("/syncmultip/:num/:num2/:num3")
  .get((req, res) => {
    const now = new Date();
    const funcMultip = (num1, num2, num3) => num1 * num2 * num3;

    /* Run in the Event Loop thread */
    let result = funcMultip(Number.parseInt(req.params.num1, 10),
      Number.parseInt(req.params.num2, 10),
      Number.parseInt(req.params.num3, 10));
    res.status(200).send(`Executed in ${(new Date() - now) / 1000} sec(s). Result: ${JSON.stringify(result)}`);
  });

app.listen(port, () => {
  log.registerLogExec(`Executing in: http://127.0.0.1:${port}.`);
});
