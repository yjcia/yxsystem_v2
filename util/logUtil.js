/**
 * Created by YanJun on 2015/7/3.
 */
var helper = {};
exports.helper = helper;
var log4js = require('log4js');
var fs = require("fs");
var path = require("path");
var objConfig = JSON.parse(fs.readFileSync("./log4js.json", "utf8"));
log4js.configure(objConfig);
var logDebug = log4js.getLogger('logDebug');
var logInfo = log4js.getLogger('logInfo');
var logWarn = log4js.getLogger('logWarn');
var logErr = log4js.getLogger('logErr');

helper.writeDebug = function (msg) {
    if (msg == null)
        msg = "";
    logDebug.debug(msg);
};

helper.writeInfo = function (msg) {
    if (msg == null)
        msg = "";
    logInfo.info(msg);
};

helper.writeWarn = function (msg) {
    if (msg == null)
        msg = "";
    logWarn.warn(msg);
};

helper.writeErr = function (msg, exp) {
    if (msg == null)
        msg = "";
    if (exp != null)
        msg += "\r\n" + exp;
    logErr.error(msg);
};

exports.use = function (app) {
    app.use(log4js.connectLogger(logInfo, {format: ':method :url'}));
};