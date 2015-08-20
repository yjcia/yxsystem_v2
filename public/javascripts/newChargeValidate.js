/**
 * Created by YanJun on 2015/7/6.
 */
$(document).ready(function () {

    $('#chargeAddForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            amount: {
                message: 'The amount is not valid',
                validators: {
                    notEmpty: {
                        message: 'Required and cannot be empty'
                    },
                    stringLength: {
                        min: 1,
                        max: 6,
                        message: 'Must be more than 1 and less than 6 characters long'
                    },
                    regexp: {
                        regexp: /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/,
                        message: 'Can only consist number,just support 2 digit value'
                    }

                }
            }

        }
    });

});
