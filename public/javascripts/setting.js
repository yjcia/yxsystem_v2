/**
 * Created by YanJun on 2015/8/11.
 */
function initChargeTable() {
    $('#chargeSettingTable').bootstrapTable({
        method: 'get',
        url: 'getChargesByUid',
        cache: false,
        //height: 400,
        striped: true,
        pagination: true,
        pageSize: 5,
        pageList: [5, 10],
        search: true,
        showColumns: true,
        showRefresh: true,
        minimumCountColumns: 2,
        clickToSelect: true,
        columns: [{
            //field: 'state',
            checkbox: true,
            rowspan: 2,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'id',
            title: '编号',
            align: 'center',
            valign: 'middle',
            sortable: true,
            visible: false
        }, {
            field: 'name',
            title: '类型',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'amount',
            title: '费用',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'date',
            title: '日期',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'type',
            title: '收入/支出',
            align: 'center',
            valign: 'middle'
        },
            {
                field: 'remark',
                title: '备注',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'operate',
                title: '操作',
                align: 'center',
                events: operateEvents,
                formatter: operateFormatter
            }]
    });
}
function initEditDateTimepicker() {
    $('#chargeDateDiv')
        .datetimepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            minView: 2,
            todayHighlight: true


        })
        .on('dp.change dp.show', function (e) {
            $('#chargeEditForm')
                .data('bootstrapValidator')
                .updateStatus('date', 'NOT_VALIDATED', null)
                .validateField('date');
        });
}
function initAddDateTimepicker() {
    $('#addChargeDateDiv')
        .datetimepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            minView: 2,
            todayHighlight: true


        })
        .on('dp.change dp.show', function (e) {
            $('#chargeAddForm')
                .data('bootstrapValidator')
                .updateStatus('date', 'NOT_VALIDATED', null)
                .validateField('date');
        });
}
function initChargeNames() {
    $.ajax({
        url: '/admin/getChargeNames',
        type: 'get',
        success: function (result) {
            //console.log(result);
            for (var i = 0; i < result.length; i++) {
                //addCateSelect
                $("#cateSelect").append("<option value='" + result[i].id + "'>" + result[i].name + "</option>");
                $("#addCateSelect").append("<option value='" + result[i].id + "'>" + result[i].name + "</option>");
            }
        }
    });
}

$(function () {
    initChargeTable();
    initEditDateTimepicker();
    initAddDateTimepicker();
    initChargeNames();
});
function operateFormatter(value, row, index) {
    return [
        '<a class="edit" href="javascript:void(0)" title="Eidt">',
        '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editChargeModal">' +
        '编辑</button>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<button type="button" class="btn btn-danger">删除</button>',
        '</a>'
    ].join('');
}
function saveChargeUpdate() {
    $.ajax({
        url: '/user/updateCharge',
        data: {
            id: $('#editId').val(),
            amount: $('#editAmount').val(),
            cate: $('#cateSelect option:selected').val(),
            date: $('#editDate').val(),
            type: $('#typeSelect option:selected').val(),
            remark: $('#editRemark').val()
        },
        type: 'post',
        success: function (result) {
            console.log(result);
            $('#editChargeModal').modal('hide');
            if (result.affectedRows > 0) {
                $('#chargeSettingTable').bootstrapTable('refresh', {silent: true});
            }
        }
    });
}

function saveNewCharge() {
    $.ajax({

        url: '/user/addCharge',
        data: {
            amount: $('#addAmount').val(),
            cate: $('#addCateSelect option:selected').val(),
            date: $('#addDate').val(),
            type: $('#typeSelect option:selected').val(),
            remark: $('#addRemark').val()
        },
        type: 'post',
        success: function (result) {
            console.log(result);
            $('#addChargeModal').modal('hide');
            if (result.affectedRows > 0) {
                $('#chargeSettingTable').bootstrapTable('refresh', {silent: true});
            }
        }
    });
}

window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        //alert('You click like action, row: ' + JSON.stringify(row));
        var cateIndex = 0;
        var typeIndex = 0;
        var cateObj = ['Food', 'Traffic', 'Telecome', 'Electric', 'Gas', 'Others'];
        var type = ['rev', 'cost'];
        for (var i = 0; i < cateObj.length; i++) {
            if (row.name == cateObj[i]) {
                cateIndex = i;
                break;
            }
        }
        for (var i = 0; i < type.length; i++) {
            if (row.type == type[i]) {
                typeIndex = i;
                break;
            }
        }
        $('#editId').val(row.id);
        $('#editAmount').val(row.amount);
        $('#cateSelect').val(cateIndex + 1);
        $('#editDate').val(row.date);
        $('#typeSelect').val(typeIndex);
        $('#editRemark').val(row.remark);
    },
    'click .remove': function (e, value, row, index) {
        $.ajax({
            url: '/user/removeCharge',
            data: {
                id: row.id
            },
            type: 'post',
            success: function (result) {
                console.log(result);
                if (result.affectedRows > 0) {
                    $('#chargeSettingTable').bootstrapTable('remove', {
                        field: 'id',
                        values: [row.id]
                    });
                }
            }
        });
    }
};