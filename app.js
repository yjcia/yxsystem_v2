var fs = require("fs");
var conf = require("./config.js");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

global.DB = require("./util/dbUtil.js").Instance();
DB.binding({modelName: 'User', tableName: 't_user', fields: ['id', 'username', 'password', 'role', 'email']});
DB.binding({
    modelName: 'Charge',
    tableName: 't_charge',
    fields: ['id', 'u_id', 'charge_cate_id', 'amount', 'type', 'date', 'is_void']
});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('routes', __dirname + '/routes/');
var log = require('./util/logUtil');
log.use(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'yanjun',
    cookie: {maxAge: 60000 * 30, secure: false},
    saveUninitialized: true,
    resave: true
}));
//session filter
app.all("*", function (req, res, next) {
    var permissionFail = false;
    var adminRole = false;
    var adminUrl = false;
    var user = req.session.user;
    res.locals.message = "";
    Sys.permissionUrls.forEach(function (url) {
        if (user == null && req.url.indexOf(url) > -1) {
            permissionFail = true;
            return;
        }
    });
    if (!permissionFail) {
        Sys.adminUrls.forEach(function (url) {
            if (req.url.indexOf(url) > -1) {
                adminUrl = true;
            }
        });
        if (user != null && user.role == "1") {
            adminRole = true;
        }
    }

    if (permissionFail) {
        log.helper.writeDebug("Permission Fail");
        res.render("loginsys");
    } else {
        if (!adminRole && adminUrl) {
            var err = new Error('No Access');
            err.status = 403;
            res.render('error', {
                message: err.message,
                error: err
            });
        } else {
            res.locals.user = user;
            next();
        }
    }
});
var routes = app.get("routes");
fs.readdirSync(routes).forEach(function (fileName) {
    var filePath = routes + fileName;
    var rname = fileName.substr(0, fileName.lastIndexOf("."));
    //logger.info(rname);
    if (!fs.lstatSync(filePath).isDirectory()) {
        if (rname === "index") {
            app.use("/", require(filePath));
        } else {
            app.use("/" + rname, require(filePath));
        }
    }
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        log.helper.writeErr(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
