/**
 * Created by YanJun on 2015/7/6.
 */
$(document).ready(function () {
    $('#loginForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            password: {
                message: 'The password is not valid',
                validators: {
                    notEmpty: {
                        message: 'Required and cannot be empty'
                    },
                    stringLength: {
                        min: 6,
                        max: 10,
                        message: 'Must be more than 6 and less than 10 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: 'Can only consist of alphabetical, number and underscore'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email is required and cannot be empty'
                    },
                    emailAddress: {
                        message: 'The input is not a valid email address'
                    }
                }
            }
        }
    });

    $('#registerForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                message: 'The username is not valid',
                validators: {
                    notEmpty: {
                        message: 'Required and cannot be empty'
                    },
                    stringLength: {
                        min: 6,
                        max: 10,
                        message: 'Must be more than 6 and less than 10 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: 'Can only consist of alphabetical, number and underscore'
                    }
                }
            },
            password: {
                message: 'The password is not valid',
                validators: {
                    notEmpty: {
                        message: 'Required and cannot be empty'
                    },
                    stringLength: {
                        min: 6,
                        max: 10,
                        message: 'Must be more than 6 and less than 10 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: 'Can only consist of alphabetical, number and underscore'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Required and cannot be empty'
                    },
                    emailAddress: {
                        message: 'The input is not a valid email address'
                    }
                }
            }
        }
    });

});
function generateNoty(text) {
    var n = noty({
        text: text,
        type: 'error',
        dismissQueue: true,
        layout: 'top',
        theme: 'defaultTheme'
    });
    console.log('html: ' + n.options.id);
};