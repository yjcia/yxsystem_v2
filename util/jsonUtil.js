/**
 * Created by YanJun on 2015/7/13.
 */
var helper = {};
var month = Sys.month;
exports.helper = helper;
helper.groupMonthData = function (result) {
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