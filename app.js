var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql');

//init socket and express
var express = require("express");
var app = express("http");
var server = require("http").createServer(app);
var io = require("socket.io")(server);

//connect mongo
var url = "mongodb://localhost:27017/";
MongoClient.connect(url, { useNewUrlParser: true }, function function_name(err, db) {
    if (err) throw err;
    var dbconnect = db.db("thuthap");
    dbconnect.collection("giatri").findOne({}, function (err, result) {
        if (err) {
            console.log("don't connect mongodb");
        }
        console.log('connected mongodb');
    });
});

//init app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "mysecret" }));
app.use(passport.initialize());
app.use(passport.session());

// view setup
app.set("views", "./view");
app.set("view engine", "ejs");

// setup public folder
app.use(express.static("public"));

// passport strategy
passport.use(new localStrategy(
    (username, password, done) => {
        fs.readFile('./userDB.json', (err, data) => {
            var db = JSON.parse(data);
            var userRecord = db.find(user => user.user === username);
            if (userRecord && userRecord.pas === password) {
                return done(null, userRecord);
            } else {
                return done(null, false);
            }
        });
    }
));

//passport deserializeUser
passport.deserializeUser((name, done) => {
    fs.readFile("./userDB.json", function (err, data) {
        var db = JSON.parse(data);
        var userRecord = db.find(user => user.user === name);
        if (userRecord) {
            return done(null, userRecord);
        } else {
            return done(null, false);
        }
    });
});

//passport serializeUser
passport.serializeUser((user, done) => {
    done(null, user.user);
});

//setup router
var adminpages = require("./routes/adminPages.js");
var login = require("./routes/login.js");
var detail_temp = require("./routes/detail-temp.js");
var detail_hum = require("./routes/detail-hum.js");

app.use("/login", login);
app.use("/", adminpages);
app.use("/detail-temp", detail_temp);
app.use("/detail-hum", detail_hum);

//start server
var port = 3000;
server.listen(port, function () {
    console.log('server is runing at ' + port);
});

// socket io
io.on("connection", function (socket) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var db1 = db.db("thuthap");
        db1.collection("table1").findOne({}, function (err, result) {
            var bang1 = new Climate();
            bang1.nhietdo = result.nhietdo;
            bang1.doam = result.doam;
            bang1.anhsang = result.anhsang;
            bang1.co2 = result.co2;
            socket.emit("server-send-bang1", bang1)
        });

        var db2 = db.db("thuthap");
        db2.collection("table2").findOne({}, function (err, result) {
            var bang2 = new Irrigation();
            bang2.ph = result.ph;
            bang2.ec = result.ec;
            bang2.waterTemp = result.waterTemp;
            bang2.Oxygen = result.Oxygen;
            socket.emit("server-send-bang2", bang2)
        });
    });

    // gui socket data
    let sql = "SHOW TABLES LIKE 'Irr_" + now + "'";
    db.query(sql, (err, result) => {
        if (err) throw err;
        var resultStr = JSON.stringify(result);
        if (resultStr.length != 2) {
            let sql = "SELECT * FROM irr_" + now;
            db.query(sql, (err, result) => {
                if (err) throw err;
                socket.emit("datasendIrr", result);
            });
        }
    });
    let sql1 ="SHOW TABLES LIKE 'Cli_"+now+"'";
    db.query(sql1,(err,result)=>{
        if(err) throw err;
        var resultStr = JSON.stringify(result);
        if(resultStr.length!=2){
            let sql = "SELECT * FROM cli_" + now;
            db.query(sql, (err, result) => {
                if (err) throw err;
                socket.emit("datasendCli", result);
            });
        }
    });
});
    // create object Database
    function Climate(nhietdo, doam, angsang, co2) {
        this.nhietdo = nhietdo;
        this.doam = doam;
        this.co2 = co2;
        return this;
    }
    function Irrigation(ph, ec, waterTemp, Oxygen) {
        this.ph = ph;
        this.ec = ec;
        this.waterTemp = waterTemp;
        this.Oxygen = Oxygen;
        return this;
    }

    //----> render database to chartjs

    //connect mysql
    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "quanlynongnghiep"
    });


    var today = new Date();
    var now = today.toDateString();
    now = now.replace(/\s/g, '_');