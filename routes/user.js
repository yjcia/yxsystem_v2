var express = require('express');
var async = require('async');
var fs = require('fs');
var router = express.Router();
var conf = require("../config.js");
var formidable = require('formidable');
var log = require('../util/logUtil');
var json = require('../util/jsonUtil');
var logoUploadPath = './public/images/logo/';
var month = Sys.month;
//log.use(app);
function groupMonthData(result) {
    var jsonArr = new Array();
    var resultMonthArr = new Array();
    var existMonth = new Array();
    var longerArr = new Array();
    var shorterArr = new Array();
    var jsonObjArr = new Array();
    for (var i = 0; i < result.length; i++) {
        resultMonthArr.push(result[i].month);
    }
    if (resultMonthArr.length < month.length) {
        longerArr = month;
        shorterArr = resultMonthArr;
    }
    for (var i = 0; i < longerArr.length; i++) {
        if (jsonArr.join(',').indexOf(longerArr[i]) < 0) {
            jsonArr.push(longerArr[i]);
        }
    }
    for (var i = 0; i < shorterArr.length; i++) {
        if (jsonArr.join(',').indexOf(shorterArr[i]) > -1) {
            existMonth.push(shorterArr[i]);
            jsonArr.splice(jsonArr.indexOf(shorterArr[i]), 1);
        } else {
            if (existMonth.join(',').indexOf(shorterArr[i]) < 0) {
                jsonArr.push(shorterArr[i]);
            }
        }
    }
    for (var i = 0; i < jsonArr.length; i++) {
        var jsonObj = new Object();
        jsonObj.month = jsonArr[i];
        jsonObj.amount = 0;
        jsonObjArr.push(jsonObj);
    }
    function sortNumber(a, b) {
        return a.month - b.month
    }

    var returnData = jsonObjArr.concat(result).sort(sortNumber);
    return returnData;
}
/* GET users listing. */
router.get('/console', function (req, res, next) {
    res.render('console');
});

router.post('/login', function (req, res, next) {
    var User = DB.getTableObj("User");
    var email = req.body.email;
    var password = req.body.password;
    var params = {email: email, password: password};
    User.queryByCondition(params, function (err, result) {
        if (err) {
            log.helper.writeErr(err);
        } else {
            if (result && result.length > 0) {
                req.session.user = result[0];
                res.locals.user = result[0];
                res.redirect("/user/index");
            } else {
                res.render("loginsys", {message: 'Email or Password Wrong!'});
            }
        }
    });
});

router.post('/amountLineMonth', function (req, res, next) {
    var user = req.session.user;
    log.helper.writeDebug(user);
    if (user && user.id != null) {
        var User = DB.getTableObj('User');
        var sql = "select a.u_id,date_format(a.date,'%m') as month,date_format(a.date,'%Y') as year," +
            "sum(a.amount) as amount from t_charge a where a.u_id = ? and a.type = ? and date_format(a.date,'%Y') = date_format(sysdate(),'%Y') " +
            "group by date_format(a.date,'%m')";
        var params = [user.id, req.body.type];
        User.executeSql(sql, params, function (err, result) {
            if (err) {
                log.helper.writeDebug(err);
                res.json(null);
            } else {
                if (result && result.length > 0) {

                    var returnData = groupMonthData(result);
                    log.helper.writeDebug('AmountLine month :' + returnData);
                    res.json(returnData);
                }
            }
        });
    }
});

router.post('/bothAmountLineMonth', function (req, res, next) {
    var user = req.session.user;
    if (user && user.id != null) {
        var User = DB.getTableObj('User');
        var sqlForCost = "select a.u_id,date_format(a.date,'%m') as month,date_format(a.date,'%Y') as year," +
            "sum(a.amount) as amount from t_charge a where a.u_id = ? and a.type = 0 " +
            "and date_format(a.date,'%Y') = date_format(sysdate(),'%Y') " +
            "group by date_format(a.date,'%m')";
        var sqlForRev = "select a.u_id,date_format(a.date,'%m') as month,date_format(a.date,'%Y') as year," +
            "sum(a.amount) as amount from t_charge a where a.u_id = ? and a.type = 1 " +
            "and date_format(a.date,'%Y') = date_format(sysdate(),'%Y') " +
            "group by date_format(a.date,'%m')";
        var params = [user.id];
        async.series({
                forCost: function (callback) {
                    User.executeSql(sqlForCost, params, function (err, result) {
                        if (err) {
                            log.helper.writeDebug(err);
                            res.json(null);
                        } else {
                            if (result && result.length > 0) {

                                var returnData = groupMonthData(result);
                                //log.helper.writeDebug('Cost AmountLine month :' + returnData);
                                callback(null, {name: 'cost', data: returnData});
                            }
                        }
                    });
                },
                forRev: function (callback) {
                    User.executeSql(sqlForRev, params, function (err, result) {
                        if (err) {
                            log.helper.writeDebug(err);
                            res.json(null);
                        } else {
                            if (result && result.length > 0) {
                                var jsonArr = new Array();
                                var resultMonthArr = new Array();
                                var existMonth = new Array();
                                var longerArr = new Array();
                                var shorterArr = new Array();
                                var jsonObjArr = new Array();

                                var returnData = groupMonthData(result, jsonArr, resultMonthArr, existMonth, longerArr, shorterArr, jsonObjArr);
                                //log.helper.writeDebug('Rev AmountLine month :' + returnData);
                                callback(null, {name: 'rev', data: returnData});
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
    }
});

router.post('/amountLineYear', function (req, res, next) {
    var user = req.session.user;
    var month = Sys.month;
    log.helper.writeDebug(user);
    if (user && user.id != null) {
        var User = DB.getTableObj('User');
        var sql = "select a.u_id,date_format(a.date,'%Y') as year,sum(a.amount) as amount from t_charge a " +
            "where a.u_id = ? and a.type = ? group by date_format(a.date,'%Y')";
        var params = [user.id, req.body.type];
        User.executeSql(sql, params, function (err, result) {
            if (err) {
                log.helper.writeDebug(err);
                res.json(null);
            } else {
                if (result && result.length > 0) {
                    //log.helper.writeDebug('AmountLine year ' + result);
                    res.json(result);
                }
            }
        });
    }
});

router.post('/amountTypePie', function (req, res, next) {
    var user = req.session.user;
    var month = Sys.month;
    log.helper.writeDebug(user);
    if (user && user.id != null) {
        var User = DB.getTableObj('User');
        var sql = "select b.name,sum(a.amount) as amount from t_charge a " +
            "left join t_charge_cate b on a.charge_cate_id = b.id where a.u_id = ? and a.type = ? " +
            "and date_format(a.date,'%Y') = date_format(sysdate(),'%Y') group by b.id";
        var params = [user.id, req.body.type];
        User.executeSql(sql, params, function (err, result) {
            if (err) {
                log.helper.writeDebug(err);
                res.json(null);
            } else {
                if (result && result.length > 0) {
                    //log.helper.writeDebug('AmountTypePie year ' + result);
                    res.json(result);
                }
            }
        });
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
                var newUser = {username: username, email: email, password: password};
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
                                    res.redirect("/user/index");
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
module.exports = router;
