var express = require('express');
var router = express.Router();
var sql = require("../sql.js");
var log = require('../util/logUtil');
var wxUtil = require('../util/wxUtil');
//var conf = require("./config.js");
/* GET users listing. */
router.get('/setting', function (req, res, next) {
    res.render('setting');
});

router.get('/wxConnect', function (req, res, next) {
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var token = Sys.token;
    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = token;
    oriArray.sort();
    var original = oriArray[0]+oriArray[1]+oriArray[2];
    console.log("Original Str:"+original);
    console.log("signature:"+signature);
    var scyptoString = wxUtil.helper.sha1(original);
    if (signature == scyptoString) {
        res.send(echostr);
    }
    else {
        res.send("Bad Token!");
    }
    log.helper.writeDebug("connected wei xin server...");
    //res.render('test');

});

router.get('/getToken',function(req,res,next){
    wxUtil.helper.getToken()
});

router.get('/getChargeNames', function (req, res, next) {
    var user = req.session.user;
    if (user && user.id != null) {
        var User = DB.getTableObj('User');
        var sql = Sql.getChargeNames;
        var params = [];
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
        req.session.user = null;
        res.locals.user = null;
        res.redirect("/user/login");
    }
});

module.exports = router;