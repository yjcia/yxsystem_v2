var express = require('express');
var router = express.Router();
var sql = require("../sql.js");

/* GET users listing. */
router.get('/setting', function (req, res, next) {
    res.render('setting');
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