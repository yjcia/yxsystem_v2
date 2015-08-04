/**
 * Created by YanJun on 2015/7/10.
 */
var moment = require('moment');
var month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
var result = new Array();
result[0] = {month: '06', amount: 34};
result[1] = {month: '11', amount: 22};

//month.splice(month.indexOf('02'),1);

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
console.log(new Date("2015-08-15").getTime());
