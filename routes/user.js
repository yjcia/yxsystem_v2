var express = require('express');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var jsonUtil = require('../util/jsonUtil');
var router = express.Router();
var conf = require("../config.js");
var sql = require("../sql.js");
var moment = require('moment');
var formidable = require('formidable');
var log = require('../util/logUtil');
var json = require('../util/jsonUtil');
var logoUploadPath = './public/images/logo/';

//log.use(app);

/* GET users listing. */
router.get('/console', function (req, res, next) {
    res.render('console');
});

router.get('/setting', function (req, res, next) {
    res.render('setting');
});

router.get('/logout', function (req, res, next) {
    var user = req.session.user;
    if (user && user.id != null) {
        var params = {id: user.id, is_login: 0, last_login_ip: null, last_login_time: null};
        var User = DB.getTableObj("User");
        User.update(params, function (err, result) {
            if (err) {
                log.helper.writeErr(err);
            } else {
                log.helper.writeDebug(user.username + ' log out at ' + moment().format(Sys.dateFormat));
                req.session.user = null;
                res.locals.user = null;
                res.redirect("/user/login");
            }
        });
    } else {
        req.session.user = null;
        res.locals.user = null;
        res.redirect("/user/login");
    }
});

router.post('/login', function (req, res, next) {
    var User = DB.getTableObj("User");
    var email = req.body.email;
    var password = req.body.password;
    var shasum = crypto.createHash('sha1');
    shasum.update(password);
    var safePwd = shasum.digest('hex');
    var params = {email: email, password: safePwd};
    User.queryByCondition(params, function (err, result) {
        if (err) {
            log.helper.writeErr(err);
        } else {
            if (result && result.length > 0) {
                req.session.user = result[0];
                res.locals.user = result[0];
                if (result[0].is_login == 1) {
                    res.render("loginsys", {message: 'User has logged in!'});
                } else {
                    var params = {
                        id: result[0].id,
                        is_login: 1,
                        last_login_ip: req.connection.remoteAddress,
                        last_login_time: moment().format(Sys.dateFormat)
                    };
                    User.update(params, function (err, result) {
                        if (err) {
                            log.helper.writeErr(err);
                        } else {
                            req.session.user.is_login = 1;
                            res.locals.user.is_login = 1;
                            res.redirect("/user/index");
                        }
                    });
                }


            } else {
                res.render("loginsys", {message: 'Email or Password Wrong!'});
            }
        }
    });
});

router.post('/amountLineMonth', function (req, res, next) {
    var user = req.session.user;
    //log.helper.writeDebug(user);
    if (user && user.id != null) {
        var User = DB.getTableObj('User');
        var sql = Sql.amountLineMonth;
        var params = [user.id, req.body.type];
        User.executeSql(sql, params, function (err, result) {
            if (err) {
                log.helper.writeErr(err);
                res.json(null);
            } else {
                if (result && result.length > 0) {
                    var returnData = jsonUtil.helper.groupMonthData(result);
                    log.helper.writeDebug('AmountLine month :' + returnData);
                    res.json(returnData);
                } else {
                    res.json(null);
                }
            }
        });
    } else {
        res.json(null);
    }
});

router.post('/bothAmountLineMonth', function (req, res, next) {
    var user = req.session.user;
    if (user && user.id != null) {
        var User = DB.getTableObj('User');
        var sqlForCost = Sql.bothAmountLineMonthForCost;
        var sqlForRev = Sql.bothAmountLineMonthForRev;
        var params = [user.id];
        async.series({
                forCost: function (callback) {
                    User.executeSql(sqlForCost, params, function (err, result) {
                        if (err) {
                            log.helper.writeErr(err);
                            res.json(null);
                        } else {
                            if (result && result.length > 0) {

                                var returnData = jsonUtil.helper.groupMonthData(result);
                                //log.helper.writeDebug('Cost AmountLine month :' + returnData);
                                callback(null, {name: 'cost', data: returnData});
                            } else {
                                callback(null, {name: 'cost', data: null});
                            }
                        }
                    });
                },
                forRev: function (callback) {
                    User.executeSql(sqlForRev, params, function (err, result) {
                        if (err) {
                            log.helper.writeErr(err);
                            res.json(null);
                        } else {
                            if (result && result.length > 0) {
                                var returnData = jsonUtil.helper.groupMonthData(result);
                                //log.helper.writeDebug('Rev AmountLine month :' + returnData);
                                callback(null, {name: 'rev', data: returnData});
                            } else {
                                callback(null, {name: 'rev', data: null});
                            }
                        }
                    });
                }
            },
            function (err, results) {
                // results is now equal to: {one: 1, two: 2}
                if (err) {
                    log.helper.writeErr(err);
                } else {
                    //log.helper.writeDebug(results);
                    res.json(results);
                }
            }
        );
    } else {
        res.json(null);
    }
});

