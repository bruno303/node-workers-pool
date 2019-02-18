"use strict";

const express = require("express");
const logger = require("../logger")(true);
const app = express();
const path = require("path");
const port = 3076;
let pool = null;

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.route("/")
  .get((req, res) => {
    res.render("index");
  });

app.route("/refresh")
  .get((req, res) => {
    res.json(pool.getState());
  });

function createAdmPanel (vpool) {
  pool = vpool;
  app.listen(port, () => logger.registerLogExec(`Adm panel running in: http://127.0.0.1:${port}.`));
}

module.exports = {
  createAdmPanel
};
