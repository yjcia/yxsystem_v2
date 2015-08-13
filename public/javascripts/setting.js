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
            title: 'ID',
            align: 'center',
            valign: 'middle',
            sortable: true,
            visible: false
        }, {
            field: 'name',
            title: 'Name',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'amount',
            title: 'Amount',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'date',
            title: 'Date',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'type',
            title: 'Type',
            align: 'center',
            valign: 'middle'
        },
            {
                field: 'remark',
                title: 'Remark',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'operate',
                title: 'Item Operate',
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
$(function () {
    initChargeTable();
    initEditDateTimepicker();
});
function operateFormatter(value, row, index) {
    return [
        '<a class="like" href="javascript:void(0)" title="Eidt">',
        '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editChargeModal">' +
        'Edit</button>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<button type="button" class="btn btn-danger">Remove</button>',
        '</a>'
    ].join('');
}
window.operateEvents = {
    'click .like': function (e, value, row, index) {
        //alert('You click like action, row: ' + JSON.stringify(row));
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