router.post('/amountLineYear', function (req, res, next) {
    var user = req.session.user;
    //log.helper.writeDebug(user);
    if (user && user.id != null) {
        var User = DB.getTableObj('User');
        var sql = Sql.amountLineYear;
        var params = [user.id, req.body.type];
        User.executeSql(sql, params, function (err, result) {
            if (err) {
                log.helper.writeErr(err);
                res.json(null);
            } else {
                if (result && result.length > 0) {
                    //log.helper.writeDebug('AmountLine year ' + result);
                    res.json(result);
                } else {
                    res.json(null);
                }
            }
        });
    } else {
        res.json(null);
    }
});

router.post('/amountTypePie', function (req, res, next) {
    var user = req.session.user;
    //log.helper.writeDebug(user);
    if (user && user.id != null) {
        var User = DB.getTableObj('User');
        var sql = Sql.amountTypePie;
        var params = [user.id, req.body.type];
        User.executeSql(sql, params, function (err, result) {
            if (err) {
                log.helper.writeErr(err);
                res.json(null);
            } else {
                if (result && result.length > 0) {
                    //log.helper.writeDebug('AmountTypePie year ' + result);
                    res.json(result);
                } else {
                    res.json(null);
                }
            }
        });
    } else {
        res.json(null);
    }
});

router.post('/uploadlogo', function (req, res, next) {
    var form = new formidable.IncomingForm;
    form.parse(req, function (err, fields, files) {
        var logoPath = files.logo.path;
        var logoName = files.logo.name;
        fs.readFile(files.logo.path, 'utf-8', function (err, data) {
            if (data) {
                //log.helper.writeDebug(data);
                var logoUploadNewPath = logoUploadPath + logoName;
                fs.exists(logoUploadNewPath, function (exists) {
                    if (!exists) {
                        var readStream = fs.createReadStream(files.logo.path);
                        var writeStream = fs.createWriteStream(logoUploadNewPath);
                        readStream.on('data', function (chunk) { // 当有数据流出时，写入数据
                            writeStream.write(chunk);
                        });
                        readStream.on('end', function () { // 当没有数据时，关闭数据流
                            writeStream.end();
                        });
                    }
                });
            }
        });
    });
});

router.post('/register', function (req, res, next) {
    var User = DB.getTableObj("User");
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var shasum = crypto.createHash('sha1');
    shasum.update(password);
    var safePwd = shasum.digest('hex');
    async.series({
            username: function (callback) {
                User.queryByCondition({username: username}, function (err, result) {
                    if (err) {
                        log.helper.writeErr(err);
                    } else {
                        //log.helper.writeDebug(result);
                        if (result && result.length > 0) {
                            callback(null, false);
                        } else {
                            callback(null, true);
                        }
                    }
                });
            },
            email: function (callback) {
                User.queryByCondition({email: email}, function (err, result) {
                    if (err) {
                        log.helper.writeErr(err);
                    } else {
                        //log.helper.writeDebug(result);
                        if (result && result.length > 0) {
                            callback(null, false);
                        } else {
                            callback(null, true);
                        }
                    }
                });
            }
        },
        function (err, results) {
            // results is now equal to: {one: 1, two: 2}
            var usernamePass = results.username;
            var emailPass = results.email;
            log.helper.writeDebug(results);
            if (usernamePass && emailPass) {
                //insert new user
                var newUser = {username: username, email: email, password: safePwd};
                User.insert(newUser, function (err, newId) {
                    if (err) {
                        log.helper.writeErr(err);
                    } else {
                        //log.helper.writeDebug("new user id : " + newId);
                        User.getById(newId, function (err, result) {
                            if (err) {
                                log.helper.writeErr(err);
                            } else {
                                log.helper.writeDebug(result);
                                if (result) {
                                    req.session.user = result;
                                    res.locals.user = result;
                                    var params = {
                                        id: result.id,
                                        is_login: 1,
                                        last_login_ip: req.connection.remoteAddress,
                                        last_login_time: moment().format(Sys.dateFormat)
                                    };
                                    User.update(params, function (err, result) {
                                        if (err) {
                                            log.helper.writeErr(err);
                                        } else {
                                            req.session.user.is_login = 1;
                                            res.locals.user.is_login = 1;
                                            res.redirect("/user/index");
                                        }
                                    });
                                    //res.redirect("/user/index");
                                } else {
                                    res.render("loginsys", {message: 'Register Error !'});
                                }
                            }
                        });
                    }
                });
            } else {
                if (usernamePass && !emailPass)
                    res.render("loginsys", {message: 'Register Email Error !'});
                else if (!usernamePass && emailPass) {
                    res.render("loginsys", {message: 'Register Name Error !'});
                } else if (!usernamePass && !emailPass) {
                    res.render("loginsys", {message: 'Register Name & Email Error !'});
                }
            }
        }
    );

});

