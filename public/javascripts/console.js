/**
 * Created by YanJun on 2015/7/6.
 */
var chartsProp = {
    costAmountLineMonth: {title: 'Cost Amount Line (Month)', container: '#container1'},
    costAmountLineYear: {title: 'Cost Amount Line (Year)', container: '#container2'},
    costAmountType: {title: 'Current Year Cost Amount Type', container: '#container3'},
    revAmountLineMonth: {title: 'Rev Amount Line (Month)', container: '#container4'},
    revAmountLineYear: {title: 'Rev Amount Line (Year)', container: '#container5'},
    revAmountType: {title: 'Current Year Rev Amount Type', container: '#container6'},
    revCostAmountLineMonth: {title: 'Rev & Cost Amount Line (Month)', container: '#containerBoth'}
};

var calendarProp = {
    container: '#containerCalendar',
    tmpl_path: '/javascripts/bootstrap-calendar/tmpls/'
};

function getCalendar() {
    $('.btn-group button[data-calendar-nav]').each(function () {
        var $this = $(this);
        $this.click(function () {
            calendar.navigate($this.data('calendar-nav'));
        });
    });
    $('.btn-group button[data-calendar-view]').each(function () {
        var $this = $(this);
        $this.click(function () {
            calendar.view($this.data('calendar-view'));
        });
    });
    var calendar = $(calendarProp.container).calendar(
        {
            tmpl_path: calendarProp.tmpl_path,
            events_source: '/javascripts/bootstrap-calendar/events.json.php',
            onAfterEventsLoad: function (events) {
                if (!events) {
                    return;
            }
                var list = $('#eventlist');
                list.html('');

                $.each(events, function (key, val) {
                    $(document.createElement('li'))
                        .html('<a href="' + val.url + '">' + val.title + '</a>')
                        .appendTo(list);
                });
            },
            onAfterViewLoad: function (view) {
                $('.page-header h3').text(this.getTitle());
                $('.btn-group button').removeClass('active');
                $('button[data-calendar-view="' + view + '"]').addClass('active');
            },
            classes: {
                months: {
                    general: 'label'
                }
            }
        });
}

function getAmountLineMonth(title, containerId, type) {
    $.ajax({
        url: '/user/amountLineMonth',
        data: {
            type: type
        },
        type: 'post',
        success: function (result) {
            //console.log(result);
            if (result && result.length > 0) {
                var xData = new Array();
                for (var i = 0; i < result.length; i++) {
                    xData.push(result[i].amount);
                }
                generateAmountLineMonth(title, containerId, xData);
            }

        }
    });
}
function getAmountLineYear(title, containerId, type) {
    $.ajax({
        url: '/user/amountLineYear',
        type: 'post',
        data: {
            type: type
        },
        success: function (result) {
            //console.log(result);
            if (result && result.length > 0) {
                var xData = new Array();
                var xCate = new Array();
                for (var i = 0; i < result.length; i++) {
                    xData.push(result[i].amount);
                    xCate.push(result[i].year);
                }
                generateAmountLineYear(title, containerId, xCate, xData);
            }
        }
    });
}
function getAmountTypePie(title, containerId, type) {
    $.ajax({
        url: '/user/amountTypePie',
        type: 'post',
        data: {
            type: type
        },
        success: function (result) {
            if (result && result.length > 0) {
                var typeJsonData = new Array();
                for (var i = 0; i < result.length; i++) {
                    var typeArr = new Array();
                    typeArr.push(result[i].name);
                    typeArr.push(result[i].amount);
                    typeJsonData.push(typeArr);
                }
                generateAmountTypePie(title, containerId, typeJsonData);
            }

        }
    });
}
function getBothAmountLineMonth(title, containerId) {
    $.ajax({
        url: '/user/bothAmountLineMonth',
        type: 'post',
        success: function (result) {

            if (result != null) {

                var xData = new Array();
                var forCostDataArr = new Array();
                var forRevDataArr = new Array();
                var forCostData = result.forCost.data;
                var forRevData = result.forRev.data;
                for (var i = 0; i < forCostData.length; i++) {
                    forCostDataArr.push(forCostData[i].amount);
                    forRevDataArr.push(forRevData[i].amount);
                }
                xData.push({name: 'Cost', data: forCostDataArr});
                xData.push({name: 'Revv', data: forRevDataArr});
                generateBothAmountLineMonth(title, containerId, xData);
            }

        }
    });
}

function generateAmountLineMonth(title, containerId, xData) {
    $(containerId).highcharts({
        chart: {
            type: 'areaspline'
        },
        title: {
            text: title
        },
        xAxis: {
            title: {
                text: 'Month'
            },
            allowDecimals: false,
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Amount'
            },
            labels: {
                formatter: function () {
                    return this.value + 'CNY';
                }
            }
        },
        tooltip: {
            //pointFormat: '{series.name} generated <b>{point.y:,.0f}</b><br/>'
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 3,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'YANJUN',
            data: xData
        }]
    });
}
function generateAmountLineYear(title, containerId, xCate, xData) {
    $(containerId).highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: title
        },
        xAxis: {
            title: {
                text: 'Year'
            },
            allowDecimals: false,
            categories: xCate
        },
        yAxis: {
            title: {
                text: 'Amount'
            },
            labels: {
                formatter: function () {
                    return this.value + 'CNY';
                }
            }
        },
        tooltip: {
            //pointFormat: '{series.name} generated <b>{point.y:,.0f}</b><br/>'
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 3,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'YANJUN',
            data: xData
        }]
    });
}
function generateAmountTypePie(title, containerId, pieData) {
    $(containerId).highcharts({
        chart: {
            type: 'pie',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: title
        },
        tooltip: {
            pointFormat: '{point.y} CNY</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y} CNY',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            data: pieData
        }]
    });
}
function generateBothAmountLineMonth(title, containerId, xData) {
    $(containerId).highcharts({
        chart: {
            type: 'areaspline'
        },
        title: {
            text: title
        },
        xAxis: {
            title: {
                text: 'Month'
            },
            allowDecimals: false,
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Amount'
            },
            labels: {
                formatter: function () {
                    return this.value + 'CNY';
                }
            }
        },
        tooltip: {
            //pointFormat: '{series.name} generated <b>{point.y:,.0f}</b><br/>'
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 3,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: xData
    });
}
$(function () {
    getBothAmountLineMonth(chartsProp.revCostAmountLineMonth.title, chartsProp.revCostAmountLineMonth.container);

    getAmountLineMonth(chartsProp.costAmountLineMonth.title, chartsProp.costAmountLineMonth.container, 0);
    //getAmountLineYear(chartsProp.costAmountLineYear.title, chartsProp.costAmountLineYear.container, 0);
    getAmountTypePie(chartsProp.costAmountType.title, chartsProp.costAmountType.container, 0);

    getAmountLineMonth(chartsProp.revAmountLineMonth.title, chartsProp.revAmountLineMonth.container, 1);
    //getAmountLineYear(chartsProp.revAmountLineYear.title, chartsProp.revAmountLineYear.container, 1);
    getAmountTypePie(chartsProp.revAmountType.title, chartsProp.revAmountType.container, 1);

    getCalendar();
});