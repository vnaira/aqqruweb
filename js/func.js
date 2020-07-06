$(document).ready(function () {
    "use strict";

    $(".sent_msg").on('click', function () {
        $('.msg_history').find('.active').removeClass('active');
        $(this).parent().find('.edit_delete').toggleClass('active');
    });

    $("#single-select .answer-btn").on('click', function () {
        $('#outgoing_value').val($(this).text());
        if ($('#outgoing_value').val() == $(this).text()) {
            $(this).addClass('active');
            $("#chat-form").submit();
            return false;
        }
    });

    $("#multiselect .answer-btn").on('click', function () {
        let answer = $('#outgoing_value').val();
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            if (answer !== '') {
                answer += ',' + $(this).text();
            } else {
                answer += $(this).text();
            }
        } else {
            let currentVal = ($('#outgoing_value').val()).split(',');
            var result = arrayRemove(currentVal, $(this).text());
            answer = result.join(',');
        }
        $('#outgoing_value').val(answer);
    });


    $("#button-send").click(function (event) {
        var form = $("#chat-form");
        if (form[0].checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
            $('.invalid-feedback').css('display', 'block');
        } else {
            $('.invalid-feedback').css('display', 'none');
        }
    });


    function arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele != value;
        });
    }

    $('.children').on('click', function () {
        $(this).parents('.btn-toolbar').find('.children').removeClass('active');
        $(this).addClass('active');
        var id = $(this).attr('data-name');
        if (id === "one-child") {
            $('.child-age').css('display', 'none');
            $('.child-ages').find("[data-id='one-child']").css('display', 'block');
        } else {
            $('.child-age').css('display', 'block');
        }
    });

    $('.context-menu').on('click', function (e) {
        var offset = $(this).offset();
        var top = offset.top + 20;
        var left = offset.left - 10;
        $("#context-menu").css({
            top: top,
            left: left,
            display: 'block'
        }).addClass("show");
        return false;
    });

    $("#context-menu a").on("click", function () {
        $(this).parent().removeClass("show").hide();
    });

// form submit on press ENTER
    $(document).keyup(function (event) {
        if (event.keyCode == 13) {
            $("#chat-form").submit();
            return false;
        }
    });

    // Currency format
    $('input.number').keyup(function (event) {
        if (event.which >= 37 && event.which <= 40) return;
        // format number
        $(this).val(function (index, value) {
            return '$' + value
                .replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        });
    });
    $('input.object-number').keyup(function (event) {
        $(this).parent().find('.answer-btn').addClass('active');
        if (event.which >= 37 && event.which <= 40) return;
        // format number
        $(this).val(function (index, value) {
            return '$' + value
                .replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        });
    });
    $('input.object-number').focusout(function () {
        if ($(this).val() == "") {
            $(this).parent().find('.answer-btn').removeClass('active');
        }
    });
    $('input.answer-input-child').focusout(function () {
        if ($(this).val() == "") {
            $(this).parent().find('.answer-btn').removeClass('active');
        } else {
            $(this).parent().find('.answer-btn').addClass('active');
            if ($(this).val() > 100 || $(this).val() < 1) {
                $('.error').show();
            } else {
                $('.error').hide();
            }
        }
    });

    // modal js functions
    $(".btn-accept").on('click', function () {
        $(this).parent().removeClass('discarded-income');
        $(this).parent().addClass('accepted-income');
        $(this).parent().find('.accept-icon').css('visibility', 'visible');
        $(this).css('visibility', 'hidden');

        var empty = false;
        if ($('.incoms').find(".discarded-income").length ) { empty = true;}

        if (empty) {
            $('#save-btn').attr('disabled', 'disabled');
        } else {
            $('#save-btn').removeAttr('disabled');
            $('#save-btn a').removeClass('disabled');
        }

    });

    // Form Age field validate
    $(".number-age").keyup(function () {
        if ($(this).val() < 18 || $(this).val() > 120) {
            $("#button-send").attr("disabled", true);
            $('.error').show();

        } else {
            $('.error').hide();
            $("#button-send").removeAttr("disabled");
        }
    });

//After closing modal hide edit-delete message bar
    $('#confirmDelete').on('hidden.bs.modal', function () {
        //console.log($('.msg_history').find('.active'));
        $('.msg_history').find('.active').removeClass('active');
    });


    // browser back button event
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            window.location.replace("");
        });
    }

    $("#save-btn").click(function() {
        $("#form").submit(); // implement form submit
        $("#goals-carousel").carousel('next');
    });

    $('#total-expense').on("input", function(){
        var part_val = $(this).val().replace(/,/g , '');
        $('.expense-part').val(part_val.substring(1)/5);
    });


    $('[data-toggle="tooltip"]').tooltip();

    // form email validation
    function validateEmail($email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test( $email );
    }

    $("#inputEmail").keyup(function () {
        if( !validateEmail($(this).val())){
            $('.invalid-feedback').show();
            $(this).addClass('error');
        } else {
            $('.invalid-feedback').hide();
            $(this).removeClass('error');
        }
    });
    $("#pswd-confirm").keyup(function () {
        if($('#pswd').val() != $('#pswd-confirm').val()) {
            $('.error-confirm-pwd').show();
        } else {
            $('.error-confirm-pwd').hide();
        }
    });

});
