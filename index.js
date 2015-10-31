var express = require('express');
var mongoose = require('mongoose');
var app = express();

const port = 8556;

app.get('/', function (req, res) {
    res.send('Hello World')
});

mongoose.connect("mongodb://localhost/doge");
var db = mongoose.connection;

db.on("error", function (err) {
    console.error("Connection error:", err.message);
});

db.once("open", function () {
    console.info("Connected to DB");
});

app.listen(port);
console.log("Express application started on port " + port);