router.get('/login', function (req, res, next) {
    res.render('loginsys', {message: ''});
});

router.get("/index", function (req, res) {
    //log.helper.writeDebug('index user session :' + req.session.user);
    res.render("index");
});

router.post('/getChargeCalendar', function (req, res, next) {
    var user = req.session.user;
    if (user && user.id != null) {
        var User = DB.getTableObj('User');
        var params = [user.id];
        User.executeSql(Sql.getChargeCalendar, params, function (err, result) {
            if (err) {
                log.helper.writeErr(err);
                res.json({});
            } else {
                if (result && result.length > 0) {
                    log.helper.writeDebug(result);
                    //callback(null, result);
                    var calendarArr = new Array();
                    var returnObj = {};
                    for (var i = 0; i < result.length; i++) {
                        var calenderObj = {
                            id: result[i].id,
                            title: result[i].name != '' ? result[i].name : " " +
                            result[i].title != '' ? result[i].title : "",
                            class: "event-warning",
                            start: new Date(result[i].date).getTime(),
                            end: new Date(result[i].date).getTime()
                        };
                        calendarArr.push(calenderObj);
                        returnObj.success = 1;
                        returnObj.result = calendarArr;

                    }
                    res.json(returnObj);
                } else {
                    var calendarArr = new Array();
                    var returnObj = {};
                    //callback(null,null);
                    var calenderObj = {
                        id: '',
                        title: '',
                        class: '',
                        start: '',
                        end: ''
                    };
                    calendarArr.push(calenderObj);
                    returnObj.success = 1;
                    returnObj.result = calendarArr;
                    res.json(returnObj);
                }
            }
        });
    } else {
        res.json({});
    }
});

router.get('/getChargesByUid', function (req, res, next) {
    var user = req.session.user;
    if (user && user.id != null) {
        var User = DB.getTableObj('User');
        var params = [user.id];
        User.executeSql(Sql.getChargesByUid, params, function (err, result) {
            if (err) {
                log.helper.writeErr(err);
                res.json(null);
            } else {
                if (result && result.length > 0) {
                    log.helper.writeDebug(result);
                    //callback(null, result);
                    res.json(result);
                } else {
                    //callback(null,null);
                    res.json({});
                }
            }
        });
    }
});

router.post('/removeCharge', function (req, res, next) {
    var user = req.session.user;
    var id = req.body.id;
    if (user && user.id != null && (id != null || id != '')) {
        var Charge = DB.getTableObj('Charge');
        Charge.removeById(id, function (err, result) {
            if (err) {
                log.helper.writeErr(err);
                res.json(null);
            } else {
                if (result && result.affectedRows > 0) {
                    log.helper.writeDebug(result);
                    res.json(result);
                } else {
                    res.json({});
                }
            }
        });
    }
});

router.post('/updateCharge', function (req, res, next) {
    var user = req.session.user;
    var id = req.body.id;
    var params = {
        id: req.body.id,
        amount: req.body.amount,
        charge_cate_id: req.body.cate,
        date: req.body.date,
        type: req.body.type,
        remark: req.body.remark
    };
    if (user && user.id != null && (id != null || id != '')) {
        var Charge = DB.getTableObj('Charge');
        Charge.update(params, function (err, result) {
            if (err) {
                log.helper.writeErr(err);
                res.json(null);
            } else {
                if (result && result.affectedRows > 0) {
                    log.helper.writeDebug(result);
                    res.json(result);
                } else {
                    res.json({});
                }
            }
        });
    }
});

router.post('/addCharge', function (req, res, next) {
    var user = req.session.user;
    //var id = req.body.id;
    var params = {
        u_id: user.id,
        amount: req.body.amount,
        charge_cate_id: req.body.cate,
        date: req.body.date,
        type: req.body.type,
        remark: req.body.remark
    };
    if (user && user.id != null) {
        var Charge = DB.getTableObj('Charge');
        Charge.insert(params, function (err, newId) {
            if (err) {

                log.helper.writeErr(err);
                res.json(null);
            } else {
                if (newId > 0) {
                    log.helper.writeDebug(newId);
                    res.json(newId);
                } else {
                    res.json({});
                }
            }
        });
    }
});

router.get("/test", function (req, res) {
    //log.helper.writeDebug('index user session :' + req.session.user);
    res.render("test");
});
module.exports = router;
