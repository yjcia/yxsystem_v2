/**
 * Created by YanJun-Home on 2015/11/1.
 */
var helper = {};
var crypto = require('crypto');
var log = require('../util/logUtil');
var https = require('https');
exports.helper = helper;

helper.sha1 = function(str){
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};

helper.getToken = function(str){
    var url ='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='
        +Sys.appid+'&secret='+Sys.appsecret;
    log.helper.writeDebug(url);
    var req = https.get(url, function (res) {

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            log.helper.writeDebug('access_token: ' + JSON.parse(chunk).access_token);
        });
    });
};