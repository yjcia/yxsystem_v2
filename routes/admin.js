var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/setting', function (req, res, next) {
    res.render('setting');
});

module.exports = router;